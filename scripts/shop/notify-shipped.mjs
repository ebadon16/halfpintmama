// Sends "your book is on its way" to every paid book order that has not been
// marked shipped, then marks it in Stripe so it is never sent twice.
//
//   node --env-file=.env.local node_modules/.bin/tsx scripts/shop/notify-shipped.mjs           # dry run: lists who would get it
//   node --env-file=.env.local node_modules/.bin/tsx scripts/shop/notify-shipped.mjs --send    # sends + marks
//   ... --send --only=cs_test_abc,cs_test_def                                                   # just these orders
//
// Run it the day the books go in the mail. Uses the LIVE key from the env you
// point it at, so run it against production env values when it is real.
const lib = process.cwd() + "/src/lib/shop";
const { findUnshippedBookOrders, markShipped } = await import(`${lib}/orders.ts`);
const { sendShippedNotice } = await import(`${lib}/email.ts`);

const send = process.argv.includes("--send");
const only = (process.argv.find((a) => a.startsWith("--only="))?.slice(7) || "").split(",").filter(Boolean);

const orders = (await findUnshippedBookOrders()).filter((o) => !only.length || only.includes(o.sessionId));
if (!orders.length) { console.log("No unshipped book orders."); process.exit(0); }
console.log(`${orders.length} unshipped book order(s)${send ? ", sending" : " (dry run; add --send)"}:\n`);
let sent = 0;
for (const o of orders) {
  const line = `${o.sessionId}  ${o.email}  x${o.quantity}  ${o.phase}  ${[o.shipping?.city, o.shipping?.state].filter(Boolean).join(", ")}`;
  if (!send || !o.email) { console.log("  " + line + (o.email ? "" : "  (no email!)")); continue; }
  try {
    await sendShippedNotice(o, o.email);
    await markShipped(o);
    sent++;
    console.log("  sent  " + line);
  } catch (err) {
    console.log("  FAILED " + line + "  " + (err instanceof Error ? err.message : err));
  }
}
if (send) console.log(`\n${sent}/${orders.length} sent and marked shipped.`);
