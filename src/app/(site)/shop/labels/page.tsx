import type { Metadata } from "next";
import Link from "next/link";
import { RecoverForm } from "@/components/shop/RecoverForm";

export const metadata: Metadata = {
  title: "Find Your Freezer Labels Link | Half Pint Mama",
  robots: { index: false, follow: true },
};

export default function LabelsRecoveryPage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-16">
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl text-deep-sage font-bold mb-3 text-center">
          Lost your labels link?
        </h1>
        <p className="text-charcoal/80 text-center mb-8">
          Enter the email you used at checkout and a fresh link to your printable freezer labels
          will be on its way.
        </p>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <RecoverForm />
        </div>
        <p className="text-charcoal/80 text-sm text-center mt-6">
          Do not have the labels yet?{" "}
          <Link href="/shop" className="text-terracotta hover:text-deep-sage font-medium">
            Visit the shop
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
