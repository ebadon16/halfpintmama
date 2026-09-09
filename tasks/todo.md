# Rest and Rise store — build checklist

`/shop` sells the physical hardcover (shipped by Keegan) and the printable freezer
labels (instant digital delivery). During preorder the labels are a **free bonus with
the book and cannot be bought separately** — that exclusivity is the whole incentive.
At launch the book stops including them and they become a paid standalone item.

## Design decisions (settled)

- **Stripe Checkout (hosted)** — no card data touches our server; it handles the
  shipping address, receipts, and the statement descriptor.
- **Prices live in Stripe**, read live by the shop page, so the displayed price can
  never drift from the charged price and Keegan can change one without a deploy.
- **Env-gated.** With no `STRIPE_SECRET_KEY`, `/shop` renders today's waitlist page.
- **One phase flag** `SHOP_PHASE=preorder|launched` drives what's sold, what a book
  purchase grants, and the page copy. ⚠ On Vercel an env edit does NOT touch the live
  deployment ([[reference_vercel_env_deploy_latency]]) — the flip requires a redeploy.
  Fine in practice: launch day needs a deploy anyway (un-noindex /shop, sitemap,
  Book/Product schema, copy sweep), so the flip rides along with it.
- **Entitlement is stamped into the Stripe session metadata at purchase time**, and the
  webhook reads it from there — never from the current env. A phase flip while a payment
  is in flight must not change what that buyer was promised.
- **Idempotent fulfilment with no database**: the marker is written to the PaymentIntent
  metadata in Stripe, so a webhook retry can't double-send.
- **Delivery is a gated page, not an attachment**, backed by a "lost your link" lookup
  that queries Stripe by email. Stripe is the order database.
- **Refund-aware at access time.** The delivery page and the recovery lookup check the
  payment's refund status in Stripe when hit — a refunded preorder loses its labels
  without us storing anything.
- **Recovery answers identically for known and unknown emails** ("if that address
  purchased, we've sent a link") so it can't be used to probe who bought. It reads the
  entitlement from purchase-time metadata, not from "a book order exists" — post-launch
  book orders don't include labels, so email alone is ambiguous.
- **The PDF is generated per buyer with their email stamped in the footer.** For a static
  file this is worth more than any link security — it survives the download.
- **Fields are editable combo boxes, not fixed dropdowns** — pick a book recipe OR type
  anything ("not everyone makes the same recipes" is the spec). Plus one page of blank
  write-in labels. Embed the brand font in the field appearance or typed text renders
  in Helvetica inside her branded label.
- **Mobile is the buyer's first touch, and iOS QuickLook renders AcroForm flat/dead.**
  Third-trimester buyers open the delivery email on a phone. The delivery page must say
  "open on a computer to fill in" ABOVE the download button and show a preview image of
  a filled sheet so the phone view looks intentional, not broken. This is also the case
  for the on-site generator as v2 (compose on the page, download flat PDF) — the
  delivery page is built as the natural home for it.
- **The success page links the labels page directly** (verify the Stripe session) —
  email becomes the durable copy, not the delivery. Deletes the "paid but got nothing"
  support category (spam folder, typo'd email, delayed send).
- **Transactional email via Resend, never MailerLite.** An unsubscribe from the newsletter
  must never suppress a delivery. Newsletter opt-in is a separate, decoupled step.

## Build

- [x] `src/lib/shop/catalog.ts` — products, phase config, `SHOP_PHASE` reader, `shopCopy()`
- [x] `src/lib/shop/entitlement.ts` — HMAC sign/verify for the delivery token
- [x] `src/lib/shop/stripe.ts` — lazy Stripe client, `shopConfigProblems()` / `isShopEnabled()`
      (preorder phase REFUSES to open without `SHOP_SHIP_ESTIMATE`: FTC needs a stated date)
- [x] `src/lib/shop/orders.ts` — `orderFromSession()` (pure), `getOrder`, `findLabelOrdersByEmail`,
      `markFulfilled`; refund = full refund only, partial (shipping) does not revoke
- [x] `src/lib/shop/prices.ts` — live prices from Stripe, 5-min cache
- [x] `src/lib/shop/labels-pdf.ts` — Avery 5163 grid (⚠ assumed, confirm), editable recipe combo
      + date + note per label, 2 fillable pages + 1 blank, Crimson Text embedded, buyer email
      stamped in footer + metadata. Artwork: drop `private/shop/label.png`; placeholder until then
- [x] `src/lib/shop/email.ts` — Resend: delivery / recovery / owner order notification
- [x] `src/lib/shop/fulfil.ts` — grant + notify + `fulfilled_at` marker on the PaymentIntent
- [x] `api/checkout` — same-origin, 10/min, stamps `shop_phase` + `product_ids` + `ship_estimate`
- [x] `api/stripe/webhook` — signature-verified, re-reads the session, idempotent, 5xx = retry
- [x] `api/labels/[token]` — PDF against a valid token + live Stripe check, 10/min, no-store
- [x] `api/labels/recover` — identical reply for any email, lookup runs in `after()`
- [x] `/shop/labels/[token]` — delivery page; "open on a computer" ABOVE the button + sheet preview
- [x] `/shop/labels` — lost-your-link form
- [x] `/shop` — waitlist (unchanged) / preorder / launched; noindex until launched
- [x] `/shop/success` — verifies the session; links the labels page directly
- [x] `next.config.ts` — `outputFileTracingIncludes` for `private/shop/**`
- [x] Copy sweep is PHASE-AWARE, not a one-off: homepage card, /free-guide card,
      /cookbook-resources labels block all read `getShopStatus()`. Nothing to sweep on flip day.
- [x] Waitlist announcement email — MailerLite DRAFT `198049723307787316`
      ("DRAFT: Preorders open"), audience New Subscribers (739), placeholders `[PRICE]` and
      `[SHIP DATE]` in body AND subject. Source: `scripts/shop/emails/preorder-open.html`.
- [ ] Launch-day deploy bundle: `SHOP_PHASE=launched` (+ `STRIPE_PRICE_LABELS`) — robots
      un-noindex is automatic; still TODO: sitemap entry, Book/Product schema, own OG image
- [x] Verify offline: `npm run lint`, `npm run build`, `npm run test:shop` = 61/61,
      `next start` smoke (no key → waitlist; checkout 503; webhook 503; recover generic)
- [x] Verify with keys (Sep 8 2026, HalfPintMama sandbox `acct_1UDXYVPX2TePaQIt`): real Checkout
      purchase via Playwright → webhook 200 + `fulfilled_at` marker → delivery + owner emails
      delivered via Resend → `/shop/success` links labels → `/shop/labels/[token]` 200 → PDF 200
      (182 KB) → tampered token 404 → event replay sends nothing → recovery sends for a known
      email (mixed case), identical reply for unknown → refund → API 410, page "no longer
      available", recovery silent. Launched-phase order path is covered by the self-test only.

## Go-live runbook

Stripe objects EXIST in the sandbox (`npm run shop:setup` created them; values are in
`.env.local`). The same command with the LIVE key creates the live set and prints the env block.

1. Vercel env: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_BOOK`, `SHOP_TOKEN_SECRET` (48 random chars),
   `SHOP_PHASE=preorder`, `SHOP_SHIP_ESTIMATE="<month year>"`, optional `STRIPE_SHIPPING_RATE`.
2. Stripe → Developers → Webhooks → add `https://halfpintmama.com/api/stripe/webhook` with
   `checkout.session.completed` + `checkout.session.async_payment_succeeded`; copy the signing
   secret into `STRIPE_WEBHOOK_SECRET`. Redeploy (env edits do not touch the live deploy).
3. Test-mode purchase with card 4242…; confirm delivery email, `/shop/success` link, PDF download,
   Keegan's order email, then refund in Stripe and confirm the labels page shows the refunded state.
4. Fill `[PRICE]` + `[SHIP DATE]` in the MailerLite draft, fix the subject, send.

## Blocked on someone else

1. **`STRIPE_SECRET_KEY`** (test) — gates everything in the build list.
   `STRIPE_WEBHOOK_SECRET` follows once the endpoint is registered.
2. **Avery freezer-safe product code + label size** — gates the PDF geometry.
3. **One blank label design** at that exact size, own text/uploads only.
   No Pro, Editorial Use Only, Branded, or Education elements.
   See [[reference_canva_pro_content_licensing]].
   ⚠ Artwork rules: NO outline border at the label edge (1–2mm printer drift makes a
   lopsided border on every label — the classic printable failure) and keep content
   inside a safe area.
4. **Prices** for book and labels, plus shipping.
5. **A ship date Keegan can commit to** — required before taking preorder money.
6. **Book-copy collision (p.23/p.172):** the printed book points readers to the labels
   URL implying they're free there; post-launch that URL is a paid product. Book is
   still in Canva fixes, so a copy tweak now is cheap. The alternative — book buyers
   get labels free — undercuts the standalone product. Decide.
7. **Shipping countries** for Stripe Checkout (US-only?).
8. **Refund policy must state the labels case:** labels arrive instantly, the book
   charge stays refundable for months (FTC), so preorder → grab labels → refund book
   is possible. At this price, eat it — but state it in the terms deliberately.
9. **Sales page must say a printer is needed** (or a print shop) and link the exact
   Avery product — honesty-first copy, and it pre-empts the top two complaints.

## Known risks

- **FTC Mail Order Rule.** Taking payment now for a later ship date means stating a
  date, and notifying + offering a refund if it slips. Not optional for a US preorder.
- **Dispute window.** A long charge-to-ship gap sits inside the card dispute window,
  so a slipped date converts directly into chargebacks.
- **Overselling.** The book sells here and on Amazon with no shared stock counter.
- **Sales tax** on physical goods is unhandled; Stripe Tax is available if wanted.
- **Print alignment.** Artwork must be die-cut accurate or every label sits off-centre.

## Where this stood (Aug 25 2026)

**Built, tested, committed — but wired to nothing.** `catalog.ts` and
`entitlement.ts` are pure logic with no Stripe dependency, so they were written
and proven while waiting on keys. `npm run test:shop` is 27/27. Nothing imports
them yet, so they have zero effect on the live site.

**The single blocker is `STRIPE_SECRET_KEY` (test mode).** Everything remaining
in the build list talks to Stripe. `STRIPE_WEBHOOK_SECRET` is NOT needed up
front — registering the webhook endpoint is what generates it.

`SHOP_TOKEN_SECRET` (48+ random chars) is also needed but I can generate it.

**Design decisions are settled** — see above, and the shared plan:
https://claude.ai/code/artifact/d6dfe849-c9a2-4d41-9be0-545c71a661de

## Review

(filled in when the build lands)

## Where this stands (Sep 8 2026)

**Everything in the build list is written, typed, linted, built, and self-tested (61/61).**
Stripe-facing code is exercised only up to the SDK boundary; a real test-mode purchase is the
remaining verification and needs the key. With no `STRIPE_SECRET_KEY` the live site is
unchanged except for two new noindex pages (`/shop/labels`, `/shop/labels/[token]`) and the API routes,
which all refuse cleanly.

## Launch review (Sep 9 2026)

Independent code review of the shop diff found 12 issues; all fixed and re-verified in the
sandbox: opaque delivery tokens (no email in URLs) + GA page-view scrubbing; 100%-off codes
(zero-total, no PaymentIntent) fulfil with the marker on the session; recovery searches a
lowercased `buyer_email` stamped on the PaymentIntent (Stripe matches emails AS TYPED; an
`ERICKBADON@` order recovered from a lowercase query); one on-brand order confirmation per paid
order; shop survives a price-lookup failure; delivery page/PDF survive a Stripe outage; expired
and never-cleared checkout copy; config-derived shipping copy; JSON guards; real forgery tests.

Emails rebuilt to the newsletter design (cream, Playfair, #073704/#093E06/#A0562F, mason-jar
logo, "Hi friend" / "With love, Keegan"). Preview: `npx tsx scripts/shop/send-sample-email.mjs`.
⚠ The email logo loads from halfpintmama.com/images/email-logo.png, so it shows only after deploy.

Free checklist restored: /checklist (URL printed in the book), /cookbook-resources, /shop card.
Shop/checklist/resources indexable + in sitemap once preorders open; Book+Offer schema on /shop;
terms gained Orders, Shipping & Refunds. Screenshots verified in waitlist/preorder/launched,
desktop + mobile.

Dev-server gotchas: Turbopack dev panicked repeatedly here, use `next dev --webpack`; dev CSP now
allows eval; a dev server started inside a tool call dies with it, launch detached
(`scratchpad/launch_dev.mjs` pattern: child_process.spawn detached + unref).
