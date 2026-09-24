// The shop's transactional email, sent through Resend and NEVER MailerLite.
// A newsletter unsubscribe must never suppress a paid delivery, so the two
// systems are kept apart on purpose.
//
// Design matches the Half Pint Mama newsletter: cream ground, Playfair Display
// (serif fallback), deep green text and button, terracotta links, and Keegan
// signing off in the first person. Every message is rendered by a pure
// render*() so it can be previewed and tested without sending.

import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";
import { SITE_URL } from "@/lib/seo";
import { PRODUCTS } from "./catalog";
import { formatMoney } from "./prices";
import type { Order } from "./orders";

const FROM = "Keegan at Half Pint Mama <orders@halfpintmama.com>";
const REPLY_TO = "keegan@halfpintmama.com";

// The newsletter palette, byte for byte (see the MailerLite campaign source).
const T = {
  bg: "#FEF4E8",
  text: "#073704", // on cream: 12.9
  heading: "#073704",
  button: "#093E06", // cream text on it: 12.4
  buttonText: "#FEF4E8",
  link: "#A0562F", // on cream: 5.0
  rule: "#CFBC9A",
  panel: "#FFFFFF",
  font: "'Playfair Display', Georgia, 'Times New Roman', serif",
} as const;

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

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

// ---- building blocks -------------------------------------------------------

const P = `margin: 0 0 16px; font-family: ${T.font}; font-size: 16px; line-height: 150%; color: ${T.text};`;
const SMALL = `margin: 0 0 12px; font-family: ${T.font}; font-size: 14px; line-height: 150%; color: ${T.text};`;

function p(inner: string): string {
  return `<p style="${P}">${inner}</p>`;
}

function button(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 4px 0 20px;">
      <tr>
        <td align="center" bgcolor="${T.button}" style="border-radius: 8px;">
          <a href="${href}" style="display: inline-block; padding: 13px 24px; font-family: ${T.font}; font-size: 15px; font-weight: 500; color: ${T.buttonText}; text-decoration: none; border-radius: 8px;">${label}</a>
        </td>
      </tr>
    </table>`;
}

function panel(inner: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 20px;">
      <tr>
        <td bgcolor="${T.panel}" style="padding: 16px 20px; border-radius: 8px; border-left: 4px solid ${T.button};">${inner}</td>
      </tr>
    </table>`;
}

// One shell for every message: heading, body, Keegan's sign-off, site footer.
function shell(heading: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin: 0; padding: 0; background: ${T.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${T.bg}" style="background: ${T.bg};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="padding: 0 8px;">
              <p style="margin: 0 0 24px; text-align: center;">
                <a href="${SITE_URL}" style="text-decoration: none;"><img src="${SITE_URL}/images/email-logo.png" width="96" height="96" alt="Half Pint Mama" style="display: inline-block; width: 96px; height: 96px; border: 0;" /></a>
              </p>
              <h1 style="margin: 0 0 20px; font-family: ${T.font}; font-size: 30px; font-weight: 600; line-height: 130%; color: ${T.heading};">${heading}</h1>
              ${body}
              ${p("With love,")}
              ${p("Keegan")}
              <p style="${SMALL}"><a href="${SITE_URL}" style="color: ${T.link};">halfpintmama.com</a> | <a href="https://www.instagram.com/halfpint.mama" style="color: ${T.link};">@halfpint.mama</a></p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px;">
                <tr><td style="border-top: 1px solid ${T.rule}; padding-top: 16px;">
                  <p style="margin: 0; font-family: ${T.font}; font-size: 12px; line-height: 150%; color: ${T.text};">Half Pint Mama &middot; Round Rock, Texas &middot; You are receiving this because you ordered from halfpintmama.com. Reply any time and it comes straight to me.</p>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const SIGN_OFF_TEXT = "\nWith love,\nKeegan\nhalfpintmama.com | @halfpint.mama\n";

function orderLines(order: Order): { items: string; total: string; shipTo: string[] } {
  const qty = order.quantity > 1 ? ` \u00d7 ${order.quantity}` : "";
  const items = (order.productIds.map((id) => PRODUCTS[id].name).join(" + ") || "your order") + qty;
  const total = order.amountTotal != null && order.currency ? formatMoney(order.amountTotal, order.currency) : "";
  const ship = order.shipping;
  const shipTo = ship
    ? [ship.name, ship.line1, ship.line2, [ship.city, ship.state, ship.postalCode].filter(Boolean).join(", "), ship.country].filter(
        (l): l is string => !!l
      )
    : [];
  return { items, total, shipTo };
}

const LABELS_HOWTO_HTML =
  p("<strong>One thing to know: open the labels on a computer to fill them in.</strong> A phone will show you the sheet, but the boxes only type on a computer. In Acrobat Reader, Chrome, Edge or Firefox, picking a recipe fills in its freezer directions for you.") +
  p("The link is yours to keep. Print as many sheets as you like, whenever you like. The PDF is made just for you, with your email in the footer.");
const LABELS_HOWTO_TEXT =
  "One thing to know: open the labels on a computer to fill them in. A phone will show you the sheet, but the boxes only type on a computer. In Acrobat Reader, Chrome, Edge or Firefox, picking a recipe fills in its freezer directions for you.\n\n" +
  "The link is yours to keep. Print as many sheets as you like, whenever you like. The PDF is made just for you, with your email in the footer.\n\n";
const LOST_LINK_HTML = `<p style="${SMALL}">Lose this email one day? Get a fresh labels link any time at <a href="${SITE_URL}/shop/labels" style="color: ${T.link};">halfpintmama.com/shop/labels</a>.</p>`;
const LOST_LINK_TEXT = `Lose this email one day? Get a fresh labels link any time at ${SITE_URL}/shop/labels\n`;

// ---- the messages ------------------------------------------------------------

// The buyer's confirmation, sent once for every paid order: what they bought,
// what it cost, where it ships, when, and the labels link if the order carries
// one. This is the email "reply to your confirmation" refers to.
export function renderOrderConfirmation(order: Order, labelsUrl: string | null): RenderedEmail {
  const { items, total, shipTo } = orderLines(order);
  const hasBook = order.productIds.includes("book");
  const preorder = hasBook && order.phase === "preorder";
  const ships = order.shipEstimate ? ` It ships ${escapeHtml(order.shipEstimate)}, and I will email you the moment it is on its way.` : "";

  const subject = preorder
    ? `Your Rest & Rise preorder is in${labelsUrl ? " (and your labels are ready)" : ""}`
    : hasBook
      ? "Your Rest & Rise order is in"
      : "Your Rest & Rise freezer labels are ready";

  const opening = preorder
    ? p("Hi friend,") +
      p(`Thank you for preordering <em>Rest &amp; Rise</em>. Your copy is spoken for, and I will pack it myself.${ships}`)
    : hasBook
      ? p("Hi friend,") + p(`Thank you for your order. Your copy of <em>Rest &amp; Rise</em> is spoken for, and I will pack it myself.${ships}`)
      : p("Hi friend,") + p("Thank you for your order. Your printable freezer labels are ready right now.");

  const summary = panel(
    `<p style="margin: 0 0 6px; font-family: ${T.font}; font-size: 16px; color: ${T.text};"><strong>${escapeHtml(items)}</strong>${total ? ` &middot; ${escapeHtml(total)}` : ""}</p>` +
      (shipTo.length ? `<p style="margin: 0; font-family: ${T.font}; font-size: 14px; line-height: 150%; color: ${T.text};">Shipping to ${shipTo.map(escapeHtml).join(", ")}</p>` : "") +
      `<p style="margin: 6px 0 0; font-family: ${T.font}; font-size: 12px; color: ${T.text};">Order reference ${escapeHtml(order.sessionId)}</p>`
  );

  const labels = labelsUrl
    ? p(preorder ? "<strong>Your preorder bonus is ready now.</strong> The printable freezer labels for every recipe in the book:" : "<strong>Here are your labels:</strong>") +
      button(escapeHtml(labelsUrl), "Open my labels") +
      LABELS_HOWTO_HTML
    : "";

  const cancel = preorder
    ? p("Changed your mind? Reply to this email any time before your book ships and I will refund it in full.")
    : "";

  const closing = p(
    hasBook
      ? "In the meantime, every fill-in page from the book is a free printable on the site: <a href=\"" + SITE_URL + "/shop\" style=\"color: " + T.link + ";\">halfpintmama.com/shop</a>."
      : "Label everything: what it is, the date, and how to reheat it. Future you will thank you."
  ) + (labelsUrl ? LOST_LINK_HTML : `<p style="${SMALL}">Questions about your order? Just reply to this email.</p>`);

  const html = shell(preorder ? "You are in!" : "Thank you!", opening + summary + labels + cancel + closing);

  const text =
    "Hi friend,\n\n" +
    (preorder
      ? `Thank you for preordering Rest & Rise. Your copy is spoken for, and I will pack it myself.${order.shipEstimate ? ` It ships ${order.shipEstimate}, and I will email you the moment it is on its way.` : ""}`
      : hasBook
        ? `Thank you for your order. Your copy of Rest & Rise is spoken for, and I will pack it myself.${order.shipEstimate ? ` It ships ${order.shipEstimate}.` : ""}`
        : "Thank you for your order. Your printable freezer labels are ready right now.") +
    `\n\n${items}${total ? ` - ${total}` : ""}\n` +
    (shipTo.length ? `Shipping to ${shipTo.join(", ")}\n` : "") +
    (preorder ? "Changed your mind? Reply to this email any time before your book ships and I will refund it in full.\n\n" : "") +
    `Order reference ${order.sessionId}\n\n` +
    (labelsUrl ? `${preorder ? "Your preorder bonus is ready now. The printable freezer labels for every recipe in the book" : "Here are your labels"}: ${labelsUrl}\n\n${LABELS_HOWTO_TEXT}` : "") +
    (hasBook ? `In the meantime, every fill-in page from the book is a free printable on the site: ${SITE_URL}/shop\n\n` : "Label everything: what it is, the date, and how to reheat it. Future you will thank you.\n\n") +
    (labelsUrl ? LOST_LINK_TEXT : "Questions about your order? Just reply to this email.\n") +
    SIGN_OFF_TEXT;

  return { subject, html, text };
}

// "It's on its way": sent by Keegan (scripts/shop/notify-shipped.mjs) once a
// book order is in the mail. Keeps the promise the confirmation makes.
export function renderShippedNotice(order: Order): RenderedEmail {
  const { items, shipTo } = orderLines(order);
  const copies = order.quantity > 1 ? `your ${order.quantity} copies of <em>Rest &amp; Rise</em> are` : `your copy of <em>Rest &amp; Rise</em> is`;
  const copiesText = order.quantity > 1 ? `your ${order.quantity} copies of Rest & Rise are` : `your copy of Rest & Rise is`;
  const html = shell(
    "It is on its way!",
    p("Hi friend,") +
      p(`Good news: ${copies} in the mail. I packed it myself this morning.`) +
      (shipTo.length ? panel(`<p style="margin: 0; font-family: ${T.font}; font-size: 14px; line-height: 150%; color: ${T.text};"><strong>${escapeHtml(items)}</strong><br />Heading to ${shipTo.map(escapeHtml).join(", ")}</p>`) : "") +
      p("While you wait, the prep day planner and both stock-up lists are free to print: <a href=\"" + SITE_URL + "/shop\" style=\"color: " + T.link + ";\">halfpintmama.com/shop</a>. Week 30 is setup week, so there is no rush.") +
      p("Thank you for being one of the first. I hope it earns a spot on your counter.") +
      `<p style="${SMALL}">Questions about delivery? Just reply to this email.</p>`
  );
  const text =
    `Hi friend,\n\nGood news: ${copiesText} in the mail. I packed it myself this morning.\n\n` +
    `${items}\n` + (shipTo.length ? `Heading to ${shipTo.join(", ")}\n` : "") +
    `\nWhile you wait, the prep day planner and both stock-up lists are free to print: ${SITE_URL}/shop\n\n` +
    `Thank you for being one of the first. I hope it earns a spot on your counter.\n\nQuestions about delivery? Just reply to this email.\n` +
    SIGN_OFF_TEXT;
  return { subject: "Your Rest & Rise is on its way", html, text };
}

// "Lost your link": the same link again, nothing else.
export function renderLabelsRecovery(deliveryUrl: string): RenderedEmail {
  const url = escapeHtml(deliveryUrl);
  const html = shell(
    "Here are your labels",
    p("Hi friend,") +
      p("Here is your labels link again. It is the same one as before, and it never expires.") +
      button(url, "Open my labels") +
      LABELS_HOWTO_HTML +
      LOST_LINK_HTML
  );
  const text =
    "Hi friend,\n\nHere is your labels link again. It is the same one as before, and it never expires.\n\n" +
    `Open my labels: ${deliveryUrl}\n\n` +
    LABELS_HOWTO_TEXT +
    LOST_LINK_TEXT +
    SIGN_OFF_TEXT;
  return { subject: "Your Rest & Rise freezer labels link", html, text };
}

// Keegan's copy of every paid order. For a book this is the packing slip, so
// it is plain and scannable rather than pretty.
export function renderOrderNotification(
  order: Order,
  labelsSentTo: string | null,
  opts: { buyerEmailFailed?: boolean } = {}
): RenderedEmail {
  const { items, total, shipTo } = orderLines(order);
  const failed = !!opts.buyerEmailFailed;
  const subject = failed
    ? `⚠️ ORDER NEEDS ATTENTION: ${items}${total ? ` (${total})` : ""} — buyer email did not send`
    : `🛒 New order: ${items}${total ? ` (${total})` : ""}${order.phase === "preorder" && order.productIds.includes("book") ? " preorder" : ""}`;
  const html = shell(
    failed ? "Order paid, but the email failed" : "New order",
    (failed
      ? p(`<strong>This order is paid, but the confirmation email to ${escapeHtml(order.email ?? "the buyer")} did not go out.</strong> Reply to them directly, and if the order includes labels send a fresh link from halfpintmama.com/shop/labels.`)
      : "") +
    panel(
      `<p style="margin: 0 0 6px; font-family: ${T.font}; font-size: 16px; color: ${T.text};"><strong>${escapeHtml(items)}</strong>${total ? ` &middot; ${escapeHtml(total)}` : ""} &middot; ${order.phase}</p>` +
        `<p style="margin: 0 0 6px; font-family: ${T.font}; font-size: 14px; color: ${T.text};">Buyer: ${escapeHtml(order.email ?? "unknown")}</p>` +
        (shipTo.length
          ? `<p style="margin: 0; font-family: ${T.font}; font-size: 14px; line-height: 150%; color: ${T.text};"><strong>Ship to</strong><br />${shipTo.map(escapeHtml).join("<br />")}</p>`
          : `<p style="margin: 0; font-family: ${T.font}; font-size: 14px; color: ${T.text};">Digital only, nothing to ship.</p>`)
    ) +
      p(`Labels: ${labelsSentTo ? `sent to ${escapeHtml(labelsSentTo)}` : failed ? "included, but NOT sent — resend the link" : "not included in this order"}.`) +
      `<p style="${SMALL}">Stripe session ${escapeHtml(order.sessionId)}</p>`
  );
  const text =
    (failed ? `THIS ORDER IS PAID BUT THE BUYER'S CONFIRMATION EMAIL FAILED. Contact them directly.\n\n` : "") +
    `${items}${total ? ` - ${total}` : ""} (${order.phase})\nBuyer: ${order.email ?? "unknown"}\n` +
    (shipTo.length ? `Ship to: ${shipTo.join(", ")}\n` : "Digital only, nothing to ship.\n") +
    `Labels: ${labelsSentTo ? `sent to ${labelsSentTo}` : "not included"}\nStripe session ${order.sessionId}\n`;
  return { subject, html, text };
}

// ---- sending -----------------------------------------------------------------

async function send(to: string, mail: RenderedEmail, replyTo = REPLY_TO): Promise<void> {
  const { error } = await resend().emails.send({ from: FROM, to, replyTo, subject: mail.subject, html: mail.html, text: mail.text });
  if (error) throw new Error(`Resend: ${error.message}`);
}

export async function sendOrderConfirmation(order: Order, to: string, labelsUrl: string | null): Promise<void> {
  await send(to, renderOrderConfirmation(order, labelsUrl));
}

export async function sendLabelsDelivery({ to, deliveryUrl }: { to: string; deliveryUrl: string }): Promise<void> {
  await send(to, renderLabelsRecovery(deliveryUrl));
}

export async function sendShippedNotice(order: Order, to: string): Promise<void> {
  await send(to, renderShippedNotice(order));
}

export async function sendOrderNotification(
  order: Order,
  labelsSentTo: string | null,
  opts: { buyerEmailFailed?: boolean } = {}
): Promise<void> {
  await send(ownerAddress(), renderOrderNotification(order, labelsSentTo, opts), order.email ?? REPLY_TO);
}

// A refund or a chargeback on one of our own orders. Access is revoked
// automatically at read time; this exists so Keegan does not mail a book for an
// order whose money has already gone back.
export interface MoneyReversed {
  kind: "refund" | "dispute";
  email: string | null;
  amount: number;
  currency: string;
  sessionId: string;
  products: string;
}

export async function sendMoneyReversedNotice(r: MoneyReversed): Promise<void> {
  const isDispute = r.kind === "dispute";
  const money = formatMoney(r.amount, r.currency);
  const subject = isDispute
    ? `\u26A0\uFE0F Chargeback opened: ${money} — do not ship`
    : `Refunded: ${money}`;
  const html = shell(
    isDispute ? "A buyer has disputed a charge" : "An order was refunded",
    p(
      isDispute
        ? `<strong>${escapeHtml(money)} has been disputed by ${escapeHtml(r.email ?? "the buyer")}.</strong> Do not ship this order. Respond in the Stripe dashboard before the deadline or the money is lost by default.`
        : `${escapeHtml(money)} was refunded to ${escapeHtml(r.email ?? "the buyer")}. If the book has not gone out yet, pull it from the pile.`
    ) +
      panel(
        `<p style="margin: 0; font-family: ${T.font}; font-size: 14px; color: ${T.text};">${escapeHtml(r.products)}<br />Order ${escapeHtml(r.sessionId)}</p>`
      ) +
      p("Any labels that came with this order stopped working the moment the money went back.")
  );
  const text =
    `${isDispute ? "CHARGEBACK" : "Refund"}: ${money} — ${r.email ?? "unknown buyer"}\n` +
    `${r.products}\nOrder ${r.sessionId}\n` +
    (isDispute ? "Do not ship. Respond in Stripe before the deadline.\n" : "If the book has not shipped, pull it.\n");
  await send(ownerAddress(), { subject, html, text });
}
