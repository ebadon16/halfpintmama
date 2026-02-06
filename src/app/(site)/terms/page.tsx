export const metadata = {
  title: "Terms of Service | Half Pint Mama",
  description: "Read the terms of service for Half Pint Mama. Learn about content usage, recipe disclaimers, affiliate links, and comment policies for our food blog.",
  alternates: { canonical: "https://halfpintmama.com/terms" },
  openGraph: { images: ["/logo.jpg"] },
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-8">
          Terms of Service
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-md prose prose-sage max-w-none">
          <p className="text-charcoal/70 mb-6">
            <strong>Last updated:</strong> February 4, 2026
          </p>

          <p className="text-charcoal/80 mb-6">
            Welcome to Half Pint Mama! By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Use of This Website
          </h2>
          <p className="text-charcoal/80 mb-6">
            The content on this website is for general informational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information contained on this website.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Recipe & Health Disclaimer
          </h2>
          <p className="text-charcoal/80 mb-6">
            The recipes and health-related information on this website are provided for informational purposes only and are not intended as medical or nutritional advice. Always consult with a qualified healthcare provider before making changes to your diet, especially if you have allergies, food sensitivities, or health conditions. While I am a registered nurse, the content on this blog does not constitute medical advice.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Intellectual Property
          </h2>
          <p className="text-charcoal/80 mb-4">
            All content on this website, including but not limited to text, photographs, graphics, logos, and recipes, is the property of Half Pint Mama unless otherwise stated. You may:
          </p>
          <ul className="list-disc pl-6 text-charcoal/80 mb-6 space-y-2">
            <li>Share links to our content on social media</li>
            <li>Print recipes for personal, non-commercial use</li>
            <li>Quote brief excerpts with proper attribution and a link back to the original post</li>
          </ul>
          <p className="text-charcoal/80 mb-6">
            You may NOT republish, reproduce, or redistribute our content (including photos and full recipes) without written permission.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Affiliate Links & Sponsored Content
          </h2>
          <p className="text-charcoal/80 mb-6">
            This website contains affiliate links. When you click on these links and make a purchase, we may earn a commission at no additional cost to you. We only recommend products we genuinely use and believe in. Sponsored posts will always be clearly disclosed.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Comments & User Content
          </h2>
          <p className="text-charcoal/80 mb-4">
            By posting comments or content on this website, you grant us a non-exclusive, royalty-free license to use, reproduce, and display that content. You agree not to post content that:
          </p>
          <ul className="list-disc pl-6 text-charcoal/80 mb-6 space-y-2">
            <li>Is unlawful, harmful, threatening, abusive, or harassing</li>
            <li>Contains spam or promotional material</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains personal information of others</li>
          </ul>
          <p className="text-charcoal/80 mb-6">
            We reserve the right to remove any comments or content at our discretion.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Limitation of Liability
          </h2>
          <p className="text-charcoal/80 mb-6">
            In no event shall Half Pint Mama be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of this website or the information contained herein. You use this website at your own risk.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            External Links
          </h2>
          <p className="text-charcoal/80 mb-6">
            This website may contain links to external websites that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility for their privacy policies or content.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Changes to Terms
          </h2>
          <p className="text-charcoal/80 mb-6">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following any changes constitutes acceptance of those changes.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Contact Us
          </h2>
          <p className="text-charcoal/80">
            If you have any questions about these Terms of Service, please contact us through our{" "}
            <a href="/contact" className="text-terracotta hover:text-deep-sage transition-colors">
              contact page
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
