// Sends a sample of the preorder confirmation to an inbox for a real-client check.
// Usage: node --env-file=.env.local node_modules/.bin/tsx scripts/shop/send-sample-email.mjs you@example.com
const lib = process.cwd() + "/src/lib/shop";
const { renderOrderConfirmation } = await import(`${lib}/email.ts`);
const { Resend } = await import("resend");
const TO = process.argv[2] || "erickbadon@hotmail.com";
const order = { sessionId: "cs_test_SAMPLE", email: TO, phase: "preorder", productIds: ["book"], shipEstimate: "November 2026", paid: true, status: "complete", refunded: false, amountTotal: 3900, currency: "usd", shipping: { name: "Sample Buyer", line1: "123 Test Street", line2: null, city: "Austin", state: "TX", postalCode: "78701", country: "US" }, paymentIntentId: "pi_1", fulfilledAt: null };
const m = renderOrderConfirmation(order, "https://halfpintmama.com/shop/labels/SAMPLE-LINK-NOT-LIVE");
const r = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: "Keegan at Half Pint Mama <orders@halfpintmama.com>", to: TO, replyTo: "keegan@halfpintmama.com", subject: "[SAMPLE] " + m.subject, html: m.html, text: m.text });
console.log(r.error ? "ERR " + r.error.message : "sent " + r.data.id);
