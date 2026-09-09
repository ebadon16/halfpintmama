import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ThemedIcon } from "@/components/ThemedIcon";
import { EmailSignup } from "@/components/EmailSignup";
import { BuyButton } from "@/components/shop/BuyButton";
import { BookOpen, CalendarCheck, HeartPulse, Croissant, Tag, Printer, Truck, ClipboardCheck } from "lucide-react";
import { AUTHOR_REF, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY, SITE_URL, jsonLdHtml } from "@/lib/seo";
import { PRODUCTS, shopCopy, type ShopStatus } from "@/lib/shop/catalog";
import { LABEL_SHEET } from "@/lib/shop/labels-pdf";
import { getDisplayPrice, type DisplayPrice } from "@/lib/shop/prices";
import { getShopStatus } from "@/lib/shop/status";
import { CHECKLIST_PDF } from "@/lib/shop/checklist";
import { getShipCountries, getShipEstimate } from "@/lib/shop/stripe";

// Prices are read live from Stripe; re-render at most every five minutes so a
// reprice shows up without a deploy but the page stays cached.
export const revalidate = 300;

const DESCRIPTION: Record<ShopStatus, string> = {
  waitlist:
    "Coming soon from Half Pint Mama: Rest and Rise, a post-partum cookbook with nurse-informed recovery tips, easy freezer meals, and sourdough recipes for new mamas.",
  preorder:
    "Preorder Rest and Rise, the postpartum cookbook from Half Pint Mama: 35 make-ahead freezer meals and nurse-informed recovery tips. Printable freezer labels free with every preorder.",
  launched:
    "Rest and Rise, the postpartum cookbook from Half Pint Mama: 35 make-ahead freezer meals and nurse-informed recovery tips. Plus printable freezer labels for every recipe.",
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
    openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
      title: "Shop | Half Pint Mama",
      description,
      type: "website",
      url: "https://halfpintmama.com/shop",
    },
    twitter: {
      images: [DEFAULT_OG_IMAGE.url],
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
    description: "Crockpot, Instant Pot, and sourdough meals designed to be cooked before baby arrives and pulled from the freezer after.",
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

const BOOK_TITLE = "Rest and Rise: Make-Ahead, Freezer-Friendly Sourdough Meals for Postpartum Recovery";

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
  const { badge } = shopCopy(status);
  // A Stripe blip must not take the storefront down: the offer renders without
  // a price line and Checkout still charges the real Price.
  const bookPrice = status === "waitlist" ? null : await getDisplayPrice("book").catch((err) => {
    console.error("Shop: could not read the book price", err);
    return null;
  });

  return (
    <div className="bg-cream">
      {status !== "waitlist" && bookPrice && (
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
                  alt="Rest and Rise cookbook cover: Make-Ahead, Freezer-Friendly Sourdough Meals for Postpartum Recovery, by ER nurse and mom of three Keegan Badon, RN"
                  width={1303}
                  height={1931}
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
                itself. <em>Rest and Rise</em> pairs 35 make-ahead, freezer-friendly recipes with
                honest, nurse-informed guidance for the fourth trimester.
              </p>
              {status === "waitlist" ? <Waitlist /> : <BookOffer status={status} price={bookPrice} />}
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

        {/* Everything that goes with the book. The checklist is free in every
            phase; the labels card explains how to get them in this one. */}
        <section className="mb-16 max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 text-center">
            Goes With the Book
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md flex gap-4 items-start">
              <ThemedIcon icon={ClipboardCheck} size="lg" color="sage" />
              <div>
                <h3 className="font-semibold text-charcoal mb-1">The Freezer Prep Checklist</h3>
                <p className="text-charcoal/80 text-sm mb-3">
                  The Chapter 11 plan on one page: thirteen sessions across weeks 30 to 36, plus a
                  freezer inventory sheet. Free, no signup.
                </p>
                <a
                  href={CHECKLIST_PDF}
                  download="rest-and-rise-freezer-prep-checklist.pdf"
                  className="text-terracotta hover:text-deep-sage text-sm font-medium transition-colors"
                >
                  Download the checklist (PDF) &rarr;
                </a>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md flex gap-4 items-start">
              <ThemedIcon icon={Tag} size="lg" color="terracotta" />
              <div>
                <h3 className="font-semibold text-charcoal mb-1">Printable Freezer Labels</h3>
                <p className="text-charcoal/80 text-sm mb-3">
                  {status === "launched"
                    ? "A fillable PDF with a label for every recipe, sold above as its own item."
                    : status === "preorder"
                      ? "A fillable PDF with a label for every recipe. Free with every preorder, delivered by email the moment you order."
                      : "A fillable PDF with a label for every recipe. Coming as a preorder-only bonus with the book."}
                </p>
                <Link
                  href="/cookbook-resources"
                  className="text-terracotta hover:text-deep-sage text-sm font-medium transition-colors"
                >
                  About the labels &rarr;
                </Link>
              </div>
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
        Guide, so your starter is ready before the book is. Printable freezer labels
        for every recipe will be a preorder-only bonus. Preorders coming soon.
      </p>
    </div>
  );
}

function shipsTo(): string {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  const countries = getShipCountries().map((c) => (c === "US" ? "US" : names.of(c) ?? c));
  return countries.length <= 1 ? `${countries[0] ?? "US"} addresses` : `${countries.slice(0, -1).join(", ")} and ${countries.at(-1)} addresses`;
}

const SHIPPING_LINE = process.env.STRIPE_SHIPPING_RATE ? "Shipping is added at checkout." : "Free shipping.";

function BookOffer({ status, price }: { status: "preorder" | "launched"; price: DisplayPrice | null }) {
  const shipEstimate = getShipEstimate();
  const preorder = status === "preorder";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <p className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold">
          {PRODUCTS.book.name}, hardcover
        </p>
        <p className="text-2xl font-bold text-charcoal">{price ? price.formatted : <span className="text-base font-medium text-charcoal/80">Price at checkout</span>}</p>
      </div>
      <p className="text-charcoal/80 text-sm mb-4">
        {preorder && shipEstimate
          ? `Preorder now. Ships ${shipEstimate}, packed and mailed by Keegan.`
          : "Packed and mailed by Keegan."}{" "}
        {SHIPPING_LINE}
      </p>

      {preorder && (
        <div className="flex gap-3 items-start bg-cream rounded-xl p-4 mb-4">
          <ThemedIcon icon={Tag} size="md" color="terracotta" />
          <p className="text-charcoal/80 text-sm">
            <strong className="text-charcoal">Preorder bonus:</strong> the printable freezer
            labels for every recipe, free, delivered by email the moment you order. Only with a
            preorder. After launch they become a separate item.
          </p>
        </div>
      )}

      <BuyButton product="book" label={preorder ? "Preorder the Book" : "Buy the Book"} />

      <ul className="text-charcoal/80 text-xs mt-4 space-y-1.5">
        <li className="flex gap-2 items-start">
          <Truck className="w-4 h-4 text-sage flex-shrink-0" aria-hidden="true" />
          Ships to {shipsTo()}. Secure checkout by Stripe.
        </li>
        {preorder && (
          <li className="flex gap-2 items-start">
            <Printer className="w-4 h-4 text-sage flex-shrink-0" aria-hidden="true" />
            The labels are a fillable PDF you print at home or at a print shop onto Avery{" "}
            {LABEL_SHEET.avery} (2&quot; &times; 4&quot;) label sheets. Fill them in on a computer.
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
            A fillable PDF with a label for every recipe in the book: pick a recipe from the
            list or type your own, add the date, print. Two sheets of fillable labels plus one
            to hand-write, and unlimited reprints, forever.
          </p>
          <BuyButton product="labels" label="Buy the Labels" />
          <ul className="text-charcoal/80 text-xs mt-4 space-y-1.5">
            <li className="flex gap-2 items-start">
              <Printer className="w-4 h-4 text-sage flex-shrink-0" aria-hidden="true" />
              You will need a printer (or a print shop) and Avery {LABEL_SHEET.avery} (2&quot;
              &times; 4&quot;, 10 per sheet) label sheets. Fill them in on a computer.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
