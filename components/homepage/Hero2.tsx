import React from 'react';
import Image from 'next/image';

const Hero2 = () => {
  return (
    <section className="w-full bg-white py-8 md:py-12 overflow-hidden">
      {/* Container ajusté en largeur max-w-7xl pour un affichage optimal */}
      <div className="max-w-450 mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
       {/* CARTE D'ESTIMATION (À GAUCHE) */}
<div className="relative lg:col-span-2 bg-[#1a1a1a] p-10 rounded-xl flex flex-col justify-center text-white overflow-hidden">
  
  {/* Vidéo en background */}
  <video 
    autoPlay 
   
    muted 
    playsInline 
    className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
  >
    <source src="/animation/data.mp4" type="video/mp4" />
  </video>

  {/* Contenu (Z-index supérieur) */}
  <div className="relative z-10">
    <div className="mb-6">
      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
        Analyse du marché local
      </span>
    </div>
    <h3 className="text-xl md:text-2xl font-semibold mb-6 leading-snug">
      Estimation de votre bien : les indicateurs clés pour réussir votre vente en 2026.
    </h3>
    
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-gray-400">
            <th className="pb-3 pr-4">Indicateur</th>
            <th className="pb-3 pr-4">Moyenne Secteur</th>
            <th className="pb-3 pr-4">Votre Estimation</th>
            <th className="pb-3">Tendance</th>
          </tr>
        </thead>
        <tbody className="text-gray-200">
          <tr className="border-b border-white/5"><td className="py-4">Prix au m²</td><td>4 200 €</td><td>4 450 €</td><td className="text-emerald-400">+5.9%</td></tr>
          <tr className="border-b border-white/5"><td className="py-4">Délai de vente</td><td>85 jours</td><td>62 jours</td><td className="text-emerald-400">-27%</td></tr>
          <tr><td className="py-4">Indice de demande</td><td>Stable</td><td>Élevée</td><td className="text-emerald-400">Haussier</td></tr>
        </tbody>
      </table>
    </div>
    
    <p className="text-sm text-gray-400">
      Données basées sur les transactions enregistrées dans votre quartier au cours des 3 derniers mois.
    </p>
  </div>
</div>

        {/* VISUEL (À DROITE) : Prend 1 colonne sur 3 (1/3) */}
        <div className="lg:col-span-1 w-full relative min-h-[400px]">
          <Image 
            src="/home-page/home-page2.png" 
            alt="Expert immobilier en analyse"
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