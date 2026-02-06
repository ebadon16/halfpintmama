import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Half Pint Mama",
  description: "Get in touch with Half Pint Mama. Questions, collaborations, or just want to say hi — we'd love to hear from you!",
  alternates: { canonical: "https://halfpintmama.com/contact" },
  openGraph: {
    title: "Contact | Half Pint Mama",
    description: "Get in touch with Half Pint Mama. Questions, collaborations, or just want to say hi!",
    url: "https://halfpintmama.com/contact",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary",
    title: "Contact | Half Pint Mama",
    description: "Get in touch with Half Pint Mama. Questions, collaborations, or just want to say hi!",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
