import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, BookOpen, Tag } from "lucide-react";
import { ThemedIcon } from "@/components/ThemedIcon";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";
import { shopCopy } from "@/lib/shop/catalog";
import { CHECKLIST_PDF } from "@/lib/shop/printables";
import { PrintablesGrid } from "@/components/shop/PrintablesGrid";
import { getShopStatus, isShopPublic } from "@/lib/shop/status";

// The URL printed in the book. Free, no email gate: a reader holding the book
// should get the checklist by typing the address, not by signing up.

const DESCRIPTION =
  "The free Postpartum Freezer Prep Checklist from Rest and Rise: thirteen prep sessions across weeks 30 to 36 of pregnancy on one page, plus a freezer inventory sheet.";

export function generateMetadata(): Metadata {
  return {
    title: "Free Postpartum Freezer Prep Checklist | Half Pint Mama",
    description: DESCRIPTION,
    alternates: { canonical: "https://halfpintmama.com/checklist" },
    robots: { index: isShopPublic(), follow: true },
    openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
      title: "Free Postpartum Freezer Prep Checklist | Half Pint Mama",
      description: DESCRIPTION,
      type: "website",
      url: "https://halfpintmama.com/checklist",
    },
    twitter: {
      images: [DEFAULT_OG_IMAGE.url],
      card: "summary_large_image" as const,
      title: "Free Postpartum Freezer Prep Checklist | Half Pint Mama",
      description: DESCRIPTION,
    },
  };
}

export default function ChecklistPage() {
  const shop = shopCopy(getShopStatus());
  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-gradient-to-b from-terracotta/10 to-cream py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
            The Postpartum Freezer Prep Checklist
          </h1>
          <p className="text-charcoal/80 text-lg max-w-2xl mx-auto">
            Thirteen sessions. Six weeks. A freezer full of meals before baby arrives. The whole
            plan from Chapter 11 of <em>Rest and Rise</em> on one page, with a freezer inventory
            sheet on the back. Free to print.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:flex gap-10 items-start">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/images/freezer-prep-checklist-preview.png"
              alt="Page one of the Postpartum Freezer Prep Checklist: weeks 30 to 36 broken into thirteen numbered prep sessions with a checkbox beside each"
              width={900}
              height={1165}
              sizes="(min-width: 768px) 400px, 90vw"
              className="w-full h-auto rounded-lg shadow-xl border border-warm-beige"
            />
          </div>
          <div className="md:w-1/2">
            <a
              href={CHECKLIST_PDF}
              download="rest-and-rise-freezer-prep-checklist.pdf"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-lg"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              Download the checklist (PDF)
            </a>
            <p className="text-charcoal/80 text-sm mt-3 text-center">
              Two pages, US Letter. Print at 100% and stick it on the fridge.
            </p>

            <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-3">
              How to use it
            </h2>
            <ol className="list-decimal list-inside text-charcoal/80 text-sm space-y-2">
              <li>Start at week 30 with the setup week: feed your starter, take stock of equipment, do the big pantry run.</li>
              <li>Work the sessions in order. Several recipes feed into later ones, so the sequence matters.</li>
              <li>Check off each session as you finish it, then flip the page and log what lands in the freezer.</li>
            </ol>

            <div className="mt-8 bg-cream rounded-2xl p-5 flex gap-4 items-start">
              <ThemedIcon icon={BookOpen} size="md" color="deep-sage" />
              <p className="text-charcoal/80 text-sm">
                The recipes behind every session are in <em>Rest and Rise</em>.{" "}
                <Link href="/shop" className="text-terracotta hover:text-deep-sage font-medium">
                  {shop.cta}
                </Link>
                .
              </p>
            </div>
            <div className="mt-3 bg-cream rounded-2xl p-5 flex gap-4 items-start">
              <ThemedIcon icon={Tag} size="md" color="terracotta" />
              <p className="text-charcoal/80 text-sm">
                Label everything as it goes in. The printable freezer labels for every recipe are on{" "}
                <Link href="/cookbook-resources" className="text-terracotta hover:text-deep-sage font-medium">
                  the cookbook resources page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The rest of Chapter 11's fill-in pages, free as well. */}
      <section className="py-12 bg-cream">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-3 text-center">
            All the Chapter 11 Printables
          </h2>
          <p className="text-charcoal/80 text-center max-w-2xl mx-auto mb-8">
            The prep day planner, both stock-up lists, and the freezer inventory checklist, exactly as
            they appear in the book.
          </p>
          <PrintablesGrid />
        </div>
      </section>
    </div>
  );
}
