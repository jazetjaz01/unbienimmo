// components/ListingsList.tsx

import * as React from 'react';
import { ListingCard } from './ListingCard'; 

// ... (Interfaces ListingForCard et ListingsListProps inchangées)

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

interface ListingsListProps {
  listings: ListingForCard[];
  loading: boolean;
}

export function ListingsList({ listings, loading }: ListingsListProps) {
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Chargement des annonces...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center p-10 border rounded-lg mt-10 text-gray-500">
        Aucune annonce ne correspond à vos critères de recherche.
      </div>
    );
  }

  return (
    // ➡️ MODIFICATION CLÉ ICI : Utilisation de Grid
    <div 
        className="
            grid 
            grid-cols-1            /* Par défaut, une seule colonne */
            sm:grid-cols-1         /* Sur petit écran, toujours une colonne (pour être sûr) */
            lg:grid-cols-2         /* ⬅️ Sur grand écran (1024px et plus), deux colonnes */
            gap-4                    /* Espacement entre les cartes */
        "
    >
      {listings.map((listing) => (
        // ⚠️ Chaque item doit juste être le conteneur de la ListingCard
        <div 
            key={listing.id} 
            className="
                border rounded-xl shadow-sm p-2 transition hover:shadow-md
                col-span-1 /* S'assure que chaque carte prend 1 colonne */
            "
        >
            <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  );
}