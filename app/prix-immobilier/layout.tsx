import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte des prix immobiliers en France",
  description:
    "Explorez la carte interactive des prix immobiliers au m² par département et par commune en France.",
  alternates: { canonical: "/prix-immobilier" },
  openGraph: {
    title: "Carte des prix immobiliers en France | Unbienimmo.com",
    description:
      "Explorez la carte interactive des prix immobiliers au m² par département et par commune en France.",
    url: "/prix-immobilier",
  },
};

export default function PrixImmobilierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
