
import type { Metadata } from "next";
import Hero1 from "@/components/homepage/Hero1";
import Hero2 from "@/components/homepage/Hero2";
import Hero3 from "@/components/homepage/Hero3";
import Hero4 from "@/components/homepage/Hero4";
import Hero5 from "@/components/homepage/Hero5";

export const metadata: Metadata = {
  title: "Estimation immobilière gratuite en ligne",
  description:
    "Estimez gratuitement la valeur de votre maison, appartement ou terrain en 2 minutes grâce à l'analyse des prix du marché local d'Unbienimmo.com.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Unbienimmo.com | Leader de l'estimation immobilière en ligne",
    description:
      "Estimez gratuitement la valeur de votre maison, appartement ou terrain en 2 minutes grâce à l'analyse des prix du marché local.",
    url: "/",
  },
};

export default function Home() {
  return (
    <main className="flex-1">
      <Hero1 />
      <Hero2 />
   
    
      <Hero4 />
      <Hero5 />
        <Hero3 />
    </main>
  );
}