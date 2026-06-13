import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Hero2 = () => {
  return (
    <section className="w-full  py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* VISUEL À GAUCHE */}
        <div className="order-1 w-full max-w-[500px] mx-auto">
          <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden rounded-xs">
            <Image 
              src="/home-page/home-page4.jpg" 
              alt="Estimation immobilière UnBienImmo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* TEXTE À DROITE */}
        <div className="order-2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-semibold  mb-6">
            Un spécialiste de l'estimation <br />
            <span className="font-syncopate font-bold  tracking-tighter"> immobilière</span>
          </h2>
          
          <p className="text-lg text-slate-700 mb-10 max-w-lg leading-relaxed font-normal text-justify">
            Le simulateur en ligne d'UnBienImmo vous permet d’estimer votre bien (appartement ou maison) au prix le plus juste, pour que votre projet de vente soit une réussite. Gratuit, instantané, fiable et précis, notre modèle d’estimation reflète fidèlement la valeur de votre logement, et intègre les évolutions constantes du marché.
          </p>
          
          
        </div>

      </div>
    </section>
  );
};

export default Hero2;