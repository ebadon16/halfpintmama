// The shop's transactional email, sent through Resend and NEVER MailerLite.
// A newsletter unsubscribe must never suppress a paid delivery, so the two
// systems are kept apart on purpose.

import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";
import { EMAIL } from "@/lib/email-theme";
import { SITE_URL } from "@/lib/seo";
import { PRODUCTS } from "./catalog";
import { formatMoney } from "./prices";
import type { Order } from "./orders";

const FROM = "Half Pint Mama <orders@halfpintmama.com>";
const REPLY_TO = "keegan@halfpintmama.com";

let client: Resend | null = null;
function resend(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not configured");
    client = new Resend(key);
  }
  return client;
}

function ownerAddress(): string {
  return process.env.SHOP_ORDER_NOTIFY || process.env.NOTIFICATION_EMAIL || "keegan@halfpintmama.com";
}

function shell(title: string, body: string): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, ${EMAIL.terracottaFrom}, ${EMAIL.terracottaTo}); padding: 20px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">${title}</h1>
      </div>
      <div style="background: ${EMAIL.cream}; padding: 24px; border: 1px solid ${EMAIL.border}; border-top: none; border-radius: 0 0 12px 12px; color: ${EMAIL.text}; line-height: 1.6;">
        ${body}
      </div>
      <p style="color: ${EMAIL.footer}; font-size: 12px; text-align: center; margin-top: 20px;">
        Half Pint Mama | halfpintmama.com
      </p>
    </div>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display: inline-block; background: ${EMAIL.terracottaTo}; color: #FFFFFF; padding: 12px 24px; border-radius: 25px; text-decoration: none; margin: 8px 0 20px; font-weight: bold;">${label}</a>`;
}

export type DeliveryReason = "preorder-bonus" | "purchase" | "recovery";

export interface DeliveryEmail {
  to: string;
  deliveryUrl: string;
  reason: DeliveryReason;
  shipEstimate?: string | null;
}

// The labels link. Also what "lost your link" re-sends.
export async function sendLabelsDelivery({ to, deliveryUrl, reason, shipEstimate }: DeliveryEmail): Promise<void> {
  const url = escapeHtml(deliveryUrl);
  const intro =
    reason === "preorder-bonus"
      ? `<p style="margin: 0 0 16px;">Thank you for preordering <em>Rest and Rise</em>! Your book ships ${escapeHtml(shipEstimate || "as soon as it is printed")}. In the meantime, your preorder bonus is ready.</p>`
      : reason === "recovery"
        ? `<p style="margin: 0 0 16px;">Here is your labels link again. It is the same one as before and it does not expire.</p>`
        : `<p style="margin: 0 0 16px;">Thank you! Your printable freezer labels are ready.</p>`;

  const subject =
    reason === "preorder-bonus"
      ? "Your Rest and Rise preorder (and your free freezer labels)"
      : reason === "recovery"
        ? "Your Rest and Rise freezer labels link"
        : "Your Rest and Rise freezer labels";

  const html = shell(
    "Your freezer labels",
    `${intro}
     ${button(url, "Open my labels")}
     <p style="margin: 0 0 12px;"><strong>Open this on a computer to fill in the recipes and dates.</strong> Phones will show the sheet but cannot fill in the boxes.</p>
     <p style="margin: 0 0 12px;">This link is yours to keep. Print as many sheets as you like, whenever you like. The PDF is made for you and carries your email in the footer.</p>
     <p style="margin: 0; color: ${EMAIL.muted}; font-size: 14px;">Lost this email later? Get a fresh link any time at <a href="${SITE_URL}/labels" style="color: ${EMAIL.link};">${SITE_URL.replace("https://", "")}/labels</a>. Questions? Just reply to this email.</p>`
  );

  const text =
    `${reason === "preorder-bonus" ? `Thank you for preordering Rest and Rise! Your book ships ${shipEstimate || "as soon as it is printed"}. In the meantime, your preorder bonus is ready.` : reason === "recovery" ? "Here is your labels link again. It does not expire." : "Thank you! Your printable freezer labels are ready."}\n\n` +
    `Open my labels: ${deliveryUrl}\n\n` +
    `Open this on a computer to fill in the recipes and dates. Phones will show the sheet but cannot fill in the boxes.\n\n` +
    `This link is yours to keep. Print as many sheets as you like. The PDF carries your email in the footer.\n\n` +
    `Lost this email later? Get a fresh link at ${SITE_URL}/labels\n`;

  const { error } = await resend().emails.send({ from: FROM, to, replyTo: REPLY_TO, subject, html, text });
  if (error) throw new Error(`Resend: ${error.message}`);
}

// Keegan's copy of every paid order. For a book this is the packing slip.
export async function sendOrderNotification(order: Order, labelsSentTo: string | null): Promise<void> {
  const items = order.productIds.map((id) => PRODUCTS[id].name).join(" + ") || "(no products in metadata)";
  const total = order.amountTotal != null && order.currency ? formatMoney(order.amountTotal, order.currency) : "?";
  const ship = order.shipping;
  const address = ship
    ? [ship.name, ship.line1, ship.line2, [ship.city, ship.state, ship.postalCode].filter(Boolean).join(", "), ship.country]
        .filter(Boolean)
        .map((l) => escapeHtml(String(l)))
        .join("<br />")
    : null;

  const html = shell(
    `New order: ${escapeHtml(items)}`,
    `<p style="margin: 0 0 12px;"><strong>Total:</strong> ${escapeHtml(total)} (${order.phase})</p>
     <p style="margin: 0 0 12px;"><strong>Buyer:</strong> ${escapeHtml(order.email ?? "unknown")}</p>
     ${address ? `<div style="background: #FFFFFF; padding: 16px; border-radius: 8px; border-left: 4px solid ${EMAIL.accent}; margin: 16px 0;"><strong>Ship to</strong><br />${address}</div>` : `<p style="margin: 0 0 12px;">Digital only, nothing to ship.</p>`}
     <p style="margin: 0 0 12px;"><strong>Labels:</strong> ${labelsSentTo ? `sent to ${escapeHtml(labelsSentTo)}` : "not included in this order"}</p>
     <p style="margin: 0; color: ${EMAIL.muted}; font-size: 14px;">Stripe session ${escapeHtml(order.sessionId)}</p>`
  );

  const { error } = await resend().emails.send({
    from: FROM,
    to: ownerAddress(),
    subject: `🛒 New order: ${items} (${total})`,
    html,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
