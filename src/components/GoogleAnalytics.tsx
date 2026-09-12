import Script from "next/script";

// Renders nothing unless NEXT_PUBLIC_GA_ID is set, so the site works
// (and CSP additions are inert) until the measurement ID is configured.
//
// Page views are sent manually with a scrubbed location: the shop's delivery
// links and success page carry a per-order token or Stripe session id in the
// URL, and neither belongs in analytics.
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true, send_page_view: false });
          (function () {
            var path = location.pathname;
            if (path.indexOf('/shop/labels/') === 0) path = '/shop/labels/[token]';
            var scrubbed = location.origin + path + (path === '/shop/success' ? '' : location.search);
            // page_referrer defaults to document.referrer, and the same-origin
            // referrer policy sends the FULL url — which on a delivery page is a
            // working download link for that buyer's personalised PDF.
            gtag('event', 'page_view', { page_location: scrubbed, page_path: path, page_title: document.title, page_referrer: '' });
          })();
        `}
      </Script>
    </>
  );
}
