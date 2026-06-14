"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

const categories = [
  "Tous",
  "Conseils Vente",
  "Marché Immobilier",
  "Actualités",
  "Guides",
];

export default function BlogHeader() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Titre et Sous-titre inspirés de "Capture d’écran 2026-06-14 à 15.15.12.png" */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-syncopate">
            Actualités
          </h1>
          <p className="mt-4 text-lg  max-w-xl">
            Restez informé des dernières tendances du marché, conseils d'experts 
            et actualités de votre secteur.
          </p>
        </div>

        {/* Barre de filtrage et recherche */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 text-sm rounded-full border transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-transparent text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button className="p-3 border rounded-full text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors">
            <Search className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}