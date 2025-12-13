// app/page.tsx
// ⚠️ Important pour Next 16 + Turbopack : Assure que la récupération de données est dynamique
export const dynamic = "force-dynamic";

import { supabasePublic } from "@/lib/supabase/supabase-public";
import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button"; 
import { ListingCard } from "@/components/ListingCard"; 
import { getFullPublicUrl } from '@/lib/supabase/storage'; // Pour reconstruire l'URL de l'image

// --- Interfaces de Typescript ---

interface ListingImage {
  image_url: string; // ex: '24/17...jpg'
  sort_order: number;
}

interface ListingData {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  listing_images: ListingImage[]; 
}

// Le type final prêt pour la carte (avec l'URL déjà calculée)
interface ListingForCard {
    id: number;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    imageUrl: string; 
}


// --- Composant principal ---

export default async function Home() {
  
  // 1. Récupération des données avec jointure des images
  const { data: listings, error } = await supabasePublic
    .from("listings")
    .select(`
      id, 
      title, 
      price, 
      latitude, 
      longitude,
      listing_images (image_url, sort_order) 
    `)
    .eq("is_published", true)
    .order('created_at', { ascending: false }) // Les plus récentes en premier
    .limit(28) as { data: ListingData[] | null, error: any }; // Forçage de type pour la sélection JOINED

  if (error) {
    console.error("Erreur lors du chargement des annonces:", error);
    return (
      <main className="min-h-screen p-5">
        <div className="text-center mt-20 text-red-600">
          Erreur lors du chargement des annonces. (Vérifiez les RLS SELECT et les permissions du rôle anon).
        </div>
      </main>
    );
  }
  
  // 2. Traitement des données : Trouver l'image principale et calculer son URL
  const listingsWithImages: ListingForCard[] = listings?.map(listing => {
    // Triez par sort_order pour trouver l'image principale (sort_order = 1)
    const primaryImage = listing.listing_images
      .sort((a, b) => a.sort_order - b.sort_order)[0];

    // Reconstruire l'URL publique complète
    const imageUrl = primaryImage ? getFullPublicUrl(primaryImage.image_url) : '/placeholder.png'; // Image par défaut si aucune image

    return {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      latitude: listing.latitude,
      longitude: listing.longitude,
      imageUrl,
    };
  }) || [];


  return (
    <main className="min-h-screen flex flex-col items-center ">
      
      

      {/* --- Grille des Annonces (Style Airbnb) --- */}
      <div className="w-full  p-5 md:p-10">
       
        
        {listingsWithImages.length > 0 ? (
          <div 
            // Mise en page en grille responsive : 7 colonnes sur très grand écran
            className="grid gap-x-4 gap-y-8 
                       grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
          >
            {listingsWithImages.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center p-20 border rounded-lg mt-10 text-gray-500">
            Aucune annonce publiée n'a été trouvée pour le moment.
            <p className="mt-2">
              <Link href="/create" className="text-blue-600 hover:underline">
                Créer la première annonce ?
              </Link>
            </p>
          </div>
        )}
      </div>
      
      <footer className="w-full border-t mx-auto text-center text-xs gap-8 py-8 mt-auto">
        <p>© 2025 Listings App</p>
      </footer>
    </main>
  );
}