// The one look for every email the site sends, shop or blog: the site's own
// palette (globals.css), a white card on cream with the terracotta-to-pink
// accent bar, Crimson Text headings in deep sage, a sans body in charcoal,
// terracotta pill buttons, sage-tinted panels. Every colour pair clears WCAG
// AA (terracotta on white 5.4:1, white on terracotta 5.4:1, deep sage on cream
// 7+:1, charcoal on cream 10:1). HTML email cannot use CSS variables, so the
// values live here.
//
// Voice: customer-facing messages are from Keegan in the first person and end
// "With love, Keegan"; owner-facing ones (packing slips, comment alerts) use the
// same shell without the sign-off.

import { escapeHtml } from "@/lib/sanitize";
import { SITE_URL } from "@/lib/seo";

export const T = {
  bg: "#F5F1E8", // --cream
  card: "#FFFFFF",
  text: "#3A3A38", // --charcoal
  muted: "#6B6B66",
  heading: "#4A5845", // --deep-sage
  sage: "#7B8F6E", // --sage
  sageTint: "#EEF2EA", // light-sage, lightened for a panel ground
  creamTint: "#FBF6EC", // the labels / callout panel
  beige: "#E6DFD3", // --warm-beige
  terracotta: "#A0562F", // links, buttons
  terracottaDeep: "#8A4A2E",
  pink: "#D4A894", // --soft-pink, accent only, never for text
  serif: "'Crimson Text', Georgia, 'Times New Roman', serif",
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
} as const;

// Kept for the older call sites; new code uses T.
export const EMAIL = {
  terracottaFrom: T.terracotta,
  terracottaTo: T.terracottaDeep,
  sageFrom: "#5C6B52",
  sageTo: T.heading,
  cream: T.bg,
  border: T.beige,
  text: T.text,
  muted: "#5F5F5B",
  footer: T.muted,
  accent: T.heading,
  link: T.terracotta,
} as const;

export const P_STYLE = `margin: 0 0 16px; font-family: ${T.sans}; font-size: 16px; line-height: 160%; color: ${T.text};`;
export const SMALL_STYLE = `margin: 0 0 12px; font-family: ${T.sans}; font-size: 14px; line-height: 155%; color: ${T.muted};`;
export const LINK_STYLE = `color: ${T.terracotta}; text-decoration: underline; text-underline-offset: 2px;`;

export function emailP(inner: string): string {
  return `<p style="${P_STYLE}">${inner}</p>`;
}

export function emailSmall(inner: string): string {
  return `<p style="${SMALL_STYLE}">${inner}</p>`;
}

export function emailLink(href: string, label: string): string {
  return `<a href="${href}" style="${LINK_STYLE}">${label}</a>`;
}

// The site's pill button: terracotta, white text.
export function emailButton(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 6px 0 22px;">
      <tr>
        <td align="center" bgcolor="${T.terracotta}" style="border-radius: 999px;">
          <a href="${href}" style="display: inline-block; padding: 14px 28px; font-family: ${T.sans}; font-size: 15px; font-weight: 700; letter-spacing: 0.2px; color: #FFFFFF; text-decoration: none; border-radius: 999px;">${label}</a>
        </td>
      </tr>
    </table>`;
}

// A quiet tinted panel: the site's card-within-a-card.
export function emailPanel(inner: string, tint: string = T.sageTint): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 22px;">
      <tr>
        <td bgcolor="${tint}" style="padding: 18px 20px; border-radius: 14px;">${inner}</td>
      </tr>
    </table>`;
}

// A small tracked label in sage, the site's eyebrow style.
export function emailEyebrow(text: string): string {
  return `<p style="margin: 0 0 6px; font-family: ${T.sans}; font-size: 11px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: ${T.sage};">${text}</p>`;
}

// A serif sub-heading inside a panel.
export function emailTitle(text: string): string {
  return `<p style="margin: 0 0 6px; font-family: ${T.serif}; font-size: 20px; line-height: 130%; color: ${T.heading};"><strong>${text}</strong></p>`;
}

// A quotation block: someone else's words, set apart.
export function emailQuote(inner: string): string {
  return `<p style="margin: 0; padding: 0 0 0 14px; border-left: 3px solid ${T.sage}; font-family: ${T.serif}; font-size: 17px; font-style: italic; line-height: 150%; color: ${T.text};">${inner}</p>`;
}

// Image + text side by side; stacks under 480px in clients that honour the
// media query, and still reads side by side in those that do not.
export function emailMedia(imgHtml: string, textHtml: string, imgWidth: number): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="stack">
      <tr>
        <td width="${imgWidth}" valign="top" class="stack-img" style="padding: 0 18px 0 0; width: ${imgWidth}px;">${imgHtml}</td>
        <td valign="top" class="stack-txt">${textHtml}</td>
      </tr>
    </table>`;
}

export interface ShellOptions {
  // The italic line under the heading ("Hi friend,").
  lede?: string;
  // Customer messages sign off as Keegan; owner alerts do not.
  signOff?: boolean;
  // Why the reader is getting this, in the footer.
  reason?: string;
}

// One shell for every message: logo, accent bar, heading, body, sign-off,
// site footer.
export function emailShell(heading: string, body: string, opts: ShellOptions = {}): string {
  const signOff = opts.signOff ?? true;
  const reason = opts.reason ?? "You are receiving this because you ordered from halfpintmama.com. Reply any time and it comes straight to me.";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    @media only screen and (max-width: 480px) {
      .stack td.stack-img, .stack td.stack-txt { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; }
    }
  </style>
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin: 0; padding: 0; background: ${T.bg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${T.bg}" style="background: ${T.bg};">
    <tr>
      <td align="center" style="padding: 28px 12px 36px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td align="center" style="padding: 0 0 18px;">
              <a href="${SITE_URL}" style="text-decoration: none;"><img src="${SITE_URL}/images/email-logo.png" width="84" height="84" alt="Half Pint Mama" style="display: inline-block; width: 84px; height: 84px; border: 0;" /></a>
            </td>
          </tr>
          <tr>
            <td bgcolor="${T.card}" style="background: ${T.card}; border-radius: 18px; overflow: hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="5" bgcolor="${T.terracotta}" style="height: 5px; line-height: 5px; font-size: 5px; background: linear-gradient(90deg, ${T.terracotta}, ${T.pink});">&nbsp;</td></tr>
                <tr>
                  <td style="padding: 30px 32px 10px;">
                    <h1 style="margin: 0 0 ${opts.lede ? "8px" : "18px"}; font-family: ${T.serif}; font-size: 34px; font-weight: 600; line-height: 120%; color: ${T.heading};">${heading}</h1>
                    ${opts.lede ? `<p style="margin: 0 0 22px; font-family: ${T.serif}; font-size: 19px; font-style: italic; line-height: 140%; color: ${T.sage};">${opts.lede}</p>` : ""}
                    ${body}
                    ${signOff ? `<p style="margin: 8px 0 0; font-family: ${T.serif}; font-size: 20px; line-height: 140%; color: ${T.heading};">With love,</p>
                    <p style="margin: 0 0 26px; font-family: ${T.serif}; font-size: 20px; font-style: italic; line-height: 140%; color: ${T.heading};">Keegan</p>` : `<p style="margin: 0 0 16px;">&nbsp;</p>`}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 22px 16px 0;">
              <p style="margin: 0 0 8px; font-family: ${T.sans}; font-size: 13px; line-height: 150%; color: ${T.muted};">
                <a href="${SITE_URL}" style="${LINK_STYLE}">halfpintmama.com</a> &nbsp;&middot;&nbsp; <a href="https://www.instagram.com/halfpint.mama" style="${LINK_STYLE}">@halfpint.mama</a>
              </p>
              <p style="margin: 0; font-family: ${T.sans}; font-size: 12px; line-height: 150%; color: ${T.muted};">Half Pint Mama &middot; Round Rock, Texas<br />${reason}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
