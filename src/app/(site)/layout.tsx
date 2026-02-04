import { Crimson_Text, Quicksand } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailPopup } from "@/components/EmailPopup";
import { Analytics } from "@vercel/analytics/next";

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
