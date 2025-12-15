import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/navbar";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${outfitSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
