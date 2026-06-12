import React from 'react';
import Image from 'next/image';

const Hero4 = () => {
  return (
    <section className="w-full bg-slate-200 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* VISUEL À GAUCHE (Sur Desktop) */}
        <div className="order-1 lg:order-1 w-full max-w-[500px] mx-auto">
          <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden rounded-xs">
            <Image 
              src="/home-page/home-page4.jpg" 
              alt="Historique des ventes unbienimmobilier.com"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* TEXTE À DROITE (Sur Desktop) */}
        <div className="order-2 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-700 mb-6">
            Historique des ventes  <br />
             <span className="font-syncopate font-bold text-slate-700 tracking-tighter"> immobilières</span>
          </h2>
          <p className="text-lg text-slate-700 mb-10 max-w-md leading-relaxed font-normal text-justify">
            Déterminer le bon prix de vente pour un bien immobilier peut être complexe. Unbienimmo.com vous accompagne dans cette démarche en vous donnant accès aux biens récemment vendus dans votre quartier
          </p>
          <button
            type="button"
            className="w-full sm:w-auto bg-zinc-800 hover:bg-black text-white font-bold py-4 px-8 transition-all shadow-lg uppercase tracking-widest text-xs whitespace-nowrap active:scale-95"
          >
            Estimer un bien immobilier
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero4;