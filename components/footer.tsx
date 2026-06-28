import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  // ... tes données restent identiques
  {
    title: "Estimation",
    links: [
      { title: "Perpignan", href: "/estimation-perpignan" },
      { title: "Paris", href: "/estimation-paris" },
      { title: "Nice", href: "/actualite/estimation-nice" },
      { title: "Montpellier", href: "/ville/montpellier" },
      { title: "Marseille", href: "/ville/marseille" },
      { title: "Toulouse", href: "/ville/toulouse" },
    ],
  },
  {
    title: "Estimation.",
    links: [
      { title: "Bordeaux", href: "/ville/bordeaux" },
      { title: "Lyon", href: "/ville/lyon" },
      { title: "Strasbourg", href: "/ville/strasbourg" },
      { title: "Nantes", href: "/ville/nantes" },
      { title: "Lille", href: "/ville/lille" },
      { title: "Toulon", href: "/ville/toulon" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { title: "Actualité", href: "/actualite" },
      { title: "Newsletter", href: "/contact" },
      { title: "Evenements", href: "/contact" },
      { title: "Centre d'aide", href: "/contact" },
      { title: "Méthodologie", href: "/contact" },
      { title: "Support", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { title: "Estimations", href: "/Estimations" },
      { title: "Historique ventes", href: "/historique-ventes" },
      { title: "Carte prix", href: "/prix-immobilier" },
      { title: "Vendre", href: "/vendre" },
      { title: "Acheter", href: "/acheter" },
      { title: "Location", href: "/location" },
    ],
  },
  {
    title: "Réseaux sociaux",
    links: [
      { title: "Twitter", href: "#" },
      { title: "LinkedIn", href: "#" },
      { title: "Facebook", href: "#" },
      { title: "GitHub", href: "#" },
      { title: "Youtube", href: "#" },
      { title: "Instagram", href: "#" },
    ],
  },
  {
    title: "A propos",
    links: [
      { title: "CGU", href: "/cgu" },
      { title: "Mentions légales", href: "/mentions" },
      { title: "Vie privée", href: "/vie-privee" },
      { title: "Confidentialite", href: "/confidentialite" },
      { title: "Cookies", href: "/cookies" },
      { title: "Contact", href: "/contact" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-450">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 px-6 py-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h6 className=" tracking-wider text-sm text-white  font-bold">{title}</h6>
              <ul className="mt-6 space-y-4">
                {links.map(({ title, href }) => (
                  <li key={title}>
                    <Link
                      className="text-white hover:text-slate-400 transition-colors duration-200"
                      href={href}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Séparateur pour fond noir */}
       

        <div className="flex flex-col items-center justify-between gap-x-2 gap-y-4 px-6 py-8 sm:flex-row">
          {/* Copyright avec texte gris pour un rendu plus élégant sur noir */}
          <span className="text-white text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/" target="_blank" className="text-white hover:text-slate-400 underline-offset-4 hover:underline">
              Unbienimmo.com
            </Link>
           <span className="hidden sm:inline-block">. Estimation de biens immobiliers</span>
  
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;