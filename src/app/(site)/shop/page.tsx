import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ThemedIcon } from "@/components/ThemedIcon";
import { EmailSignup } from "@/components/EmailSignup";
import { BuyButton } from "@/components/shop/BuyButton";
import { PrintablesGrid } from "@/components/shop/PrintablesGrid";
import { BookOpen, CalendarCheck, HeartPulse, Croissant, Tag, Printer, Truck, ClipboardCheck } from "lucide-react";
import { AUTHOR_REF, SITE_URL, jsonLdHtml } from "@/lib/seo";
import { PRODUCTS, shopCopy, type ShopStatus } from "@/lib/shop/catalog";
import { LABEL_SHEET } from "@/lib/shop/labels-pdf";
import { getDisplayPrice, type DisplayPrice } from "@/lib/shop/prices";
import { getShopStatus } from "@/lib/shop/status";
import { getShipCountries, getShipEstimate } from "@/lib/shop/stripe";

// Prices are read live from Stripe; re-render at most every five minutes so a
// reprice shows up without a deploy but the page stays cached.
export const revalidate = 300;

const DESCRIPTION: Record<ShopStatus, string> = {
  waitlist:
    "Coming soon from Half Pint Mama: Rest & Rise, a post-partum cookbook with nurse-informed recovery tips, easy freezer meals, and sourdough recipes for new mamas.",
  preorder:
    "Preorder a signed copy of Rest & Rise, the postpartum cookbook from Half Pint Mama: 35 make-ahead freezer meals and nurse-informed recovery tips. Printable freezer labels free with every preorder.",
  launched:
    "Signed copies of Rest & Rise, the postpartum cookbook from Half Pint Mama: 35 make-ahead freezer meals and nurse-informed recovery tips. Plus printable freezer labels for every recipe.",
};

export async function generateMetadata(): Promise<Metadata> {
  const status = getShopStatus();
  const description = DESCRIPTION[status];
  return {
    title: "Shop | Half Pint Mama",
    description,
    alternates: { canonical: "https://halfpintmama.com/shop" },
    // Indexable the moment the shop can take an order; the sitemap and the
    // Book schema below flip with the same status.
    robots: { index: status !== "waitlist", follow: true },
    // No images here: the colocated opengraph-image.tsx (the book cover) is
    // picked up for both Open Graph and Twitter automatically.
    openGraph: {
      title: "Shop | Half Pint Mama",
      description,
      type: "website",
      url: "https://halfpintmama.com/shop",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Shop | Half Pint Mama",
      description,
    },
  };
}

const whatsInside = [
  {
    icon: BookOpen,
    color: "terracotta" as const,
    title: "35 Make-Ahead Recipes",
    description: "Slow cooker, pressure cooker, and sourdough meals designed to be cooked before baby arrives and pulled from the freezer after.",
  },
  {
    icon: CalendarCheck,
    color: "sage" as const,
    title: "A Week-by-Week Freezer Plan",
    description: "Thirteen prep sessions across weeks 30 to 36 of pregnancy, sequenced so everything is ready exactly when you need it.",
  },
  {
    icon: HeartPulse,
    color: "deep-sage" as const,
    title: "Nurse-Informed Recovery",
    description: "Real talk about the fourth trimester: recovery, feeding, and surviving those early days, from a Pediatric ER RN.",
  },
  {
    icon: Croissant,
    color: "pink" as const,
    title: "Sourdough for New Mamas",
    description: "From-scratch sourdough recipes built for postpartum life, including plenty you can eat with a baby on your hip.",
  },
];

const BOOK_TITLE = "Rest & Rise: Make-Ahead, Freezer-Friendly Sourdough Meals for Postpartum Recovery";

// Book + Offer structured data, only when there is a real offer to describe.
function bookJsonLd(status: "preorder" | "launched", price: DisplayPrice) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${SITE_URL}/shop#book`,
    name: BOOK_TITLE,
    author: AUTHOR_REF,
    bookFormat: "https://schema.org/Hardcover",
    image: `${SITE_URL}/images/rest-and-rise-cover.jpg`,
    url: `${SITE_URL}/shop`,
    description: DESCRIPTION[status],
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop`,
      price: (price.amount / 100).toFixed(2),
      priceCurrency: price.currency.toUpperCase(),
      availability: status === "preorder" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Half Pint Mama", url: SITE_URL },
    },
  };
}

export default async function ShopPage() {
  const status = getShopStatus();
  // Two different failures, two different answers. A transient Stripe error
  // leaves the offer up without a price line, because Checkout charges the
  // Price directly and will work the moment Stripe recovers. An archived Price
  // means the product was repriced and this deploy still points at the old one,
  // so the buy button cannot work and the page falls back to the waitlist
  // rather than taking a click that is certain to fail.
  const bookPrice = status === "waitlist" ? null : await getDisplayPrice("book").catch((err) => {
    console.error("Shop: could not read the book price", err);
    return null;
  });
  // The labels' standalone price is quoted during preorder too: it is what the
  // free bonus is worth, and the honest answer to "what happens after launch".
  const labelsPrice = status === "waitlist" ? null : await getDisplayPrice("labels").catch((err) => {
    console.error("Shop: could not read the labels price", err);
    return null;
  });
  const labelsLater = labelsPrice && labelsPrice.active !== false ? labelsPrice.formatted : null;
  const bookSellable = status !== "waitlist" && bookPrice?.active !== false;
  if (status !== "waitlist" && !bookSellable) {
    console.error("Shop: STRIPE_PRICE_BOOK points at an archived Price — reprice env not deployed");
  }
  // The badge and the structured data describe whether the book can actually be
  // bought, not merely which phase the env says we are in. Otherwise a page
  // showing the waitlist would still announce "Preorders Open" and publish an
  // Offer that search engines would surface with a price nobody can pay.
  const { badge } = shopCopy(bookSellable ? status : "waitlist");

  return (
    <div className="bg-cream">
      {bookSellable && bookPrice && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(bookJsonLd(status, bookPrice)) }}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="md:flex items-center gap-10 max-w-5xl mx-auto">
            {/* Book cover. The cover art already carries the title, subtitle,
                and byline, so no duplicate text block underneath. */}
            <div className="md:w-2/5 mb-8 md:mb-0">
              <div className="relative max-w-xs mx-auto">
                <Image
                  src="/images/rest-and-rise-cover.jpg"
                  alt="Rest & Rise cookbook cover: a loaf of sourdough lifted from a Dutch oven, under the title Rest & Rise, Make-Ahead, Freezer-Friendly Sourdough Meals for Postpartum Recovery, by Keegan Badon"
                  width={1401}
                  height={2001}
                  priority
                  sizes="320px"
                  className="w-full h-auto rounded-2xl shadow-xl border-4 border-terracotta/20"
                />
                <div className="absolute -top-4 -right-4 bg-terracotta text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md">
                  {badge}
                </div>
              </div>
            </div>

            <div className="md:w-3/5">
              <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
                The Postpartum Cookbook
              </h1>
              <p className="text-charcoal/80 text-lg mb-6">
                Stock your freezer before baby arrives, then rest while dinner takes care of
                itself. <em>Rest & Rise</em> pairs 35 make-ahead, freezer-friendly recipes with
                honest, nurse-informed guidance for the fourth trimester.
              </p>
              {status === "waitlist" || !bookSellable ? (
                <Waitlist />
              ) : (
                <BookOffer status={status} price={bookPrice} labelsLater={labelsLater} />
              )}
              {/* Page 140 of the book sends readers to this URL for the
                  printables. Without this they land on the hero and have to
                  scroll past everything to find what they were told was here. */}
              <p className="text-charcoal/80 text-sm mt-4">
                Here from the book?{" "}
                <a
                  href="#printables"
                  className="text-terracotta hover:text-deep-sage font-medium transition-colors"
                >
                  Jump to the free printables
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {status === "launched" && <LabelsOffer />}

        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 text-center">
            What&apos;s Inside
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {whatsInside.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="flex justify-center mb-3">
                  <ThemedIcon icon={item.icon} size="lg" color={item.color} />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-charcoal/80 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The book sends readers here (page 143) for every fill-in page in
            Chapter 11, and (pages 23 and 165) for the labels. Free in every phase. */}
        <section id="printables" className="mb-16 max-w-5xl mx-auto scroll-mt-24">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ThemedIcon icon={ClipboardCheck} size="lg" color="sage" />
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold">
              Free Printables From the Book
            </h2>
          </div>
          <p className="text-charcoal/80 text-center max-w-2xl mx-auto mb-8">
            Every fill-in page from Chapter 11: the prep day planner, both stock-up lists, and the
            freezer inventory checklist. Print as many as you need. No signup.
          </p>
          <PrintablesGrid compact />
        </section>

        {/* The labels: the book names them on pages 34 and 165, and during
            preorder they are the bonus, so buyers need to SEE what they are
            getting. The image is a real render of a filled sheet
            (scripts/shop/labels-preview.mjs). */}
        <section id="labels" className="mb-16 max-w-5xl mx-auto scroll-mt-24">
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 max-w-3xl mx-auto md:flex gap-8 items-start">
            <a
              href="/images/labels-preview.png"
              target="_blank"
              rel="noopener"
              className="block flex-shrink-0 w-64 md:w-72 mx-auto md:mx-0 mb-5 md:mb-0 rounded-lg overflow-hidden border border-warm-beige shadow-sm hover:shadow-md transition-shadow"
              aria-label="Open a full-size preview of a filled-in label sheet"
            >
              <Image
                src="/images/labels-preview-label.png"
                alt="One Rest & Rise freezer label, filled in: the recipe name, the date it was made, how long it keeps, and the from-the-freezer directions"
                width={864}
                height={720}
                sizes="(min-width: 768px) 288px, 256px"
                className="w-full h-auto"
              />
            </a>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold">
                  Printable Freezer Labels
                </h3>
                {status === "waitlist" && (
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-terracotta bg-terracotta/10 rounded-full px-2 py-0.5">
                    Not out yet
                  </span>
                )}
                {status === "preorder" && (
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-deep-sage bg-sage/20 rounded-full px-2 py-0.5">
                    Free with preorder
                  </span>
                )}
              </div>
              <p className="text-charcoal/80 text-sm mb-3">
                A fillable PDF made for your freezer: pick a recipe from the book and the label fills
                in its own best-by line and freezer directions, or type your own. Add the date you
                made it, then print. Three sheets of fillable labels plus one to
                hand-write, six {LABEL_SHEET.size} labels per sheet, unlimited reprints.
              </p>
              <p className="text-charcoal/80 text-sm">
                {status === "launched"
                  ? "Sold above as its own item."
                  : status === "preorder"
                    ? `Yours free with the book, emailed as soon as your payment clears. After launch they sell on their own${labelsLater ? ` for ${labelsLater}` : ""}.`
                    : "They are not for sale yet. When preorders open they come free with the book, and they become a separate item after that. Join the waitlist above and you will hear first."}
              </p>
              <ul className="text-charcoal/80 text-xs mt-4 space-y-1.5">
                <li className="flex gap-2 items-start">
                  <Printer className="w-4 h-4 text-sage flex-shrink-0" aria-hidden="true" />
                  Prints on Avery {LABEL_SHEET.averyWaterproof} freezer-safe sheets (the {LABEL_SHEET.avery} layout),
                  or any {LABEL_SHEET.size}, 6-per-sheet waterproof label. Fill them in on a computer.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-md mx-auto text-center">
          <div className="space-y-3">
            <Link
              href="/cooking"
              className="block text-deep-sage hover:text-charcoal font-medium transition-colors"
            >
              Browse recipes {status === "waitlist" ? "while you wait" : "from the blog"} &rarr;
            </Link>
            <Link
              href="/mama-life"
              className="block text-deep-sage hover:text-charcoal font-medium transition-colors"
            >
              Explore mama life posts &rarr;
            </Link>
            <div className="pt-2 border-t border-warm-beige/50">
              <Link
                href="/free-guide"
                className="text-terracotta hover:text-deep-sage text-sm font-medium transition-colors"
              >
                Get my free guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Today's page, kept verbatim: what renders whenever Stripe is not configured.
function Waitlist() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <p className="text-charcoal font-medium mb-3">
        Be the first to know when it launches:
      </p>
      <EmailSignup
        source="shop-waitlist"
        buttonText="Join Waitlist"
        placeholder="Your email"
        buttonClassName="bg-terracotta text-white hover:bg-terracotta/90"
        inputClassName="!border-terracotta/30 focus:!border-terracotta focus:!ring-terracotta/30"
      />
      <p className="text-charcoal/80 text-xs mt-3">
        Join and both my free guides arrive right away: the Postpartum Freezer Prep
        Guide, so you can start filling the freezer now, and my Sourdough Starter
        Guide, so your starter is ready before the book is. The printable freezer labels
        are not out yet; when preorders open they come free with the book.
      </p>
    </div>
  );
}

function shipsTo(): string {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  const countries = getShipCountries().map((c) => (c === "US" ? "US" : names.of(c) ?? c));
  return countries.length <= 1 ? `${countries[0] ?? "US"} addresses` : `${countries.slice(0, -1).join(", ")} and ${countries.at(-1)} addresses`;
}

function shippingLine(): string {
  return process.env.STRIPE_SHIPPING_RATE ? "Shipping is added at checkout." : "Free shipping.";
}

// After launch the book is also on Amazon. Direct sales net several times
// more per copy, so the shop's own button leads and Amazon is a quiet
// alternative for people who only buy there. Unset = no link.
function amazonUrl(status: "preorder" | "launched"): string | null {
  const url = process.env.SHOP_AMAZON_URL?.trim();
  return status === "launched" && url && /^https:\/\/(www\.)?amazon\./.test(url) ? url : null;
}

function BookOffer({ status, price, labelsLater }: { status: "preorder" | "launched"; price: DisplayPrice | null; labelsLater: string | null }) {
  const shipEstimate = getShipEstimate();
  const preorder = status === "preorder";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <p className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold">
          {PRODUCTS.book.name}, signed hardcover
        </p>
        <p className="text-2xl font-bold text-charcoal">{price ? price.formatted : <span className="text-base font-medium text-charcoal/80">Price at checkout</span>}</p>
      </div>
      <p className="text-charcoal/80 text-sm mb-4">
        {preorder && shipEstimate
          ? `Preorder now. Every copy from this site is signed by Keegan. Ships ${shipEstimate}, packed and mailed by her.`
          : "Every copy from this site is signed by Keegan, then packed and mailed by her."}{" "}
        {shippingLine()}
      </p>

      {preorder && (
        <div className="flex gap-3 items-start bg-cream rounded-xl p-4 mb-4">
          <ThemedIcon icon={Tag} size="md" color="terracotta" />
          <p className="text-charcoal/80 text-sm">
            <strong className="text-charcoal">Preorder bonus:</strong> the{" "}
            <a href="#labels" className="text-terracotta hover:text-deep-sage font-medium underline-offset-2 hover:underline">
              printable freezer labels
            </a>
            , free, emailed as soon as your payment clears. Only with a preorder; after launch
            they sell on their own{labelsLater ? ` for ${labelsLater}` : ""}. Changed your mind? Cancel any
            time before your book ships for a full refund.
          </p>
        </div>
      )}

      <BuyButton product="book" label={preorder ? "Preorder the Book" : "Buy the Book"} />
      {amazonUrl(status) && (
        <p className="text-center text-xs text-charcoal/80 mt-3">
          Prefer Amazon?{" "}
          <a
            href={amazonUrl(status)!}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="text-terracotta hover:text-deep-sage font-medium transition-colors"
          >
            Find it there
          </a>
          .
        </p>
      )}

      <ul className="text-charcoal/80 text-xs mt-4 space-y-1.5">
        <li className="flex gap-2 items-start">
          <Truck className="w-4 h-4 text-sage flex-shrink-0" aria-hidden="true" />
          Ships to {shipsTo()}. Secure checkout by Stripe.
        </li>
        {preorder && (
          <li className="flex gap-2 items-start">
            <Printer className="w-4 h-4 text-sage flex-shrink-0" aria-hidden="true" />
            The labels are a fillable PDF you print at home or at a print shop onto Avery{" "}
            {LABEL_SHEET.averyWaterproof} freezer-safe sheets, or any {LABEL_SHEET.size}, 6-per-sheet
            waterproof label. Fill them in on a computer.
          </li>
        )}
      </ul>
    </div>
  );
}

// After launch the labels sell on their own.
async function LabelsOffer() {
  const price = await getDisplayPrice("labels").catch((err) => {
    console.error("Shop: could not read the labels price", err);
    return null;
  });
  // Same rule as the book: an archived Price cannot be bought, so say nothing
  // rather than show a button that fails.
  if (price?.active === false) {
    console.error("Shop: STRIPE_PRICE_LABELS points at an archived Price — reprice env not deployed");
    return null;
  }
  return (
    <section className="mb-16 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:flex gap-6 items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0">
          <ThemedIcon icon={Tag} size="lg" color="terracotta" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold">
              {PRODUCTS.labels.name}
            </h2>
            <p className="text-2xl font-bold text-charcoal">{price ? price.formatted : <span className="text-base font-medium text-charcoal/80">Price at checkout</span>}</p>
          </div>
          <p className="text-charcoal/80 text-sm mb-4">
            A fillable PDF: pick any recipe in the book from the dropdown or type your own, add
            the date, print. Picking a book recipe fills in its best-by line and freezer directions for you. Three
            sheets of fillable labels plus one to hand-write, and unlimited
            reprints, so you can make as many as your freezer needs.
          </p>
          <BuyButton product="labels" label="Buy the Labels" />
          <ul className="text-charcoal/80 text-xs mt-4 space-y-1.5">
            <li className="flex gap-2 items-start">
              <Printer className="w-4 h-4 text-sage flex-shrink-0" aria-hidden="true" />
              You will need a printer (or a print shop) and Avery {LABEL_SHEET.avery}, or any
              {LABEL_SHEET.size}, 6-per-sheet freezer-safe label. Fill them in on a computer.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
