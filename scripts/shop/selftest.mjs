// Self-test for the shop's pure logic: the preorder-bonus rules and the signed
// delivery tokens. Both decide who gets a paid product for free, so they are
// worth asserting before any of it touches Stripe.
//
// Run: npm run test:shop
//
// No test framework in this project by design — plain node, run through tsx
// so the extensionless relative imports resolve.

process.env.SHOP_TOKEN_SECRET = "x".repeat(48);

const here = new URL(".", import.meta.url).pathname;
const lib = `${here}../../src/lib/shop`;

const { signDeliveryToken, verifyDeliveryToken } = await import(`${lib}/entitlement.ts`);
const { entitlementsFor, purchasableProducts, isPurchasable, requiresShipping, getShopPhase, shopCopy } =
  await import(`${lib}/catalog.ts`);
const { orderFromSession, orderEntitlements } = await import(`${lib}/orders.ts`);
const { shopConfigProblems } = await import(`${lib}/stripe.ts`);
const { buildLabelsPdf, LABEL_SHEET, FILLABLE_PAGES, BLANK_PAGES } = await import(`${lib}/labels-pdf.ts`);
const { BOOK_RECIPES } = await import(`${lib}/recipes.ts`);
const { PDFDocument } = await import("pdf-lib");

let pass = 0;
let fail = 0;
const check = (name, cond) => {
  if (cond) { pass++; console.log("  ok    " + name); }
  else { fail++; console.log("  FAIL  " + name); }
};

console.log("\n-- entitlements (the preorder bonus) --");
check("preorder book grants labels", JSON.stringify(entitlementsFor(["book"], "preorder")) === '["labels"]');
check("launched book grants nothing", entitlementsFor(["book"], "launched").length === 0);
check("labels purchase grants labels", JSON.stringify(entitlementsFor(["labels"], "launched")) === '["labels"]');
check("book+labels not double-granted", entitlementsFor(["book", "labels"], "preorder").length === 1);
check("empty order grants nothing", entitlementsFor([], "preorder").length === 0);

console.log("\n-- phase gating --");
check("preorder sells book only", purchasableProducts("preorder").length === 1);
check("labels NOT sellable during preorder", !isPurchasable("labels", "preorder"));
check("labels sellable after launch", isPurchasable("labels", "launched"));
check("book sellable in both", isPurchasable("book", "preorder") && isPurchasable("book", "launched"));
check("book requires shipping", requiresShipping(["book"]));
check("labels alone require no shipping", !requiresShipping(["labels"]));
check("phase defaults to preorder when unset", getShopPhase() === "preorder");

console.log("\n-- token round trip --");
const payload = { session: "cs_test_123", phase: "preorder", iat: 1755400000 };
const token = signDeliveryToken(payload);
const back = verifyDeliveryToken(token);
check("valid token verifies", back !== null);
check("token carries no email (PII stays out of URLs)", !token.includes(Buffer.from("@").toString("base64url")) && back?.email === undefined);
check("session survives", back?.session === "cs_test_123");
check("purchase-time phase survives", back?.phase === "preorder");

console.log("\n-- tamper resistance --");
check("edited payload rejected", verifyDeliveryToken("A" + token.slice(1)) === null);
check("edited signature rejected", verifyDeliveryToken(token.slice(0, -1) + "A") === null);
check("truncated token rejected", verifyDeliveryToken(token.slice(0, 12)) === null);
check("no-dot garbage rejected", verifyDeliveryToken("garbage") === null);
check("empty string rejected", verifyDeliveryToken("") === null);
check("payload-only rejected", verifyDeliveryToken(token.split(".")[0]) === null);

// The forgeries that matter: pointing a real signature at someone else's
// order, or upgrading a launched-phase order to the phase that carried the
// free labels while keeping its genuine signature.
const forgedSession = Buffer.from(JSON.stringify({ ...payload, session: "cs_test_victim" })).toString("base64url");
check("session swap with a real signature rejected", verifyDeliveryToken(forgedSession + "." + token.split(".")[1]) === null);
const launchedToken = signDeliveryToken({ ...payload, phase: "launched" });
const upgraded = Buffer.from(JSON.stringify({ ...payload, phase: "preorder" })).toString("base64url");
check("phase upgrade with the launched order's real signature rejected", verifyDeliveryToken(upgraded + "." + launchedToken.split(".")[1]) === null);
check("(control) the launched token itself verifies", verifyDeliveryToken(launchedToken)?.phase === "launched");

console.log("\n-- secret handling --");
const saved = process.env.SHOP_TOKEN_SECRET;
process.env.SHOP_TOKEN_SECRET = "tooshort";
let threw = false;
try { signDeliveryToken(payload); } catch { threw = true; }
check("short secret throws on sign", threw);
check("short secret makes verify fail closed", verifyDeliveryToken(token) === null);
process.env.SHOP_TOKEN_SECRET = saved;
check("restored secret verifies again", verifyDeliveryToken(token) !== null);

console.log("\n-- orders read back from Stripe (pure) --");
// A session shaped the way getOrder() retrieves it: payment_intent.latest_charge expanded.
const session = (over = {}) => ({
  id: "cs_test_abc",
  payment_status: "paid",
  amount_total: 3400,
  currency: "usd",
  customer_details: { email: "Jane@Example.com" },
  collected_information: { shipping_details: { name: "Jane", address: { line1: "1 Main", city: "Austin", state: "TX", postal_code: "78701", country: "US" } } },
  metadata: { shop_phase: "preorder", product_ids: "book", ship_estimate: "November 2026" },
  payment_intent: { id: "pi_1", metadata: {}, latest_charge: { amount: 3400, amount_captured: 3400, amount_refunded: 0, refunded: false } },
  ...over,
});
const o = orderFromSession(session());
check("email lowercased", o.email === "jane@example.com");
check("phase read from purchase-time metadata", o.phase === "preorder");
check("products read from metadata", JSON.stringify(o.productIds) === '["book"]');
check("ship estimate read from metadata", o.shipEstimate === "November 2026");
check("preorder book order carries labels", orderEntitlements(o).includes("labels"));
check("shipping address mapped", o.shipping?.city === "Austin" && o.shipping?.postalCode === "78701");
check("not refunded", o.refunded === false && o.paid === true);
check("fulfilment marker absent", o.fulfilledAt === null);
const launchedBook = orderFromSession(session({ metadata: { shop_phase: "launched", product_ids: "book" } }));
check("launched book order carries NO labels", !orderEntitlements(launchedBook).includes("labels"));
const foreign = orderFromSession(session({ metadata: {} }));
check("session without our metadata grants nothing", orderEntitlements(foreign).length === 0 && foreign.productIds.length === 0);
const junk = orderFromSession(session({ metadata: { shop_phase: "preorder", product_ids: "book,gold,labels" } }));
check("unknown product ids dropped", JSON.stringify(junk.productIds) === '["book","labels"]');
const fullRefund = orderFromSession(session({ payment_intent: { id: "pi_1", metadata: {}, latest_charge: { amount: 3400, amount_captured: 3400, amount_refunded: 3400, refunded: true } } }));
check("full refund revokes", fullRefund.refunded === true);
const partial = orderFromSession(session({ payment_intent: { id: "pi_1", metadata: {}, latest_charge: { amount: 3400, amount_captured: 3400, amount_refunded: 500, refunded: false } } }));
check("partial refund (e.g. shipping) does not revoke", partial.refunded === false);
const marked = orderFromSession(session({ payment_intent: { id: "pi_1", metadata: { fulfilled_at: "2026-09-08T00:00:00Z" }, latest_charge: null } }));
check("fulfilment marker read from PaymentIntent", marked.fulfilledAt === "2026-09-08T00:00:00Z");
const unpaid = orderFromSession(session({ payment_status: "unpaid", payment_intent: "pi_2" }));
check("unpaid with unexpanded PI", unpaid.paid === false && unpaid.paymentIntentId === "pi_2");
// A 100%-off promotion code: no payment, no PaymentIntent, still owed the goods.
const free = orderFromSession(session({ payment_status: "no_payment_required", amount_total: 0, payment_intent: null }));
check("zero-total order counts as paid", free.paid === true && free.paymentIntentId === null);
check("zero-total order still grants labels", orderEntitlements(free).includes("labels"));
const freeMarked = orderFromSession(session({ payment_status: "no_payment_required", payment_intent: null, metadata: { shop_phase: "preorder", product_ids: "book", fulfilled_at: "2026-09-09T00:00:00Z" } }));
check("fulfilment marker read from the session when there is no PI", freeMarked.fulfilledAt === "2026-09-09T00:00:00Z");
const expired = orderFromSession(session({ status: "expired", payment_status: "unpaid" }));
check("session status surfaces", expired.status === "expired");

console.log("\n-- shop config gate --");
const env = { ...process.env };
delete process.env.STRIPE_SECRET_KEY; delete process.env.STRIPE_PRICE_BOOK; delete process.env.STRIPE_PRICE_LABELS; delete process.env.SHOP_SHIP_ESTIMATE;
check("nothing configured -> shop closed", shopConfigProblems("preorder").length > 0);
process.env.STRIPE_SECRET_KEY = "sk_test_x"; process.env.STRIPE_PRICE_BOOK = "price_book";
check("preorder without ship estimate is refused (FTC)", shopConfigProblems("preorder").includes("SHOP_SHIP_ESTIMATE"));
process.env.SHOP_SHIP_ESTIMATE = "November 2026";
check("preorder fully configured", shopConfigProblems("preorder").length === 0);
check("launched needs the labels price too", shopConfigProblems("launched").includes("STRIPE_PRICE_LABELS"));
process.env.STRIPE_PRICE_LABELS = "price_labels";
check("launched fully configured", shopConfigProblems("launched").length === 0);
process.env.SHOP_TOKEN_SECRET = "short";
check("weak token secret closes the shop", shopConfigProblems("launched").some((m) => m.startsWith("SHOP_TOKEN_SECRET")));
for (const k of Object.keys(process.env)) if (!(k in env)) delete process.env[k];
Object.assign(process.env, env);
check("copy: waitlist", shopCopy("waitlist").cta === "Join the Waitlist");
check("copy: preorder", shopCopy("preorder").cta === "Preorder the Book");

console.log("\n-- labels PDF --");
const geometry = LABEL_SHEET.marginLeft * 2 + LABEL_SHEET.columns * LABEL_SHEET.labelWidth + (LABEL_SHEET.columns - 1) * LABEL_SHEET.gutterX;
check("label columns span the page width exactly", Math.abs(geometry - LABEL_SHEET.pageWidth) < 0.01);
check("label rows fit above the footer", LABEL_SHEET.marginTop + LABEL_SHEET.rows * LABEL_SHEET.labelHeight <= LABEL_SHEET.pageHeight - 24);
check("35 book recipes seed the combo box", BOOK_RECIPES.length === 35 && new Set(BOOK_RECIPES).size === 35);
const bytes = await buildLabelsPdf({ email: "jane@example.com", createdAt: new Date("2026-09-08T00:00:00Z") });
const pdf = await PDFDocument.load(bytes);
const perPage = LABEL_SHEET.columns * LABEL_SHEET.rows;
check("pdf has fillable + blank pages", pdf.getPageCount() === FILLABLE_PAGES + BLANK_PAGES);
const fields = pdf.getForm().getFields();
check("three fields per label on fillable pages only", fields.length === FILLABLE_PAGES * perPage * 3);
const dd = pdf.getForm().getDropdown("recipe_p1_1");
check("recipe box lists the book's recipes", dd.getOptions().length === BOOK_RECIPES.length);
check("recipe box is editable (type your own)", dd.isEditable());
check("buyer email stamped in metadata", pdf.getSubject() === "Licensed to jane@example.com");
const again = await buildLabelsPdf({ email: "jane@example.com", createdAt: new Date("2026-09-08T00:00:00Z") });
check("deterministic for the same buyer", Buffer.compare(Buffer.from(bytes), Buffer.from(again)) === 0);
const other = await buildLabelsPdf({ email: "sam@example.com", createdAt: new Date("2026-09-08T00:00:00Z") });
check("different buyer -> different file", Buffer.compare(Buffer.from(bytes), Buffer.from(other)) !== 0);
check("under 1 MB", bytes.byteLength < 1_000_000);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
