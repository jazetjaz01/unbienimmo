'use client' // ⬅️ Reste un client component

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { supabasePublic } from '@/lib/supabase/supabase-public'
import { getFullPublicUrl } from '@/lib/supabase/storage' 
import { MapAndListLayout } from '@/components/MapAndListLayout' 
import { ListingsList } from '@/components/ListingsList'
import { MapboxMap } from '@/components/MapboxMap' 
import Link from 'next/link'

// --- Interfaces (à conserver ici ou dans un fichier centralisé) ---
// ... (Copiez les interfaces ListingImage, ListingData, ListingForCard ici)
interface ListingImage {
  image_url: string;
  sort_order: number;
}
interface ListingData {
  id: number;
  title: string;
  property_type: string;
  room_count: number | null;
  surface_area_m2: number | null;
  zip_code: string;
  city: string;
  created_at: string;
  exclusivite_agence: boolean;
  price: number;
  latitude: number; 
  longitude: number;
  listing_images: ListingImage[]; 
}
interface ListingForCard {
    id: number;
    title: string;
    property_type: string;
    room_count: number | null;
    surface_area_m2: number | null;
    zip_code: string;
    city: string;
    created_at: string;
    exclusivite_agence: boolean;
    price: number;
    imageUrl: string;
    latitude: number;
    longitude: number; 
}
const extractCityName = (formattedCity: string): string => {
  const separatorIndex = formattedCity.indexOf(' • ');
  if (separatorIndex !== -1) {
    return formattedCity.substring(0, separatorIndex).trim();
  }
  return formattedCity.trim();
}


// ➡️ RENOMMÉ EN SearchContainer
export function SearchContainer() {
  const searchParams = useSearchParams()

  const cityParam = searchParams.get('city') || ''
  const propertyType = searchParams.get('propertyType') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const [listings, setListings] = React.useState<ListingForCard[]>([])
  const [loading, setLoading] = React.useState(false)

  const city = extractCityName(cityParam);

  React.useEffect(() => {
    // ... (Logique de fetch inchangée)
    const fetchListings = async () => {
      setLoading(true)
      // ... (Requête Supabase et transformation des données) ...
      let query = supabasePublic.from('listings').select(`
        id,
        title,
        property_type,
        room_count,
        surface_area_m2,
        zip_code,
        city,
        exclusivite_agence,
        created_at,
        price,
        latitude, 
        longitude,
        listing_images (image_url, sort_order)
      `);

      if (city) query = query.ilike('city', `%${city}%`)
      if (propertyType) query = query.ilike('property_type', `%${propertyType}%`)

      const min = parseInt(minPrice)
      const max = parseInt(maxPrice)

      if (!isNaN(min)) query = query.gte('price', min)
      if (!isNaN(max)) query = query.lte('price', max)

      const { data, error } = await query
        .eq("is_published", true)
        .order('created_at', { ascending: false })
        .limit(50) as { data: ListingData[] | null; error: any };

      if (error) {
        console.error("Erreur Supabase lors du fetch des annonces de recherche:", error);
        setListings([]);
        setLoading(false);
        return;
      }
      
      const listingsWithImages: ListingForCard[] = (data || []).map((listing: ListingData) => {
          const primaryImage = listing.listing_images
            .sort((a, b) => a.sort_order - b.sort_order)[0];

          const imageUrl = primaryImage
            ? getFullPublicUrl(primaryImage.image_url)
            : "/placeholder.png";

          return {
            ...listing,
            imageUrl,
          };
      });

      setListings(listingsWithImages)
      setLoading(false)
    }

    fetchListings()
  }, [cityParam, propertyType, minPrice, maxPrice]) 

  return (
    <div className="p-4"> 
      <div className=" mx-auto">
        <h1 className="text-xs   mb-2">
           {cityParam ? ` ${cityParam}` : ''} {loading ? '...' : listings.length} biens immobiliers
        </h1>
      </div>

      <MapAndListLayout
        mapComponent={<MapboxMap listings={listings} />}
        listComponent={<ListingsList listings={listings} loading={loading} />}
      />
    </div>
  )
}