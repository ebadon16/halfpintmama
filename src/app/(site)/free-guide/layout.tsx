import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Sourdough Starter Guide | Half Pint Mama",
  description: "Download your free sourdough starter guide from Half Pint Mama. Everything you need to start your sourdough journey.",
};

export default function FreeGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
