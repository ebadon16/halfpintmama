import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Half Pint Mama",
  description: "Get in touch with Half Pint Mama. Questions, collaborations, or just want to say hi — we'd love to hear from you!",
  alternates: { canonical: "https://halfpintmama.com/contact" },
  openGraph: { images: ["/logo.jpg"] },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
