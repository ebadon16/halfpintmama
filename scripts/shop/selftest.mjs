// Self-test for the shop's pure logic: the preorder-bonus rules and the signed
// delivery tokens. Both decide who gets a paid product for free, so they are
// worth asserting before any of it touches Stripe.
//
// Run: npm run test:shop
//
// No test framework in this project by design — this is plain node, and node
// strips the TypeScript types natively.

process.env.SHOP_TOKEN_SECRET = "x".repeat(48);

const here = new URL(".", import.meta.url).pathname;
const lib = `${here}../../src/lib/shop`;

const { signDeliveryToken, verifyDeliveryToken } = await import(`${lib}/entitlement.ts`);
const { entitlementsFor, purchasableProducts, isPurchasable, requiresShipping, getShopPhase } =
  await import(`${lib}/catalog.ts`);

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
const payload = { email: "jane@example.com", session: "cs_test_123", phase: "preorder", iat: 1755400000 };
const token = signDeliveryToken(payload);
const back = verifyDeliveryToken(token);
check("valid token verifies", back !== null);
check("email survives", back?.email === "jane@example.com");
check("session survives", back?.session === "cs_test_123");
check("purchase-time phase survives", back?.phase === "preorder");

console.log("\n-- tamper resistance --");
check("edited payload rejected", verifyDeliveryToken("A" + token.slice(1)) === null);
check("edited signature rejected", verifyDeliveryToken(token.slice(0, -1) + "A") === null);
check("truncated token rejected", verifyDeliveryToken(token.slice(0, 12)) === null);
check("no-dot garbage rejected", verifyDeliveryToken("garbage") === null);
check("empty string rejected", verifyDeliveryToken("") === null);
check("payload-only rejected", verifyDeliveryToken(token.split(".")[0]) === null);

// The forgeries that matter: claiming someone else's purchase, or upgrading your
// own order to the phase that carries the free labels.
const forgedEmail = Buffer.from(JSON.stringify({ ...payload, email: "attacker@evil.com" })).toString("base64url");
check("email swap rejected", verifyDeliveryToken(forgedEmail + "." + token.split(".")[1]) === null);
const forgedPhase = Buffer.from(JSON.stringify({ ...payload, phase: "preorder" })).toString("base64url");
check("phase upgrade without valid signature rejected", verifyDeliveryToken(forgedPhase + ".AAAA") === null);

console.log("\n-- secret handling --");
const saved = process.env.SHOP_TOKEN_SECRET;
process.env.SHOP_TOKEN_SECRET = "tooshort";
let threw = false;
try { signDeliveryToken(payload); } catch { threw = true; }
check("short secret throws on sign", threw);
check("short secret makes verify fail closed", verifyDeliveryToken(token) === null);
process.env.SHOP_TOKEN_SECRET = saved;
check("restored secret verifies again", verifyDeliveryToken(token) !== null);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
