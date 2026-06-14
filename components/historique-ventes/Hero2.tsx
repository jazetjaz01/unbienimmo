import React from 'react';
import Link from 'next/link';
import { Database, Map, Target, ArrowRight } from 'lucide-react';

const features = [
  {
    title: "Fiabilité des données",
    description: "Nous exploitons les bases de données officielles du Gouvernement français pour vous garantir des informations transparentes et certifiées sur le marché immobilier.",
    icon: Database,
    href: "/donnees" // Ajoutez vos chemins ici
  },
  {
    title: "Une vue d'ensemble",
    description: "Accédez à une cartographie interactive regroupant l'historique des ventes : adresses, surfaces, nombres de pièces et prix réels enregistrés depuis 2014.",
    icon: Map,
    href: "/carte"
  },
  {
    title: "Estimation précise",
    description: "Prenez les meilleures décisions grâce à une comparaison concrète avec les biens réellement vendus autour de chez vous, pour fixer le juste prix.",
    icon: Target,
    href: "/estimation"
  }
];

const Hero2 = () => {
  return (
    <section className="py-24 px-6 bg-slate-100">
      <div className="max-w-450 mx-auto">
        {/* Titre principal */}
        <h2 className="text-4xl md:text-5xl font-medium text-center text-slate-900 mb-20 tracking-tight">
          Sûr. Précis. Indépendant.
        </h2>

        {/* Grille des services */}
        <div className="grid md:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start">
              {/* Icône (Style géométrique minimaliste) */}
              <div className="mb-8 p-2 border border-slate-200 rounded-lg">
                <feature.icon className="w-10 h-10 text-slate-900 stroke-[1]" />
              </div>
              
              {/* Contenu */}
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                {feature.description}
              </p>
              
              {/* Lien "En savoir plus" */}
              <Link 
                href={feature.href} 
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

export default Hero2;