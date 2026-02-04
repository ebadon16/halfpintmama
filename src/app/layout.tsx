import type { Metadata } from "next";

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
  return children;
}
