// app/estimation-immobilière/page.tsx
import Hero1 from "@/components/estimation-immobiliere/Hero1";
import Hero2 from "@/components/estimation-immobiliere/Hero2";
import Hero3 from "@/components/estimation-immobiliere/Hero3";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estimation Immobilière en ligne",
  description: "Obtenez une estimation précise et gratuite de votre bien immobilier en quelques clics.",
  alternates: { canonical: "/estimation-immobiliere" },
  openGraph: {
    title: "Estimation Immobilière en ligne | Unbienimmo.com",
    description: "Obtenez une estimation précise et gratuite de votre bien immobilier en quelques clics.",
    url: "/estimation-immobiliere",
  },
};

export default function EstimationPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Tu peux ajouter un Header ici si tu en as un */}
      
      <Hero1 />
      
     
        <Hero2 />
    <Hero3 />
     
    </main>
  );
}