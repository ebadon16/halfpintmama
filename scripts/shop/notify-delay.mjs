// The ship date slipped. Tells every paid, unshipped book buyer the new date and
// their right to a full refund (FTC Mail Order Rule), then stamps the revised
// date on the order in Stripe so nobody is told twice and every later read
// (success page, shipped notice) shows the date they were actually given.
//
//   node --env-file=.env.local node_modules/.bin/tsx scripts/shop/notify-delay.mjs --to="mid to late November 2026"          # dry run
//   node --env-file=.env.local node_modules/.bin/tsx scripts/shop/notify-delay.mjs --to="mid to late November 2026" --send   # sends + marks
//   ... --send --only=cs_live_abc,cs_live_def                                                                                  # just these orders
//
// `--to` must match the new SHOP_SHIP_ESTIMATE word for word: buyers who order
// after the env flip were already quoted the new date at checkout and are
// skipped by that comparison. Uses the LIVE key from the env you point it at.
const lib = process.cwd() + "/src/lib/shop";
const { findUnshippedBookOrders, markDelayNotified, effectiveShipEstimate } = await import(`${lib}/orders.ts`);
const { sendDelayNotice } = await import(`${lib}/email.ts`);

const send = process.argv.includes("--send");
const to = (process.argv.find((a) => a.startsWith("--to="))?.slice(5) || "").trim();
const only = (process.argv.find((a) => a.startsWith("--only="))?.slice(7) || "").split(",").filter(Boolean);
if (!to) { console.error('Missing --to="<new ship estimate>", e.g. --to="mid to late November 2026"'); process.exit(2); }
if (process.env.SHOP_SHIP_ESTIMATE && process.env.SHOP_SHIP_ESTIMATE.trim().toLowerCase() !== to.toLowerCase()) {
  console.error(`--to "${to}" does not match SHOP_SHIP_ESTIMATE "${process.env.SHOP_SHIP_ESTIMATE}" in this env. Set the env first so new buyers and this notice agree.`);
  process.exit(2);
}

const all = (await findUnshippedBookOrders()).filter((o) => !only.length || only.includes(o.sessionId));
const current = all.filter((o) => (effectiveShipEstimate(o) ?? "").toLowerCase() === to.toLowerCase());
const orders = all.filter((o) => (effectiveShipEstimate(o) ?? "").toLowerCase() !== to.toLowerCase());
if (current.length) console.log(`${current.length} order(s) already on "${to}", skipped.`);
if (!orders.length) { console.log("Nobody left to notify."); process.exit(0); }
console.log(`${orders.length} order(s) to tell about "${to}"${send ? ", sending" : " (dry run; add --send)"}:\n`);
let sent = 0;
for (const o of orders) {
  const line = `${o.sessionId}  ${o.email}  x${o.quantity}  told "${effectiveShipEstimate(o) ?? "(no date)"}"  ${[o.shipping?.city, o.shipping?.state].filter(Boolean).join(", ")}`;
  if (!send || !o.email) { console.log("  " + line + (o.email ? "" : "  (no email!)")); continue; }
  try {
    await sendDelayNotice(o, o.email, to);
    await markDelayNotified(o, to);
    sent++;
    console.log("  sent  " + line);
  } catch (err) {
    console.log("  FAILED " + line + "  " + (err instanceof Error ? err.message : err));
  }
}
if (send) console.log(`\n${sent}/${orders.length} sent and marked.`);
