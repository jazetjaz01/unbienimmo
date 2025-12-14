// components/ListingsList.tsx

import * as React from 'react';
import { ListingCard } from './ListingCard'; // Assurez-vous que le chemin est correct

interface ListingForCard {
    id: number;
    // ... (inclure tous les autres champs nécessaires pour ListingCard)
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
    <div className="space-y-4">
      {listings.map((listing) => (
        // La ListingCard doit être adaptée pour un affichage vertical dans cette colonne
        <div key={listing.id} className="border rounded-xl shadow-sm p-2 transition hover:shadow-md">
            <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  );
}