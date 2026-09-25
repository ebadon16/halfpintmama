# Rest & Rise store — build checklist

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

## Go-live runbook (verified Sep 12 2026)

### What I need from you, once

1. **Ship month** for preorders. `.env.local` still says November 2026 as a placeholder. Count
   back from it: KDP proof (about a week after submission), approval, author copies (two to
   three weeks), packing. The FTC Mail Order Rule holds us to the stated month, so pick one
   with slack; a later month costs nothing, an earlier one costs a refund round.
2. **The live secret key** `sk_live_...` from the Half Pint Mama account, Developers -> API keys.
3. **Copies per order**: default is 1. More than one only makes sense with a shipping rate
   priced for the bigger box, because Stripe charges shipping once per order, not per book.

Decided already: book $39.99 (Sep 19), shipping $5, labels $9.99 standalone after launch, Texas
permit in hand (Sep 23). Nothing else. Every other decision is made and in code.

### Step 1 — push, any time before launch (safe on its own)

Pushing deploys the shop code but NOT the shop: with no Stripe env on Vercel the storefront
still renders today's waitlist page. What it does turn on is everything the printed book points
at, which has to exist before a reader holds a copy:

- `/checklist` becomes a real page instead of a redirect, with the free session checklist.
- `/shop` and `/cookbook-resources` list all four Chapter 11 printables, free and ungated.
- The five PDFs go live at their hashed URLs.

All three pages stay `noindex` and out of the sitemap until the shop opens, so nothing changes
in search. Doing this early is what makes launch day a single step.

### Step 2 — launch day, one command and one paste

```
STRIPE_SECRET_KEY=sk_live_... SHOP_SHIP_ESTIMATE="<Month YYYY>" npm run shop:setup -- --book=3999 --labels=999 --shipping=500 --tax-from=<permit date YYYY-MM-DD>
```

It creates the products, both prices, the shipping rate, registers the webhook (only because
step 1 already deployed the route: it probes the URL and refuses if it 404s), sets the Stripe
Tax head office and the Texas registration, and prints the complete env block including the
webhook signing secret and `SHOP_COLLECT_TAX=on`. Paste that block into Vercel and redeploy.
The shop is open. `SHOP_TOKEN_SECRET`, `SHOP_PHASE` and `SHOP_SHIP_COUNTRIES` were staged on
Vercel production on Sep 23 2026 already; the paste only adds the Stripe values, the ship
estimate and the tax flag.

⚠ Keep `SHOP_TOKEN_SECRET` stable forever. Changing it invalidates every delivery link already
emailed. The script prints the existing one unchanged and shouts if it has to mint a new one.

### Step 3 — prove it with real money

Buy the book with a real card, confirm the confirmation email and the labels link arrive, then
refund it in the Stripe dashboard and confirm the labels link stops working. Ten minutes.

### Step 4 — when the books actually ship

- Set `SHOP_PHASE=launched` and redeploy. The book becomes a normal order, the labels go on sale
  as their own item, and `/shop` becomes indexable with Book and Offer schema.
- Tell every preorder buyer their copy is on its way:
  `node --env-file=.env.local node_modules/.bin/tsx scripts/shop/notify-shipped.mjs` to see the
  list, then `--send`. It marks each order so nobody is emailed twice.
- Fill the price and ship date into the MailerLite draft (campaign `198049723307787316`) and send.

### Changing a price later

Re-run the setup command with the new number. Stripe prices are immutable, so it creates a new
price, moves the lookup key, archives the old one and prints the new env value. Paste and
redeploy. If that redeploy is forgotten the storefront falls back to the waitlist rather than
showing a buy button that cannot work, and logs exactly why.

### Sales tax

Verified against the Texas Comptroller, September 2026.

- **Texas sales must be taxed.** "Texas sellers must collect sales tax on taxable items, including
  shipping and delivery charges, sold online in Texas." Keegan is in Round Rock, so this applies
  from the first sale; there is no small-seller threshold for a seller inside the state.
- **6.25% state plus up to 2% local, 8.25% maximum, destination-based.** If the buyer's local rate
  is higher than Round Rock's, the difference is owed as local use tax.
- **Out-of-state orders owe no Texas tax.** Another state only matters past its own nexus
  threshold, typically $100,000 or 200 transactions, which a book selling in the hundreds will not
  approach.
- **Shipping is taxable**, so the tax lands on the book plus the postage.

**Keegan's one action: apply for the permit.** Online at https://security.app.cpa.state.tx.us/,
free, and she needs her Social Security number plus a NAICS code. Use **513130, Book Publishers**:
she publishes her own title rather than reselling other people's, and the retail code 459210
explicitly excludes publishing. The code is statistical only and does not change what is owed.
Allow two to three weeks. It has to exist before the first taxable sale, so this is the thing to
start earliest; everything else here waits on prices, but this waits on the state.

**Permit obtained Sep 23 2026.** Then, in order:

1. `npm run shop:setup` with the live key does the Stripe side (head office + Texas
   registration, idempotent, `--tax-from=` the permit's effective date) and prints
   `SHOP_COLLECT_TAX=on` once Stripe Tax reports active.
2. Paste that with the rest of the env block into Vercel and redeploy.
3. File Texas returns on whatever schedule the permit assigns, including zero-sale periods.

The code is already wired and switched off. Products carry their own tax codes, `txcd_35010000`
for the hardcover and `txcd_10505001` for the labels, so Stripe applies the right treatment to
each rather than a generic guess. Proven in the sandbox: a Texas order came out at $34.00 plus
$5.00 shipping plus $3.22 tax, which is 8.25% of the taxable total. Stripe Tax bills only where
you are registered, so orders shipped outside Texas cost nothing.

⚠ Do not switch it on before the permit exists. Collecting tax you are not registered to collect
is a worse problem than not collecting it.

### Labels: which sheets buyers need

**Avery 5524** (waterproof film) in the **Avery 5164** layout: 4" x 3 1/3", six to a US Letter
sheet, 2 across and 3 down (top margin 0.5", sides 0.15625", horizontal pitch 4.1875", vertical
pitch 3.3333"). Keegan chose this size in her Canva "freezer labels" draft (Sep 23 2026) because the
directions need the room; 5164 is plain paper and will not survive a freezer, so the site names
5524. The PDF is: page 1 guide, pages 2-4 fillable (18 labels), page 5 hand-write.

### What stops the shop opening

`shopConfigProblems()` keeps the storefront on the waitlist unless every one of these is set:
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SHOP_TOKEN_SECRET` (32+ chars),
the price for everything on sale in the current phase, and `SHOP_SHIP_ESTIMATE` during preorder.
That last one is the FTC rule: a preorder must state its ship date before taking money.

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

## Sep 9, later: quantity, shipped notice, Amazon
- Book quantity 1-5 at checkout; emails show "Rest & Rise x N".
- Shipped notice: `node --env-file=.env.local node_modules/.bin/tsx scripts/shop/notify-shipped.mjs`
  (dry run) then `--send`. Marks `shipped_at` on the PaymentIntent. Verified once in the sandbox.
- (Removed Sep 25 2026, Erick's call: no link from the site to Amazon. Direct sales net several times more; customers who find Amazon on their own are fine.) Was: `SHOP_AMAZON_URL` added "Prefer Amazon? Find it there." Direct
  sales lead: they net several times what a KDP sale does, and KDP cannot preorder print books.
- Decisions still open for Keegan/Erick: Stripe's own receipt emails (recommend OFF, ours covers
  it); ship date must include KDP author-copy lead time; sales tax; book p.23/p.172 copy; terms
  refund wording.

## Where this stands (Sep 23 2026)

Shipped to master today (`9f1eb0a`, `dad970a`, verified on halfpintmama.com):

- Keegan's portrait sized to its source (was upscaling, read as blurry).
- `/shop` has its own share card: final cover + title + the phase badge, generated at
  `src/app/(site)/shop/opengraph-image.tsx` from `private/shop/og-cover.jpg`. Metadata no longer
  points at the site-wide banner.
- Site cover regenerated from `RestAndRise-COVER-FINAL.pdf` (now carries "Nurse & Mama").
  `cover-from-print-file.mjs` finds the front panel from the title + photo centres; the old
  back-panel mirror broke because the back is left-aligned.
- Recipe names in the labels combo box match the final interior (cooker rename, "and" not "&",
  "Easy", "Make-Ahead", "Overnight Sourdough" prefixes). Preview sheet regenerated.
- "Slow cooker, pressure cooker" replaces the trademarks in shop copy, preview, announcement.
- Sanity post `transitioning-from-two-to-three-kids…` now says "check out my postpartum meal
  prep cookbook, Rest & Rise!" (phase-neutral; backup `~/Downloads/sanity-waitlist-backup-2026-09-23.json`).
- MailerLite draft `198049723307787316`: "Rest & Rise", cooker wording, price filled ($39.99).
  `[SHIP DATE]` placeholder remains in body and subject on purpose.
- Sandbox Stripe: book product renamed "Rest & Rise", tax codes set on both products.
- Vercel production: `SHOP_TOKEN_SECRET`, `SHOP_PHASE=preorder`, `SHOP_SHIP_COUNTRIES=US` staged
  (shop stays on the waitlist until the Stripe values land).
- `setup-stripe.mjs` now also does Stripe Tax (head office + Texas registration) and emits
  `SHOP_COLLECT_TAX=on`.

Still manual, not code:

- **Welcome automation** (`Welcome email`, id 177692768818169374) is unchanged since Aug 2 and
  still says "Thirty-five freezer-friendly sourdough recipes", "Fall 2026", buttons `#bf6428`
  / `#d35400`, three thumbnails from bloghalfpintmama.wordpress.com. Dashboard only. Edit list
  in the Sep 23 session summary.
- Freezer Prep Guide PDF (lead magnet) says "When Rest and Rise launches this fall, I am
  releasing... printable freezer labels" and "Coming Fall 2026". Not a free-labels promise;
  optional Canva touch-up to "Rest & Rise" and to drop the season.
- Ship month, live key: see "What I need from you".

## PREORDERS LIVE (Sep 23 2026, deploy 942271a)

Live Stripe (`acct_1UDXYGBR2BAygII2`, descriptor HALFPINTMAMA): book `price_1UJ2JdBR2BAygII2EI5RZjSR`
$39.99, labels `price_1UJ2JeBR2BAygII2vqvKIO4D` $9.00, shipping `shr_1UJ2JfBR2BAygII2SDk0OsRA` $5.00,
webhook `we_1UJ2JgBR2BAygII22IQZZPA3` (4 events, enabled), Stripe Tax active with Texas registration
`taxreg_1UJ2JhBR2BAygII2Di0tfzOU`. Full env block on Vercel production incl. `SHOP_SHIP_ESTIMATE=Late
October 2026` and `SHOP_COLLECT_TAX=on`. The live key lives ONLY in Vercel (never in the repo or .env.local).
Verified on halfpintmama.com: /shop indexable, "Preorders Open", $39.99, Book/Offer PreOrder schema, sitemap
carries /shop + /cookbook-resources, homepage card says "Preorder the Book", webhook rejects a bad signature
with 400, a live Checkout session created through /api/checkout carried US address collection, the $5 rate,
automatic tax, the ship-date note and the phase/product metadata (then expired).
STILL TO DO: (1) Step 3 real-card purchase + refund by Erick/Keegan; (2) send MailerLite "Preorders open
(ready to send)" 198049723307787316 after (1); (3) welcome automation edits (dashboard); (4) Step 4 at ship.

## Sep 23 2026, review pass after go-live (deploys `8ea20ef`)

- **Labels are $10 after launch** (Erick). Live `price_1UJ2aFBR2BAygII2cktt5l92`, sandbox repriced too,
  Vercel + .env.local updated. The shop page reads it live and quotes it in the bonus box and labels card.
- **Labels preview on the site**: the filled sample sheet (`public/images/labels-preview.png`) now sits in the
  /shop labels card (`#labels`, linked from the bonus box) and on /cookbook-resources. Sample reheat notes
  match the book's STORAGE blocks. Recipe list = final interior; "Make-Ahead" dropped from the muffin
  sandwiches so every name fits the 244pt field at 12pt (it measured 271pt).
- **Printables re-cut from the KDP interior** (`scripts/chapter11-printables/from-kdp-interior.py`). The
  Canva-cut copies had drifted ("homemade meatballs" vs "the Aloha Meatballs"; "Sourdough Sandwich Bread"
  vs "Easy…") and the old script's folio removal silently failed on the Sep 22 export. Text parity with the
  book verified word-for-word; old hashed URLs 308 to the new files.
- **Webhook endpoint recreated** (`we_1UJ2VnBR2BAygII2IXseYAFK`) so the signing secret could be re-pasted and
  proven with a signed replay. ⚠ Vercel stores these vars as *sensitive*: `vercel env pull` returns them
  EMPTY, so a secret you did not keep cannot be recovered from Vercel; recreate the endpoint instead.
- `SHOP_SHIP_ESTIMATE` is now lower-case "late October 2026" (it appears mid-sentence everywhere).
- ⚠ `vercel redeploy <url>` fails with "belongs to a different team" from this checkout; push a commit.

## Sep 23 2026, labels rebuilt and cart wiring (deploys through `17650d1` and later)

- Labels PDF rebuilt on Keegan's Canva draft (design DAHMgc0Znzw): Avery 5164/5524, six per sheet, page 1
  guide, pages 2-4 fillable, page 5 hand-write. Picking a recipe auto-fills the best-by line and the
  directions (document JS, validate action on the dropdown). Every direction verified against the book;
  the Canva draft's casserole times, warm-water rinses, honey-garlic timing, thaw times and several
  yields were wrong and were corrected from the book. Typography follows the book. Small text darkened
  a step so it prints in black and white; label sheets have no page tint.
- Checkout: preorder carries the labels as a $0.00 line (`hpm_labels_bonus` price, found by lookup key,
  created by setup in sandbox and live) with the pay-page note saying they are included; after launch
  the pay page offers them as an add-on (`optional_items`). `orderFromSession` now unions products from
  the paid line items, so an add-on is fulfilled. Confirmation email names the free labels.
- Verified: sandbox pay pages screenshotted in both phases; a live session created through the deployed
  route carried both lines, then was expired. Self-test 105/105.
- Sep 23 (late): best-by line prints alone ("Best by 3 months, use within 12 months"; sandwiches 1–2), no
  yield, no cooker tag; thumbnails on /shop and /cookbook-resources are a single-label close-up
  (`public/images/labels-preview-label.png`) that opens the full sheet; guide says colour or black and
  white is the printer dialog's choice; all 35 recipes verified through the real form path with no
  field clipping (105 filled fields checked). Sample confirmation email delivered via Resend to Erick.
