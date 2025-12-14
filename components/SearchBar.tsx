'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Définitions de types (inchangées)
export interface SearchParams {
  city: string
  propertyType: string
  minPrice: string
  maxPrice: string
}

interface SearchBarProps {
  onSearch: (params: SearchParams) => void
}

// Type Mapbox Feature ajusté
interface MapboxFeature {
  id: string
  place_name: string 
  text: string 
  context?: {
    text: string 
    id: string    
    short_code?: string 
  }[]
  properties: {
    postcode?: string
    address?: string
    short_code?: string
    wikidata?: string
  }
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = React.useState('')
  const [suggestions, setSuggestions] = React.useState<MapboxFeature[]>([])
  const [loadingCities, setLoadingCities] = React.useState(false)

  const [propertyType, setPropertyType] = React.useState('')
  const [minPrice, setMinPrice] = React.useState('')
  const [maxPrice, setMaxPrice] = React.useState('')

  // ➡️ Fonction utilitaire pour extraire la ville seule du nom formaté
  const extractCityName = (formattedCity: string): string => {
    // Si la chaîne contient le séparateur ' • ', on prend tout ce qui est avant.
    const separatorIndex = formattedCity.indexOf(' • ');
    if (separatorIndex !== -1) {
      return formattedCity.substring(0, separatorIndex).trim();
    }
    // Sinon, on retourne la chaîne telle quelle.
    return formattedCity.trim();
  }


  // ➡️ Fonction pour formater le nom de la ville + Code Postal ou Département (pour l'affichage)
  const formatCityName = (place: MapboxFeature): string => {
    // ... (Logique inchangée pour déterminer le 'detail': CP ou Département)
    let detail = ''; 
    const cityName = place.text;

    // --- 1. Tentative d'extraction du Code Postal (CP) ---
    if (place.properties?.postcode) {
      detail = place.properties.postcode;
    } 
    if (!detail && place.context) {
      const postcodeContext = place.context.find(c => c.id.startsWith('postcode.'));
      if (postcodeContext) {
        detail = postcodeContext.text;
      }
    }

    // --- 2. Si CP non trouvé, extraction du Département (Nom) ---
    if (!detail && place.context) {
        const departmentCodeItem = place.context.find(c => 
            c.short_code && c.short_code.startsWith('FR-') && c.short_code.length <= 6
        );

        if (departmentCodeItem) {
            detail = departmentCodeItem.text;
        }

        if (detail && detail.toLowerCase() === cityName.toLowerCase()) {
            detail = '';
        }
    }

    // 3. Retourner le format (Ville • Détail) pour l'AFFICHAGE
    if (detail) {
        return `${cityName} • ${detail}`; 
    }
    
    return cityName;
  }
  
  // 🔹 Autocomplete Mapbox (avec Debounce)
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (city.length < 2) {
        setSuggestions([])
        return
      }

      const controller = new AbortController()

      const fetchCities = async () => {
        setLoadingCities(true)
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              city
            )}.json?` +
              new URLSearchParams({
                access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
                country: 'fr',
                types: 'place,postcode,locality,region', 
                language: 'fr',
                limit: '5',
              }),
            { signal: controller.signal }
          )

          const data = await res.json()
          setSuggestions(data.features || [])
        } catch (err) {
          if ((err as any).name !== 'AbortError') {
            console.error(err)
          }
        } finally {
          setLoadingCities(false)
        }
      }

      fetchCities()
      return () => controller.abort()
    }, 300) 

    return () => clearTimeout(delayDebounceFn) 
  }, [city])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // ✅ CORRECTION CLÉ : Nettoyer la chaîne 'city' avant de l'envoyer à la recherche
    const cityForSearch = extractCityName(city);

    onSearch({ 
        city: cityForSearch, 
        propertyType, 
        minPrice, 
        maxPrice 
    })
  }

  const handleCitySelect = (place: MapboxFeature) => {
    // Mettre à jour l'input avec le nom formaté (pour l'affichage complet)
    setCity(formatCityName(place)) 
    setSuggestions([])
  }

  // Empêche l'Input de perdre le focus au clic
  const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault(); 
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        relative flex items-center
        h-12 bg-white
        rounded-full border
        shadow-sm hover:shadow-md
        px-4 gap-2
        w-full max-w-2xl
      "
    >
      {/* 🔍 Ville avec autocomplete */}
      <div className="relative flex-1">
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ville"
          className="border-none bg-transparent w-full"
        />

        {suggestions.length > 0 && (
          <ul 
            onMouseDown={handleMouseDown}
            className="absolute z-50 top-12 left-0 right-0 bg-white border rounded-lg shadow-lg overflow-hidden"
          >
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleCitySelect(item)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              >
                {formatCityName(item)} 
              </li>
            ))}
          </ul>
        )}
        {loadingCities && city.length >= 2 && (
            <div className="absolute z-50 top-12 left-0 right-0 bg-white border rounded-lg shadow-lg px-4 py-2 text-sm text-gray-500">
                Chargement...
            </div>
        )}
      </div>

      {/* Type */}
      <Input
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        placeholder="Type de bien"
        className="border-none bg-transparent flex-1"
      />

      {/* Budget */}
      <Input
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min €"
        type="number"
        className="border-none bg-transparent w-24"
      />
      <Input
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max €"
        type="number"
        className="border-none bg-transparent w-24"
      />

      <Button
        type="submit"
        className="h-10 w-10 rounded-full bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-0 focus-visible:ring-0"
      >
        <Search className="h-5 w-5 text-white" />
      </Button>
    </form>
  )
}