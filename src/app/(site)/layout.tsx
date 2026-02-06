import "../globals.css";
import dynamic from "next/dynamic";
import { Crimson_Text, Quicksand } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const EmailPopup = dynamic(() => import("@/components/EmailPopup").then((m) => m.EmailPopup));

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="application/rss+xml" title="Half Pint Mama" href="https://halfpintmama.com/feed.xml" />
      </head>
      <body className={`${crimsonText.variable} ${quicksand.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <EmailPopup />
        <Analytics />
      </body>
    </html>
  );
}
