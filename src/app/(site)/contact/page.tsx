import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact | Half Pint Mama",
  description: "Get in touch with Keegan at Half Pint Mama. Questions about recipes, sourdough baking, collaborations, or just want to say hi? We'd love to hear from you.",
  alternates: { canonical: "https://halfpintmama.com/contact" },
  openGraph: {
    title: "Contact | Half Pint Mama",
    description: "Get in touch with Keegan at Half Pint Mama. Questions about recipes, sourdough, or collaborations.",
    url: "https://halfpintmama.com/contact",
    images: ["/logo.jpg"],
  },
  twitter: {
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
