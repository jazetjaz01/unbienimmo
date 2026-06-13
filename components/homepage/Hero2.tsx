import React from 'react';
import Image from 'next/image';

const Hero2 = () => {
  return (
    <section className="w-full bg-white py-4 md:py-8 overflow-hidden ">
      {/* 
        MODIFICATIONS :
        1. max-w-7xl : Pour donner de l'espace sur les grands écrans.
        2. lg:grid-cols-3 : On définit une grille en 3 colonnes.
      */}
      <div className="max-w-450 mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch ">
        
        {/* CARTE DE DONNÉES (À GAUCHE) : Prend 2 colonnes sur 3 (2/3) */}
        <div className="lg:col-span-2 bg-[#1a1a1a] p-10 rounded-xl flex flex-col justify-center text-white">
          <div className="mb-6">
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">F</span>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold mb-6 leading-snug">
            Q3 SaaS revenue came in at $127.5 million, 17% above the $109.0 million forecast, 
            representing a $18.5 million upside.
          </h3>
          
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 pr-4">Product Line</th>
                  <th className="pb-3 pr-4">Actual</th>
                  <th className="pb-3 pr-4">Forecast</th>
                  <th className="pb-3">Variance</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                <tr className="border-b border-white/5"><td className="py-4">Core</td><td>$78.9m</td><td>$65.0m</td><td>+$13.9m</td></tr>
                <tr className="border-b border-white/5"><td className="py-4">Premium</td><td>$38.9m</td><td>$35.0m</td><td>+$3.9m</td></tr>
                <tr><td className="py-4">Enterprise</td><td>$9.7m</td><td>$9.0m</td><td>+$0.7m</td></tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-gray-400">Core (~75% of upside)</p>
        </div>

        {/* VISUEL (À DROITE) : Prend 1 colonne sur 3 (1/3) */}
        <div className="lg:col-span-1 w-full relative min-h-[400px]">
          <Image 
            src="/home-page/home-page2.png" 
            alt="Personne au travail"
            fill
            className="object-cover rounded-xl"
            priority
          />
        </div>

      </div>
    </section>
  );
};

export default Hero2;