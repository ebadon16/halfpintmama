// Builds the MailerLite campaign HTML for the Rest & Rise launch from one shared
// shell (the one the Sep 24 "Preorders open" send used) so every campaign
// matches the site and each other. Writes scripts/shop/emails/<name>.html.
//
//   node scripts/shop/emails/make-campaigns.mjs            # writes all three
//   node scripts/shop/emails/make-campaigns.mjs --preview  # also writes *.preview.html with MailerLite tags removed
//
// Every shop link carries utm_source=email&utm_campaign=<name> so the admin
// report (/api/shop/admin/notify, kind "report") can credit orders to the send.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const preview = process.argv.includes("--preview");

const SITE = "https://halfpintmama.com";
const SERIF = "'Crimson Text', Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const C = { heading: "#4A5845", sage: "#7B8F6E", text: "#3A3A38", muted: "#6B6B66", terracotta: "#A0562F", cream: "#F5F1E8", sageTint: "#EEF2EA", creamTint: "#FBF6EC", beige: "#E6DFD3" };

const shop = (campaign) => `${SITE}/shop?utm_source=email&utm_campaign=${campaign}`;

const p = (inner) => `<p style="margin: 0 0 16px; font-family: ${SANS}; font-size: 16px; line-height: 160%; color: ${C.text};">${inner}</p>`;
const small = (inner) => `<p style="margin: 0 0 12px; font-family: ${SANS}; font-size: 14px; line-height: 155%; color: ${C.muted};">${inner}</p>`;
const eyebrow = (t) => `<p style="margin: 0 0 6px; font-family: ${SANS}; font-size: 11px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: ${C.sage};">${t}</p>`;
const title = (t) => `<p style="margin: 0 0 8px; font-family: ${SERIF}; font-size: 22px; line-height: 125%; color: ${C.heading};"><strong>${t}</strong></p>`;
const body15 = (t, last = false) => `<p style="margin: 0${last ? "" : " 0 10px"}; font-family: ${SANS}; font-size: 15px; line-height: 155%; color: ${C.text};">${t}</p>`;
const button = (href, label) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 22px;"><tr><td align="center" bgcolor="${C.terracotta}" style="border-radius: 999px;"><a href="${href}" style="display: inline-block; padding: 16px 34px; font-family: ${SANS}; font-size: 16px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 999px;">${label}</a></td></tr></table>`;
const panel = (inner, tint = C.sageTint) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 22px;"><tr><td bgcolor="${tint}" style="padding: 18px 20px; border-radius: 14px;">${inner}</td></tr></table>`;
const media = (img, width, text) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="stack"><tr><td width="${width}" valign="top" class="stack-img" style="padding: 0 18px 0 0; width: ${width}px;">${img}</td><td valign="top" class="stack-txt">${text}</td></tr></table>`;

const COVER = `<img src="${SITE}/images/rest-and-rise-cover.jpg" width="160" height="229" alt="Rest & Rise cover" style="display: block; width: 160px; height: auto; border: 0; border-radius: 8px; box-shadow: 0 8px 20px rgba(58,58,56,0.18);" />`;
const LABEL = `<img src="${SITE}/images/labels-preview-label.png" width="150" height="125" alt="One filled-in freezer label" style="display: block; width: 150px; max-width: 100%; height: auto; border: 0; border-radius: 8px; border: 1px solid ${C.beige};" />`;

function shell({ titleTag, h1, lede, body, signOff = true }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!--{$head_top}-->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    @media only screen and (max-width: 480px) {
      .stack td.stack-img, .stack td.stack-txt { display: block !important; width: 100% !important; padding: 0 0 14px 0 !important; }
    }
  </style>
  <title>${titleTag}</title>
  <!--{$head_bottom}-->
</head>
<body style="margin: 0; padding: 0; background: ${C.cream};">
  <!--{$body_top}-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.cream}" style="background: ${C.cream};">
    <tr><td align="center" style="padding: 28px 12px 36px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
        <tr><td align="center" style="padding: 0 0 18px;"><a href="${SITE}" style="text-decoration: none;"><img src="${SITE}/images/email-logo.png" width="84" height="84" alt="Half Pint Mama" style="display: inline-block; width: 84px; height: 84px; border: 0;" /></a></td></tr>
        <tr><td bgcolor="#FFFFFF" style="background: #FFFFFF; border-radius: 18px; overflow: hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td height="5" bgcolor="${C.terracotta}" style="height: 5px; line-height: 5px; font-size: 5px; background: linear-gradient(90deg, ${C.terracotta}, #C98A6A);">&nbsp;</td></tr>
            <tr><td style="padding: 30px 32px 10px;">
              <h1 style="margin: 0 0 8px; font-family: ${SERIF}; font-size: 34px; font-weight: 600; line-height: 120%; color: ${C.heading};">${h1}</h1>
              <p style="margin: 0 0 22px; font-family: ${SERIF}; font-size: 19px; font-style: italic; line-height: 140%; color: ${C.sage};">${lede}</p>
              ${body}
              ${signOff ? `<p style="margin: 8px 0 0; font-family: ${SERIF}; font-size: 20px; line-height: 140%; color: ${C.heading};">With love,</p>
              <p style="margin: 0 0 26px; font-family: ${SERIF}; font-size: 20px; font-style: italic; line-height: 140%; color: ${C.heading};">Keegan</p>` : ""}
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding: 22px 16px 0;">
          <p style="margin: 0 0 8px; font-family: ${SANS}; font-size: 13px; line-height: 150%; color: ${C.muted};"><a href="${SITE}" style="color: ${C.terracotta};">halfpintmama.com</a> &nbsp;&middot;&nbsp; <a href="https://www.instagram.com/halfpint.mama" style="color: ${C.terracotta};">@halfpint.mama</a></p>
          <p style="margin: 0 0 8px; font-family: ${SANS}; font-size: 12px; line-height: 150%; color: ${C.muted};">Half Pint Mama &middot; 2800 Joe DiMaggio Blvd Unit 79, Round Rock, TX 78665, United States</p>
          <p style="margin: 0; font-family: ${SANS}; font-size: 12px; line-height: 150%; color: ${C.muted};">You received this email because you signed up on our website or made a purchase from us. <a href="{$unsubscribe}" style="color: ${C.terracotta};">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  <!--{$body_bottom}-->
</body>
</html>
`;
}

// ---- the three campaigns ------------------------------------------------------

const bookPanel = (campaign, lastLine) =>
  panel(
    media(
      COVER,
      160,
      eyebrow("The postpartum cookbook") +
        title("Rest &amp; Rise: Make-Ahead, Freezer-Friendly Sourdough Meals for Postpartum Recovery") +
        body15("35 slow cooker, pressure cooker, and sourdough recipes built to be cooked before baby arrives and pulled from the freezer after, with a week-by-week prep plan and the fourth-trimester guidance I give my own friends as a Pediatric ER RN.") +
        body15(lastLine, true)
    )
  );

const labelsPanel = (eyebrowText, lastLine) =>
  panel(
    media(
      LABEL,
      150,
      eyebrow(eyebrowText) +
        title("Printable freezer labels for all 35 recipes") +
        body15("Pick the recipe on your computer and the label fills in its best-by line and freezer directions. Print onto Avery label sheets and future you finds dinner without doing any mental math.") +
        body15(lastLine, true)
    ),
    C.creamTint
  );

export const CAMPAIGNS = {
  // 1. To the book waitlist who have not bought. Sent BEFORE the books ship.
  "waitlist-labels": {
    subject: "Still thinking about the book? The free labels have a deadline",
    titleTag: "Before the free freezer labels go away",
    h1: "Before the free labels go away",
    lede: "Hi friend, a quick, honest update on Rest &amp; Rise.",
    body:
      p("You asked me to tell you when the book was ready, so here is exactly where things stand. The signed hardcovers ship <strong>late November 2026</strong>. The print run ran later than I planned, and I would rather give you the real date than a hopeful one.") +
      bookPanel("waitlist-labels", "<strong>The signed hardcover is $39.99.</strong> I pack and mail every copy myself.") +
      p("Here is the part with a deadline. <strong>Every preorder still gets my printable freezer labels free.</strong> The day the book ships, that ends and the labels become a $10 add-on. If you were going to get the book anyway, this is the week to do it.") +
      labelsPanel("Free with every preorder, until the book ships", "They land in your inbox the minute you order, so you can start filling the freezer before the book even arrives.") +
      button(shop("waitlist-labels"), "Preorder Rest &amp; Rise") +
      p("And if you are on the fence, I would genuinely like to know why. <strong>Hit reply and tell me in a sentence:</strong> the price, the wait, not sure it is for you, or something else. I read every reply, and it will shape what I do next.") +
      p("Thank you for waiting with me. It is almost here."),
  },

  // 2. Launch day, to the whole list.
  "launch-1": {
    subject: "Rest & Rise is here (and shipping today)",
    titleTag: "Rest & Rise is here",
    h1: "It is here",
    lede: "Hi friend, the books arrived and the first copies are in the mail today.",
    body:
      p("<em>Rest &amp; Rise</em> is officially out. The signed hardcovers are stacked on my kitchen table, every preorder is going into the mail today, and from this morning you can order a copy that ships this week.") +
      bookPanel("launch-1", "<strong>$39.99, signed, shipped by me.</strong> Order today and it goes out this week.") +
      p("What is inside: 35 recipes that cook before baby and reheat after, a 13-session prep plan for weeks 30 through 36, the freezer and reheating directions for every single dish, and the honest fourth-trimester guidance I give my own friends as a Pediatric ER RN.") +
      labelsPanel("New in the shop", "<strong>The labels are now a $10 add-on at checkout.</strong> Tick the box when you order the book and they arrive by email right away.") +
      button(shop("launch-1"), "Get your signed copy") +
      p("If you preordered: thank you, truly. Your shipping email is on its way to you today.") +
      p("This book exists because of the people on this list. I hope it earns a spot on your counter."),
  },

  // 3. Three days after launch, to the whole list. Honest angle: the gift.
  "launch-2": {
    subject: "The gift for the mama with everything on her registry",
    titleTag: "The gift that is not on the registry",
    h1: "The gift that is not on the registry",
    lede: "Hi friend, a short one.",
    body:
      p("Every baby shower I go to, the registry is covered. Nobody has bought the mama a month of dinners. <em>Rest &amp; Rise</em> is that: the book, the plan, and the labels, so she stocks her freezer before the baby comes and eats real food after.") +
      bookPanel("launch-2", "<strong>Signed hardcover, $39.99, shipped by me.</strong> Add a note at checkout and I will write it inside the cover.") +
      p("<strong>Ordering for Christmas or a shower?</strong> Place your order by <strong>[ORDER-BY DATE]</strong> and it will arrive in time. After that I can still ship, I just cannot promise the date.") +
      button(shop("launch-2"), "Order a signed copy") +
      p("If you already have yours, thank you. Send this to the friend who is due in the spring; she will thank you in February."),
  },
};

for (const [name, c] of Object.entries(CAMPAIGNS)) {
  const html = shell({ titleTag: c.titleTag, h1: c.h1, lede: c.lede, body: c.body });
  writeFileSync(join(here, `${name}.html`), html);
  if (preview) writeFileSync(join(here, `${name}.preview.html`), html.replace(/<!--\{\$[a-z_]+\}-->/g, "").replace("{$unsubscribe}", `${SITE}/#unsubscribe-preview`));
  console.log(`wrote ${name}.html  (${html.length} bytes)  subject: ${c.subject}`);
}
