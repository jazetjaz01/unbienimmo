import type { Metadata } from "next";
import { Syncopate, Outfit } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import LayoutWrapper from "@/components/layout-wrapper";

const outfitSans = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const syncopateMono = Syncopate({ variable: "--font-syncopate-mono", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Unbienimmo.com | Leader de l'estimation immobilière en ligne",
  description: "Obtenez une estimation gratuite et vendez votre bien au meilleur prix.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${outfitSans.variable} ${syncopateMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          {/* LayoutWrapper n'a plus besoin de recevoir l'utilisateur */}
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </TooltipProvider>
      </body>
    </html>
  );
}