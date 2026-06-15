"use client";

import { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";

interface AddressSearchProps {
  onSearch: (lat: number, lng: number) => void;
}

export default function AddressSearch({ onSearch }: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Recherche d'adresse via API Etalab
  useEffect(() => {
    if (query.length < 3) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSuggestions(data.features || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (feature: any) => {
    const lat = feature.geometry.coordinates[1];
    const lng = feature.geometry.coordinates[0];
    
    setQuery(feature.properties.label);
    setSuggestions([]);
    onSearch(lat, lng);
  };

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-1 flex items-center relative max-w-lg w-full">
      <div className="w-full flex items-center relative">
        <MapPin size={20} className="text-cyan-700 ml-2" />
        <input
          className="w-full p-3 pl-2 outline-none text-sm"
          placeholder="Saisir une adresse..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {/* Bouton croix pour effacer */}
        {query.length > 0 && (
          <button 
            onClick={clearSearch}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
        
        {suggestions?.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border mt-1 rounded shadow-xl z-50">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                className="block w-full text-left p-3 text-xs hover:bg-gray-50 border-b" 
                onClick={() => handleSelect(s)}
              >
                {s.properties.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}