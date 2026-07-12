import type { Metadata } from "next";
import Hero1 from "@/components/historique-ventes/Hero1";
import Hero2 from "@/components/historique-ventes/Hero2";
import Hero3 from "@/components/historique-ventes/Hero3";

export const metadata: Metadata = {
  title: "Historique des ventes immobilières",
  description:
    "Consultez l'historique des ventes immobilières et l'évolution des prix au m² par commune et par département en France.",
  alternates: { canonical: "/historique-ventes" },
  openGraph: {
    title: "Historique des ventes immobilières | Unbienimmo.com",
    description:
      "Consultez l'historique des ventes immobilières et l'évolution des prix au m² par commune et par département en France.",
    url: "/historique-ventes",
  },
};

export default function Historique() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Le Hero occupe la partie supérieure de ta page d'accueil */}
        <Hero1 />
        <Hero2 />
        <Hero3 />
      
        
        
      </main>
    </div>
  );
}