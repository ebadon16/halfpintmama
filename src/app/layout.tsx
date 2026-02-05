import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://halfpintmama.com"),
  title: "Half Pint Mama | Where Mom Life Meets Real Life",
  description: "A lifestyle blog about sourdough baking, family travel, DIY projects, and real talk about motherhood. By Keegan, a mama in Central Texas.",
  keywords: ["sourdough", "parenting", "family travel", "recipes", "DIY", "motherhood", "Texas mom"],
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
  return children;
}
