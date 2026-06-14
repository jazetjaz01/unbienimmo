"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, MapPin, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const Hero1 = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermeture du menu si clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recherche (Debounced)
  useEffect(() => {
    if (query.length < 4) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/adresses-historique?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Erreur API Adresse:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (feature: any) => {
    setQuery(feature.properties.label || `${feature.properties.name}, ${feature.properties.city}`);
    setSelectedFeature(feature);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFeature) {
      alert("Veuillez sélectionner une adresse dans la liste déroulante.");
      return;
    }

    const { citycode: insee } = selectedFeature.properties;
    const [lng, lat] = selectedFeature.geometry.coordinates;
    
    router.push(`/historique-ventes/carte?lat=${lat}&lng=${lng}&insee=${insee}`);
  };

  return (
    <section className="bg-background w-full py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Titre et Sous-titre */}
       <h1 className="text-2xl md:text-3xl lg:text-4xl font-syncopate font-bold tracking-tighter text-foreground max-w-5xl leading-tight">
         Retrouvez le prix des biens vendus dans votre quartier
        </h1>

        <p className="mt-6 text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Accédez aux données réelles du marché immobilier. Simple, rapide et transparent.
        </p>

        {/* Barre de recherche */}
        <div className="mt-12 w-full max-w-xl relative" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                ) : (
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Entrez l'adresse de votre bien..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-input rounded-full bg-background focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
              />
            </div>
            
            <Button type="submit" size="lg" className="px-8 font-semibold text-lg rounded-full h-14">
              Rechercher <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          {/* Liste des suggestions */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-background shadow-xl rounded-2xl overflow-hidden border border-border">
              {suggestions.map((feature: any, index: number) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleSelect(feature)}
                  className="w-full text-left px-6 py-4 hover:bg-muted transition-colors border-b border-border last:border-0"
                >
                  <p className="font-semibold">{feature.properties.name}</p>
                  <p className="text-sm text-muted-foreground">{feature.properties.postcode} {feature.properties.city}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero1;