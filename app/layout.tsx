import type { Metadata } from "next";
import { Syncopate, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// 1. Outfit est variable, on peut laisser tel quel
const outfitSans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

// 2. Syncopate n'est pas variable : il FAUT spécifier le poids (ex: 400 ou 700)
const syncopateMono = Syncopate({
  variable: "--font-syncopate-mono", // Vérifie bien ce nom
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Unbienimmo.com | Leader de l'estimation immobilière en ligne",
  description: "Obtenez une estimation gratuite et vendez votre bien au meilleur prix.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${outfitSans.variable} ${syncopateMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}