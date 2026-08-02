"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#F5F1E8", color: "#3A3A38", fontFamily: "Georgia, serif", margin: 0 }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <h1 style={{ fontSize: "2rem", color: "#4A5845", marginBottom: "1rem" }}>
              Something went wrong
            </h1>
            {/* 0.8 not 0.7: at 0.7 this blended to 4.33:1 on cream. Matches the
                app's text-charcoal/80 convention (5.69:1). */}
            <p style={{ color: "#3A3A38", opacity: 0.8, marginBottom: "2rem" }}>
              We hit an unexpected bump. Try again. It might just be a hiccup!
            </p>
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                // Mirrors .gradient-cta. Colours are hardcoded because
                // global-error replaces the root layout, so globals.css and its
                // CSS vars are not guaranteed. The old #C17B68 end put white
                // text at 3.33:1; this end is 6.78:1.
                background: "linear-gradient(135deg, #A0562F, #8A4A2E)",
                color: "white",
                fontWeight: 600,
                border: "none",
                borderRadius: "9999px",
                cursor: "pointer",
                fontSize: "1rem",
                marginRight: "0.75rem",
              }}
            >
              Try Again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error renders outside the app tree; next/link may not route reliably here. */}
            <a
              href="/"
              style={{
                padding: "0.75rem 1.5rem",
                border: "2px solid #7B8F6E",
                color: "#4A5845",
                fontWeight: 600,
                borderRadius: "9999px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
