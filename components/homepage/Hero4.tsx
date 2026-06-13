import React from 'react';
import Link from 'next/link';
import { Calculator, History, MapPin, ArrowRight } from 'lucide-react';

const services = [
  {
    title: "Estimation de votre bien",
    description: "Obtenez une valeur précise et actualisée de votre logement en quelques clics grâce à notre simulateur.",
    icon: Calculator,
    href: "/estimation"
  },
  {
    title: "Historique des ventes",
    description: "Accédez aux données réelles des biens vendus dans votre secteur pour comprendre la réalité du marché.",
    icon: History,
    href: "/historique"
  },
  {
    title: "Carte des prix immobiliers",
    description: "Visualisez les tendances et les prix au m² quartier par quartier grâce à notre carte interactive.",
    icon: MapPin,
    href: "/carte"
  }
];

const Hero4 = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-450 mx-auto">
        {/* Titre principal */}
        <h2 className="text-4xl md:text-5xl font-medium text-center text-slate-900 mb-20 tracking-tight">
          Sûr. Précis. Indépendant.
        </h2>

        {/* Grille des services */}
        <div className="grid md:grid-cols-3 gap-16">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-start">
              {/* Icône (Style géométrique minimaliste) */}
              <div className="mb-8 p-2 border border-slate-200 rounded-lg">
                <service.icon className="w-10 h-10 text-slate-900 stroke-[1]" />
              </div>
              
              {/* Contenu */}
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {service.title}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                {service.description}
              </p>
              
              {/* Lien "En savoir plus" */}
              <Link 
                href={service.href} 
                className="inline-flex items-center text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
              >
                En savoir plus <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero4;