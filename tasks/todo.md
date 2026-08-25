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

- [x] `src/lib/shop/catalog.ts` — products, phase config, `SHOP_PHASE` reader
- [x] `src/lib/shop/entitlement.ts` — HMAC sign/verify for the delivery token
- [x] `scripts/shop/selftest.mjs` — 27 assertions, `npm run test:shop`
- [ ] `src/lib/shop/stripe.ts` — lazy Stripe client + `isShopEnabled()`
- [ ] `src/lib/shop/prices.ts` — live prices from Stripe, cached
- [ ] `src/lib/shop/labels-pdf.ts` — tile one label to the Avery grid, add the recipe
      dropdown + date field per slot, stamp the buyer's email
- [ ] `api/checkout` — same-origin, rate limited, stamps `shop_phase` into metadata
- [ ] `api/stripe/webhook` — signature-verified, idempotent, grants labels + notifies Keegan
- [ ] `api/labels/[token]` — serves the generated PDF against a valid token, rate limited
- [ ] `api/labels/recover` — re-sends the link after a Stripe lookup by email
- [ ] `/labels/[token]` — delivery page, stamped with the buyer's email, perpetual
- [ ] `/shop` — phase-aware product cards; waitlist when Stripe is unconfigured
- [ ] `/shop/success` — differs for digital-only vs physical
- [ ] `next.config.ts` — bundle the private asset dir into the serverless output
- [ ] Preorder-open assets: waitlist announcement email (213 shop-waitlist subs are the
      point of the waitlist) + sitewide copy sweep — "preorders coming soon" lives on
      /shop, /cookbook-resources, AND /free-guide
- [ ] Launch-day deploy bundle: `SHOP_PHASE=launched` + un-noindex /shop, sitemap,
      Book/Product schema, own OG image (the parked Jul SEO flip)
- [ ] Verify: `npm run lint`, `npm run build`, then a test-mode purchase end to end
      (incl. refund → labels access revoked, and recovery for both phases' orders)

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

## Where this stands (Aug 25 2026)

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
