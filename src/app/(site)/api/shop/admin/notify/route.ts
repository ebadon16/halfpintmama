// Keegan's buyer notices, run where the live Stripe key lives. The key is a
// sensitive Vercel variable that cannot be read back out, so the delay and
// shipped notices (scripts/shop/notify-*.mjs locally) also run here on demand.
//
//   curl -X POST https://halfpintmama.com/api/shop/admin/notify \
//     -H "Authorization: Bearer $SHOP_ADMIN_SECRET" -H "Content-Type: application/json" \
//     -d '{"kind":"delay","to":"late November 2026"}'                    # dry run: who, and the date each was told
//     -d '{"kind":"delay","to":"late November 2026","send":true}'        # sends + marks, up to `limit` (default 8) per call
//     -d '{"kind":"shipped","send":true}'                                # the "on its way" notice, same shape
//     -d '{"kind":"review","send":true}'                                 # review ask, shipped orders not yet asked
//     -d '{"kind":"report"}'                                             # every paid book order, grouped by utm source
//
// Each buyer is marked in Stripe as they are sent, so the call is safe to
// repeat until it reports nobody left. `only` narrows to listed session ids.
import { NextRequest, NextResponse } from "next/server";
import { getClientIp, safeEquals } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { effectiveShipEstimate, findBookOrders, findReviewableBookOrders, findUnshippedBookOrders, markDelayNotified, markReviewAsked, markShipped, type Order } from "@/lib/shop/orders";
import { sendDelayNotice, sendReviewRequest, sendShippedNotice } from "@/lib/shop/email";
import { getShipEstimate } from "@/lib/shop/stripe";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Body {
  kind?: "delay" | "shipped" | "review" | "report";
  to?: string;
  send?: boolean;
  only?: string[];
  limit?: number;
}

function row(o: Order, result: string) {
  return {
    sessionId: o.sessionId,
    email: o.email,
    quantity: o.quantity,
    phase: o.phase,
    told: effectiveShipEstimate(o),
    where: [o.shipping?.city, o.shipping?.state].filter(Boolean).join(", "),
    source: o.attribution.utm_source ?? null,
    campaign: o.attribution.utm_campaign ?? null,
    result,
  };
}

// Orders by where the buyer came from, so an email or a post can be judged by
// what it sold. "direct" is an order with no utm on the landing URL.
function report(orders: Order[]) {
  const by = new Map<string, { orders: number; copies: number; revenue: number }>();
  for (const o of orders) {
    const key = [o.attribution.utm_source ?? "direct", o.attribution.utm_campaign].filter(Boolean).join(" / ");
    const row = by.get(key) ?? { orders: 0, copies: 0, revenue: 0 };
    row.orders++;
    row.copies += o.quantity;
    row.revenue += o.amountTotal ?? 0;
    by.set(key, row);
  }
  return {
    orders: orders.length,
    copies: orders.reduce((n, o) => n + o.quantity, 0),
    bySource: Object.fromEntries([...by.entries()].sort((a, b) => b[1].orders - a[1].orders)),
    rows: orders
      .sort((a, b) => (b.created?.getTime() ?? 0) - (a.created?.getTime() ?? 0))
      .map((o) => ({ ...row(o, o.shippedAt ? "shipped" : o.phase), when: o.created?.toISOString().slice(0, 10) ?? null })),
  };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`shop-admin:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const expected = process.env.SHOP_ADMIN_SECRET;
  if (!expected || expected.length < 32) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!safeEquals(given, expected)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!process.env.STRIPE_SECRET_KEY || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY and RESEND_API_KEY are required" }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "JSON body required" }, { status: 400 });
  }
  const kind = body.kind;
  if (kind !== "delay" && kind !== "shipped" && kind !== "review" && kind !== "report") {
    return NextResponse.json({ error: 'kind must be "delay", "shipped", "review" or "report"' }, { status: 400 });
  }
  if (kind === "report") return NextResponse.json({ kind, ...report(await findBookOrders()) });
  const send = body.send === true;
  const only = Array.isArray(body.only) ? body.only.filter((s): s is string => typeof s === "string") : [];
  const limit = Math.min(Math.max(Number(body.limit) || 8, 1), 25);

  let to = "";
  if (kind === "delay") {
    to = (body.to ?? "").trim();
    const current = getShipEstimate() ?? "";
    if (!to) return NextResponse.json({ error: 'delay needs "to": the new ship estimate' }, { status: 400 });
    // New buyers are quoted SHOP_SHIP_ESTIMATE at checkout; the notice must say the same thing.
    if (to.toLowerCase() !== current.toLowerCase()) {
      return NextResponse.json({ error: `"to" must equal SHOP_SHIP_ESTIMATE ("${current}") so new buyers and this notice agree` }, { status: 400 });
    }
  }

  const pool = kind === "review" ? await findReviewableBookOrders() : await findUnshippedBookOrders();
  const all = pool.filter((o) => !only.length || only.includes(o.sessionId));
  const skipped = kind === "delay" ? all.filter((o) => (effectiveShipEstimate(o) ?? "").toLowerCase() === to.toLowerCase()) : [];
  const due = kind === "delay" ? all.filter((o) => !skipped.includes(o)) : all;

  const rows: ReturnType<typeof row>[] = [];
  let sent = 0;
  let failed = 0;
  for (const o of due) {
    if (!send) { rows.push(row(o, o.email ? "would send" : "NO EMAIL")); continue; }
    if (rows.length >= limit) { rows.push(row(o, "left for next call")); continue; }
    if (!o.email) { rows.push(row(o, "NO EMAIL, skipped")); continue; }
    try {
      if (kind === "delay") {
        await sendDelayNotice(o, o.email, to);
        await markDelayNotified(o, to);
      } else if (kind === "review") {
        await sendReviewRequest(o, o.email);
        await markReviewAsked(o);
      } else {
        await sendShippedNotice(o, o.email);
        await markShipped(o);
      }
      sent++;
      rows.push(row(o, "sent"));
      // Resend allows 2 requests a second.
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      failed++;
      rows.push(row(o, `FAILED: ${err instanceof Error ? err.message : String(err)}`));
    }
  }

  return NextResponse.json({
    kind,
    to: to || undefined,
    mode: send ? "send" : "dry-run",
    found: all.length,
    alreadyCurrent: skipped.length,
    due: due.length,
    sent,
    failed,
    remaining: send ? due.length - sent - failed : due.length,
    rows,
  });
}
