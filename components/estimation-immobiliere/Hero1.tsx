'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Star, MapPin, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useEstimationStore } from '@/store/useEstimationStore';

const Hero1 = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const router = useRouter();
  const setStepData = useEstimationStore((state) => state.setStepData);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAdresses = async () => {
      if (query.length < 4) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`/api/adresses-estimation?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Erreur API Adresse:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchAdresses, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (feature: any) => {
    setQuery(feature.properties.label);
    setShowDropdown(false);
    setStepData({ 
      address: feature.properties.name,
      city: feature.properties.city,
      postcode: feature.properties.postcode
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length > 5) router.push('/estimer');
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Image en arrière-plan */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/estimation-immobiliere/estimation-immobiliere1.jpg"
          alt="Estimation immobilière"
          fill
          className="object-cover object-center" 
          priority
        />
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Bloc formulaire centré */}
      <div className="relative z-10 w-[90%] max-w-2xl bg-white opacity-80 backdrop-blur-md p-8 md:p-12 shadow-2xl rounded-xs">
        <h1 className="text-2xl md:text-4xl font-semibold  mb-6  text-center leading-tight">
          je souhaite connaître la valeur <br/> 
          <span className=" font-syncopate font-bold ">de mon bien immobilier</span>
        </h1>

        <div className="w-full relative" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-slate-500 animate-spin" />
                ) : (
                  <MapPin className="h-5 w-5 text-slate-500" />
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Entrez l'adresse de votre bien..."
                className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none transition-all shadow-sm"
              />
            </div>
            
            <button
              type="submit"
              className="w-full sm:w-auto bg-zinc-800 hover:bg-black text-white font-bold py-4 px-8 rounded-xs transition-all shadow-lg uppercase tracking-widest text-xs whitespace-nowrap active:scale-95"
            >
              Estimer
            </button>
          </form>

          {/* LISTE DES SUGGESTIONS */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white shadow-xl rounded-lg overflow-hidden border border-slate-100">
              {suggestions.map((feature: any) => (
                <button
                  key={feature.properties.id}
                  onClick={() => handleSelect(feature)}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <p className="font-semibold">{feature.properties.name}</p>
                  <p className="text-xs text-slate-500">{feature.properties.postcode} {feature.properties.city}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PREUVE SOCIALE */}
        <div className="mt-8 flex justify-center items-center gap-4 text-zinc-800">
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm">Excellent</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#00b67a" className="text-[#00b67a]" />
              ))}
            </div>
          </div>
          <div className="h-8 w-[1px] bg-zinc-300" />
          <span className="text-xs font-semibold uppercase tracking-wider">4.4 / 5 sur Trustpilot</span>
        </div>
      </div>
    </section>
  );
};

export default Hero1;