"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#F5F1E8", color: "#3A3A38", fontFamily: "Georgia, serif", margin: 0 }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <h1 style={{ fontSize: "2rem", color: "#5C6B52", marginBottom: "1rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#3A3A38", opacity: 0.7, marginBottom: "2rem" }}>
              We hit an unexpected bump. Try again — it might just be a hiccup!
            </p>
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                background: "linear-gradient(135deg, #C4835F, #D4A894)",
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
            <a
              href="/"
              style={{
                padding: "0.75rem 1.5rem",
                border: "2px solid #7B8F6E",
                color: "#5C6B52",
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
