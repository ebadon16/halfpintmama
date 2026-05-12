import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5C6B52",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://halfpintmama.com"),
  title: "Half Pint Mama | Nourishing Motherhood From Scratch",
  description: "From-scratch recipes, sourdough baking, and honest motherhood from a Pediatric ER RN and mama of two in Central Texas.",
  keywords: ["sourdough", "from scratch recipes", "parenting", "motherhood", "real food", "sourdough recipes", "mama blog", "Texas mom"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Half Pint Mama",
    description: "From-scratch recipes, sourdough baking, and honest motherhood from a Pediatric ER RN and mama of two.",
    type: "website",
    locale: "en_US",
    siteName: "Half Pint Mama",
  },
  twitter: {
    card: "summary_large_image",
    site: "@halfpintmama",
    creator: "@halfpintmama",
    title: "Half Pint Mama",
    description: "From-scratch recipes, sourdough baking, and honest motherhood from a Pediatric ER RN and mama of two.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
