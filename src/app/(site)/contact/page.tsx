import { ContactForm } from "./ContactForm";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata = {
  title: "Contact | Half Pint Mama",
  description: "Get in touch with Keegan at Half Pint Mama. Questions about recipes, sourdough baking, collaborations, or just want to say hi? We'd love to hear from you.",
  alternates: { canonical: "https://halfpintmama.com/contact" },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Contact | Half Pint Mama",
    description: "Get in touch with Keegan at Half Pint Mama. Questions about recipes, sourdough, or collaborations.",
    type: "website",
    url: "https://halfpintmama.com/contact",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary" as const,
    title: "Contact | Half Pint Mama",
    description: "Get in touch with Keegan at Half Pint Mama. Questions about recipes, sourdough, or collaborations.",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-cream">
      <ContactForm />
    </div>
  );
}
