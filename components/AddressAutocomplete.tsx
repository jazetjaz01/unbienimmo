'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface Suggestion {
  id: string;
  name: string; // Adresse complète
  latitude: number;
  longitude: number;
  city: string;      // Ville
  zip_code: string | null; // Code postal
}

interface AddressAutocompleteProps {
  onAddressSelect: (
    address: string,
    lat: number,
    lng: number,
    city: string,
    zip_code: string | null
  ) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function AddressAutocomplete({
  onAddressSelect,
  onLoadingChange
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    setNoResultsFound(false);
    
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!MAPBOX_TOKEN) {
      console.error("Token Mapbox manquant.");
      return;
    }

    onLoadingChange(true);

    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${MAPBOX_TOKEN}&country=fr&language=fr&autocomplete=true&limit=6`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const getCityFromContext = (context: any[]): string => {
          const cityContext = context.find((item) => item.id.includes('place'));
          return cityContext ? cityContext.text : '';
        };

        const getZipCodeFromContext = (context: any[]): string | null => {
          const zipContext = context.find((item) => item.id.includes('postcode'));
          return zipContext ? zipContext.text : null;
        };

        const newSuggestions: Suggestion[] = data.features.map((feature: any) => ({
          id: feature.id,
          name: feature.place_name,
          latitude: feature.center[1],
          longitude: feature.center[0],
          city: getCityFromContext(feature.context || []),
          zip_code: getZipCodeFromContext(feature.context || []),
        }));

        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setNoResultsFound(true);
      }

    } catch (error) {
      console.error("Erreur de géocodage:", error);
      setSuggestions([]);
    } finally {
      onLoadingChange(false);
    }
  }, [onLoadingChange]);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  const handleSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
    setNoResultsFound(false);

    onAddressSelect(
      suggestion.name,
      suggestion.latitude,
      suggestion.longitude,
      suggestion.city,
      suggestion.zip_code
    );
  };

  const listStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginTop: '4px',
    maxHeight: '300px',
    overflowY: 'auto',
    listStyle: 'none',
    padding: 0
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(suggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Saisir l'adresse (France uniquement)..."
        className="w-full p-2 border rounded"
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul style={listStyles}>
          {suggestions.map((s, index) => (
            <li
              key={`${s.id}-${index}`} // 🔹 clé unique
              onMouseDown={() => handleSelect(s)}
              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            >
              {s.name} <span style={{ color: '#666', fontSize: '0.8em' }}>
                ({s.city || 'Ville non détectée'}{s.zip_code ? ` • ${s.zip_code}` : ''})
              </span>
            </li>
          ))}
        </ul>
      )}

      {noResultsFound && debouncedQuery === query && (
        <p className="text-red-500 text-sm mt-1">
          Aucune adresse trouvée en France. Veuillez être plus précis.
        </p>
      )}
    </div>
  );
}
