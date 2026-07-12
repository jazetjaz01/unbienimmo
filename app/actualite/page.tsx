
import type { Metadata } from "next";
import Hero1 from "@/components/actualite/Hero1";
import Blog from "@/components/blog";

export const metadata: Metadata = {
  title: "Actualités immobilières",
  description:
    "Conseils, analyses de marché et actualités pour vendre ou estimer votre bien immobilier au meilleur prix.",
  alternates: { canonical: "/actualite" },
  openGraph: {
    title: "Actualités immobilières | Unbienimmo.com",
    description:
      "Conseils, analyses de marché et actualités pour vendre ou estimer votre bien immobilier au meilleur prix.",
    url: "/actualite",
  },
};

export default function Etudiant() {
  return (
    <div className="min-h-screen  font-sans">
      
      <main className="flex flex-col">
        <Hero1 />
      <Blog />
      

       
      </main>
    </div>
  );
}