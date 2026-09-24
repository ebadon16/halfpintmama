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
const { buildLabelsPdf, LABEL_SHEET, FILLABLE_PAGES, TOTAL_PAGES } = await import(`${lib}/labels-pdf.ts`);
const { BOOK_RECIPES, RECIPES } = await import(`${lib}/recipes.ts`);
const { renderOrderConfirmation, renderShippedNotice, renderLabelsRecovery, renderOrderNotification } = await import(`${lib}/email.ts`);
const { PDFDocument, PDFName } = await import("pdf-lib");

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
check("quantity defaults to 1 without line items", o.quantity === 1);
const two = orderFromSession(session({ line_items: { data: [{ quantity: 2 }] } }));
check("quantity read from the line item", two.quantity === 2);
check("shipped marker absent by default", o.shippedAt === null);

console.log("\n-- emails (rendered, never sent) --");
const hostile = orderFromSession(session({ collected_information: { shipping_details: { name: "<script>alert(1)</script>", address: { line1: "1 Main", city: "Austin", state: "TX", postal_code: "78701", country: "US" } } }, metadata: { shop_phase: "preorder", product_ids: "book", ship_estimate: "<b>Nov</b> 2026" } }));
const conf = renderOrderConfirmation(hostile, "https://halfpintmama.com/shop/labels/abc.def");
check("confirmation escapes the shipping name", !conf.html.includes("<script>") && conf.html.includes("&lt;script&gt;"));
check("confirmation escapes the ship estimate", !conf.html.includes("<b>Nov</b>"));
check("confirmation carries the labels link", conf.html.includes("/shop/labels/abc.def") && conf.text.includes("/shop/labels/abc.def"));
check("preorder confirmation says preorder", /preorder/i.test(conf.subject));
const launchedBookConf = renderOrderConfirmation(orderFromSession(session({ metadata: { shop_phase: "launched", product_ids: "book" } })), null);
check("launched book confirmation has no labels section", !launchedBookConf.html.includes("Open my labels") && !/preorder/i.test(launchedBookConf.subject));
check("quantity shows in the order line", renderOrderConfirmation(two, null).html.includes("Rest &amp; Rise \u00d7 2"));
check("quantity shows in the plain-text order line", renderOrderConfirmation(two, null).text.includes("Rest & Rise \u00d7 2"));
check("shipped notice pluralises", /2 copies/.test(renderShippedNotice(two).html) && /your copy/.test(renderShippedNotice(o).html));
check("recovery email is just the link", renderLabelsRecovery("https://halfpintmama.com/shop/labels/x.y").html.includes("/shop/labels/x.y"));
check("owner notification carries the address", renderOrderNotification(o, "jane@example.com").html.includes("Austin"));
check("every email carries the logo and sign-off", [conf, renderShippedNotice(o), renderLabelsRecovery("https://x/y"), renderOrderNotification(o, null)].every((m) => m.html.includes("email-logo.png") && m.html.includes("With love,")));

console.log("\n-- shop config gate --");
const env = { ...process.env };
for (const k of ["STRIPE_SECRET_KEY","STRIPE_PRICE_BOOK","STRIPE_PRICE_LABELS","SHOP_SHIP_ESTIMATE","STRIPE_WEBHOOK_SECRET","RESEND_API_KEY"]) delete process.env[k];
check("nothing configured -> shop closed", shopConfigProblems("preorder").length > 0);
process.env.STRIPE_SECRET_KEY = "sk_test_x"; process.env.STRIPE_PRICE_BOOK = "price_book";
check("preorder without ship estimate is refused (FTC)", shopConfigProblems("preorder").includes("SHOP_SHIP_ESTIMATE"));
process.env.SHOP_SHIP_ESTIMATE = "November 2026";
// Taking money with no way to fulfil or even report the order is worse than staying shut.
check("no webhook secret keeps the shop shut", shopConfigProblems("preorder").some((m) => m.startsWith("STRIPE_WEBHOOK_SECRET")));
process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
check("no Resend key keeps the shop shut", shopConfigProblems("preorder").some((m) => m.startsWith("RESEND_API_KEY")));
process.env.RESEND_API_KEY = "re_x";
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

console.log("\n-- foreign sessions --");
const { fulfilOrder } = await import(`${lib}/fulfil.ts`);
// The webhook fires for every Checkout Session on the account. A Payment Link
// or another product's sale must never be fulfilled as a cookbook order.
const foreignSession = orderFromSession(session({ metadata: {} }));
check("session with no products is refused before any Stripe call", (await fulfilOrder(foreignSession)) === "not-ours");
const junkMeta = orderFromSession(session({ metadata: { product_ids: "widget", shop_phase: "preorder" } }));
check("session whose products we do not sell is refused", (await fulfilOrder(junkMeta)) === "not-ours");
check("our own paid session is not refused as foreign", orderFromSession(session()).productIds.length > 0);

console.log("\n-- owner notification --");
const paidOrder = orderFromSession(session());
const okNote = renderOrderNotification(paidOrder, "jane@example.com");
check("normal owner note is a plain new-order", okNote.subject.startsWith("\u{1F6D2}") && !/ATTENTION/.test(okNote.subject));
const failNote = renderOrderNotification(paidOrder, null, { buyerEmailFailed: true });
check("failed buyer email shouts in the subject", /NEEDS ATTENTION/.test(failNote.subject));
check("failed buyer email tells Keegan what to do", /did not go out/.test(failNote.html) && /resend the link/i.test(failNote.html));
check("failed buyer email says so in plain text too", /CONFIRMATION EMAIL FAILED/.test(failNote.text));

console.log("\n-- price shape --");
const { formatMoney } = await import(`${lib}/prices.ts`);
check("money formats whole dollars without cents", formatMoney(3400, "usd") === "$34");
check("money formats part dollars with cents", formatMoney(3450, "usd") === "$34.50");
check("money respects currency", formatMoney(3400, "eur").includes("34"));

console.log("\n-- labels PDF --");
const geometry = LABEL_SHEET.marginLeft * 2 + LABEL_SHEET.columns * LABEL_SHEET.labelWidth + (LABEL_SHEET.columns - 1) * LABEL_SHEET.gutterX;
check("label columns span the page width exactly", Math.abs(geometry - LABEL_SHEET.pageWidth) < 0.01);
check("label rows fit above the footer", LABEL_SHEET.marginTop + LABEL_SHEET.rows * LABEL_SHEET.labelHeight <= LABEL_SHEET.pageHeight - 24);
check("35 book recipes seed the combo box", BOOK_RECIPES.length === 35 && new Set(BOOK_RECIPES).size === 35);
const bytes = await buildLabelsPdf({ email: "jane@example.com", createdAt: new Date("2026-09-08T00:00:00Z") });
const pdf = await PDFDocument.load(bytes);
const perPage = LABEL_SHEET.columns * LABEL_SHEET.rows;
check("pdf has guide + fillable + hand-write pages", pdf.getPageCount() === TOTAL_PAGES);
const fields = pdf.getForm().getFields();
check("four fields per label on fillable pages only", fields.length === FILLABLE_PAGES * perPage * 4);
const dd = pdf.getForm().getDropdown("recipe_p1_1");
check("recipe box lists the book's recipes, in capitals", dd.getOptions().length === BOOK_RECIPES.length && dd.getOptions().every((o) => o === o.toUpperCase()));
check("recipe box is editable (type your own)", dd.isEditable());
check("recipe box commits on selection", (dd.acroField.getFlags() & (1 << 26)) !== 0);
check("recipe box carries the auto-fill action", String(dd.acroField.dict.get(PDFName.of("AA"))).includes("rrFill"));
check("document carries the directions script", String(pdf.catalog.lookup(PDFName.of("Names"))).includes("JavaScript"));
check("every recipe has directions, a best-by line and a yield", RECIPES.every((r) => r.directions.length > 20 && /^Best by .*use within 12 months$/.test(r.keeps) && r.yield));
check("only the sealed sandwiches are best by 1–2 months", RECIPES.filter((r) => r.keeps.startsWith("Best by 1–2")).map((r) => r.name).join() === "Little Sealed Sandwiches");
check("directions fit the label field", RECIPES.every((r) => r.directions.length <= 420));
check("directions never say Instant Pot or Crockpot", RECIPES.every((r) => !/instant pot|crock ?pot/i.test(r.directions + r.name)));
check("casseroles bake from frozen per the book", ["Nesting Ziti", "Better Than the Box Beef and Pasta Bake"].every((n) => /375°F covered 75 min/.test(RECIPES.find((r) => r.name === n).directions)));
check("freezer bags rinse under cool water, never warm", RECIPES.every((r) => !/warm (tap )?water/i.test(r.directions)));
check("buyer email stamped in metadata", pdf.getSubject() === "Licensed to jane@example.com");
const again = await buildLabelsPdf({ email: "jane@example.com", createdAt: new Date("2026-09-08T00:00:00Z") });
check("deterministic for the same buyer", Buffer.compare(Buffer.from(bytes), Buffer.from(again)) === 0);
const other = await buildLabelsPdf({ email: "sam@example.com", createdAt: new Date("2026-09-08T00:00:00Z") });
check("different buyer -> different file", Buffer.compare(Buffer.from(bytes), Buffer.from(other)) !== 0);
check("under 1 MB", bytes.byteLength < 1_000_000);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
