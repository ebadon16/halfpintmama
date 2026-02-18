import Link from "next/link";

export const metadata = {
  title: "Health Disclaimer | Half Pint Mama",
  description: "Health and wellness disclaimer for Half Pint Mama. Content is for informational and educational purposes only. Always consult your healthcare provider.",
  alternates: { canonical: "https://halfpintmama.com/disclaimer" },
  openGraph: {
    title: "Health Disclaimer | Half Pint Mama",
    description: "Health and wellness disclaimer for Half Pint Mama.",
    type: "website",
    url: "https://halfpintmama.com/disclaimer",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Health Disclaimer | Half Pint Mama",
    description: "Health and wellness disclaimer for Half Pint Mama.",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-8">
          Health Disclaimer
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-md space-y-6 text-charcoal/80 leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-3">
              For Informational Purposes Only
            </h2>
            <p>
              The content on Half Pint Mama (halfpintmama.com) is provided for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-3">
              About the Author
            </h2>
            <p>
              Keegan is a Registered Nurse (RN) with experience in pediatric emergency medicine. While her nursing background informs the perspectives shared on this site, the content here reflects her personal experience as a mother and is not professional medical advice. She is sharing her journey — not prescribing or diagnosing.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-3">
              Always Consult Your Healthcare Provider
            </h2>
            <p>
              Always seek the advice of your physician, pediatrician, or other qualified healthcare provider with any questions you may have regarding a medical condition, your child&apos;s health, nutrition, or wellness. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-3">
              Food & Recipes
            </h2>
            <p>
              Recipes and food-related content are shared based on personal experience. Individual dietary needs, allergies, and medical conditions vary. Please consult with your healthcare provider or a registered dietitian before making significant changes to your diet or your child&apos;s diet.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-3">
              No Liability
            </h2>
            <p>
              Half Pint Mama assumes no responsibility or liability for any errors or omissions in the content of this site. The information contained in this site is provided on an &quot;as is&quot; basis with no guarantees of completeness, accuracy, or timeliness.
            </p>
          </section>

          <div className="pt-4 border-t border-light-sage">
            <p className="text-charcoal/60 text-sm">
              If you have questions about this disclaimer, please{" "}
              <Link href="/contact" className="text-terracotta hover:text-deep-sage transition-colors">
                contact us
              </Link>.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sage hover:text-deep-sage font-medium transition-colors">
            &larr; Back to Half Pint Mama
          </Link>
        </div>
      </div>
    </div>
  );
}
