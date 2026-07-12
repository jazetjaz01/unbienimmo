import type { Metadata } from "next";
import Script from "next/script"; // Importation nécessaire
import { Syncopate, Outfit } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import LayoutWrapper from "@/components/layout-wrapper";

const outfitSans = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const syncopateMono = Syncopate({ variable: "--font-syncopate-mono", subsets: ["latin"], weight: ["400", "700"] });

const SITE_URL = "https://www.unbienimmo.com";
const SITE_NAME = "Unbienimmo.com";
const DEFAULT_TITLE = "Unbienimmo.com | Leader de l'estimation immobilière en ligne";
const DEFAULT_DESCRIPTION =
  "Obtenez une estimation gratuite et précise de votre bien immobilier en 2 minutes, et vendez au meilleur prix grâce à l'analyse du marché local d'Unbienimmo.com.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Unbienimmo.com",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "estimation immobilière",
    "estimation immobilière gratuite",
    "prix immobilier",
    "prix au m2",
    "vendre son bien",
    "estimation maison en ligne",
    "estimation appartement en ligne",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  areaServed: "FR",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/actualite?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
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
      <Script
        id="ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

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