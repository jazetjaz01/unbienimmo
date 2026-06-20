// app/layout.tsx
import type { Metadata } from "next";
import { Syncopate, Outfit } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import LayoutWrapper from "@/components/layout-wrapper";
import { createClient } from "@/lib/supabase/server"; // Ajoute cet import

const outfitSans = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const syncopateMono = Syncopate({ variable: "--font-syncopate-mono", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Unbienimmo.com | Leader de l'estimation immobilière en ligne",
  description: "Obtenez une estimation gratuite et vendez votre bien au meilleur prix.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. Récupération de l'utilisateur côté serveur
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  return (
    <html lang="fr" className={`${outfitSans.variable} ${syncopateMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          {/* 2. Transmission de l'utilisateur au wrapper */}
          <LayoutWrapper user={user}>
            {children}
          </LayoutWrapper>
        </TooltipProvider>
      </body>
    </html>
  );
}