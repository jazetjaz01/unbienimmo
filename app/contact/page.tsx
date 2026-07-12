import type { Metadata } from "next";
import Contact from "@/components/contact";
import Hero1 from "@/components/contact/Hero1";
import Hero2 from "@/components/contact/Hero2";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'équipe Unbienimmo.com pour toute question sur l'estimation ou la vente de votre bien immobilier.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Unbienimmo.com",
    description:
      "Contactez l'équipe Unbienimmo.com pour toute question sur l'estimation ou la vente de votre bien immobilier.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="flex-1">
   <Contact />
<Hero1 />
<Hero2 />
    </main>
  );
}