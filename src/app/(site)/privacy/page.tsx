export const metadata = {
  title: "Privacy Policy | Half Pint Mama",
  description: "Learn how Half Pint Mama collects, uses, and protects your personal information. Read our full privacy policy including cookies, analytics, and your rights.",
  alternates: { canonical: "https://halfpintmama.com/privacy" },
  openGraph: { images: ["/logo.jpg"] },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-8">
          Privacy Policy
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-md prose prose-sage max-w-none">
          <p className="text-charcoal/70 mb-6">
            <strong>Last updated:</strong> February 4, 2026
          </p>

          <p className="text-charcoal/80 mb-6">
            Half Pint Mama (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the halfpintmama.com website. This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our website.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Information We Collect
          </h2>
          <p className="text-charcoal/80 mb-4">
            We collect information you provide directly to us, such as when you:
          </p>
          <ul className="list-disc pl-6 text-charcoal/80 mb-6 space-y-2">
            <li>Subscribe to our email newsletter</li>
            <li>Fill out a contact form</li>
            <li>Leave comments on blog posts</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          <p className="text-charcoal/80 mb-6">
            This information may include your name, email address, and any other information you choose to provide.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Automatically Collected Information
          </h2>
          <p className="text-charcoal/80 mb-6">
            When you visit our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies installed on your device. Additionally, as you browse the site, we collect information about the individual web pages you view, what websites or search terms referred you to the site, and information about how you interact with the site.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Cookies
          </h2>
          <p className="text-charcoal/80 mb-6">
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-charcoal/80 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-charcoal/80 mb-6 space-y-2">
            <li>Send you our email newsletter (if you subscribed)</li>
            <li>Respond to your comments or questions</li>
            <li>Improve our website and content</li>
            <li>Analyze how visitors use our site</li>
            <li>Protect against spam and abuse</li>
          </ul>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Affiliate Links & Advertising
          </h2>
          <p className="text-charcoal/80 mb-6">
            This website contains affiliate links to products we recommend. If you click on an affiliate link and make a purchase, we may receive a small commission at no additional cost to you. We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for us to earn fees by linking to Amazon.com and affiliated sites.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Third-Party Services
          </h2>
          <p className="text-charcoal/80 mb-4">
            We may use third-party services that collect, monitor, and analyze information. These include:
          </p>
          <ul className="list-disc pl-6 text-charcoal/80 mb-6 space-y-2">
            <li>Google Analytics (website analytics)</li>
            <li>Email service providers (newsletter delivery)</li>
            <li>Social media platforms (embedded content)</li>
          </ul>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Your Rights
          </h2>
          <p className="text-charcoal/80 mb-6">
            You have the right to access, update, or delete your personal information. You can unsubscribe from our email list at any time by clicking the unsubscribe link in any email. If you have questions about your data, please contact us.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Children&apos;s Privacy
          </h2>
          <p className="text-charcoal/80 mb-6">
            Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Changes to This Policy
          </h2>
          <p className="text-charcoal/80 mb-6">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;last updated&quot; date.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mt-8 mb-4">
            Contact Us
          </h2>
          <p className="text-charcoal/80">
            If you have any questions about this Privacy Policy, please contact us through our{" "}
            <a href="/contact" className="text-terracotta hover:text-deep-sage transition-colors">
              contact page
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
