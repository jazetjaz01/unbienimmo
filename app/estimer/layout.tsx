import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démarrer mon estimation gratuite",
  description:
    "Estimez gratuitement votre bien immobilier en quelques étapes : adresse, caractéristiques, et obtenez votre estimation en 2 minutes.",
  alternates: { canonical: "/estimer" },
  openGraph: {
    title: "Démarrer mon estimation gratuite | Unbienimmo.com",
    description:
      "Estimez gratuitement votre bien immobilier en quelques étapes : adresse, caractéristiques, et obtenez votre estimation en 2 minutes.",
    url: "/estimer",
  },
};

export default function EstimerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
