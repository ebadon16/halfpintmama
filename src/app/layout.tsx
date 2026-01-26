import type { Metadata } from "next";
import { Crimson_Text, Quicksand } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailPopup } from "@/components/EmailPopup";

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

export const metadata: Metadata = {
  title: "Half Pint Mama | Where Mom Life Meets Real Life",
  description: "A lifestyle blog about sourdough baking, family travel, DIY projects, and real talk about motherhood. By Keegan, a mama in Central Texas.",
  keywords: ["sourdough", "parenting", "family travel", "recipes", "DIY", "motherhood", "Texas mom"],
  openGraph: {
    title: "Half Pint Mama",
    description: "Where Mom Life Meets Real Life",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${crimsonText.variable} ${quicksand.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <EmailPopup />
      </body>
    </html>
  );
}
