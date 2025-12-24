import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Logo } from "./logo";

const footerSections = [
  {
    title: "Plateforme",
    links: [
      { title: "Vue d'ensemble", href: "/dashboard" },
      { title: "Nos offres", href: "/offres" },
      { title: "Diffusion directe", href: "#" },
      { title: "Mises à jour", href: "#" },
    ],
  },
  {
    title: "Société",
    links: [
      { title: "À propos", href: "/qui-sommes-nous" },
      { title: "Indépendance", href: "#" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { title: "Actualités", href: "/actualite" },
      { title: "Aide & Support", href: "/faq" },
      { title: "Guide Partenaire", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { title: "Agences", href: "#" },
      { title: "Notaires", href: "#" },
      { title: "Syndics", href: "#" },
      { title: "Promoteurs", href: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { title: "LinkedIn", href: "#" },
      { title: "Instagram", href: "#" },
      { title: "Twitter (X)", href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { title: "CGU / CGV", href: "/cgv" },
      { title: "Confidentialité", href: "/mentions_legales" },
      { title: "Cookies", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 font-sans pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* EN-TÊTE DU FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Logo />
            <div className="flex flex-col border-l border-gray-100 pl-3">
              <span className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-900 leading-none mb-1">
                UnBienImmo
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase font-light text-gray-400 leading-none">
                Solutions Pro
              </span>
            </div>
          </Link>
          
          <p className="max-w-sm text-[11px] leading-relaxed text-gray-400 uppercase tracking-[0.15em] font-light">
            La première plateforme d'annonces immobilières géolocalisées pensée pour l'indépendance des professionnels.
          </p>
        </div>

        {/* GRILLE D'INDEX */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-16">
          {footerSections.map(({ title, links }) => (
            <div key={title} className="flex flex-col space-y-8">
              <h6 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900 flex items-center gap-2">
                <span className="h-px w-3 bg-gray-200" />
                {title}
              </h6>
              <ul className="space-y-4">
                {links.map(({ title, href }) => (
                  <li key={title}>
                    <Link
                      href={href}
                      className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors duration-300 inline-block relative group"
                    >
                      {title}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mt-32 mb-12 bg-gray-50" />

        {/* BARRE INFÉRIEURE */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-[9px] uppercase tracking-[0.4em] text-gray-300 font-bold">
            <span>&copy; 2026 UNBIENIMMO.COM</span>
            <span className="hidden md:block text-gray-100">|</span>
            <span className="text-center md:text-left italic font-light lowercase tracking-widest">
              pro.unbienimmo.com
            </span>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-200">
              Système certifié
            </span>
            <div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;