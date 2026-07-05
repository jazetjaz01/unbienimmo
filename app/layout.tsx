import type { Metadata } from "next";
import Script from "next/script"; // Importation nécessaire
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
      {/* Chargement du script Google Tag */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-N1RK9BCF3F"
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-N1RK9BCF3F');
        `}
      </Script>

      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </TooltipProvider>
      </body>
    </html>
  );
}