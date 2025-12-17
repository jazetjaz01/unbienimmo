import type { Metadata } from "next";

import { Outfit, Sarina } from "next/font/google";

import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "unbienimmo.com  site d'annonces immobilières géolocalisées",
  description: "Recherche géolocalisées par ville quartier et rue !",
};

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  display: "swap",
  subsets: ["latin"],
});

const sarina = Sarina({
  variable: "--font-sarina",
  weight: "400",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
  className={`
    ${outfitSans.variable}
    ${sarina.variable}
    ${outfitSans.className}
    antialiased
  `}
>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
