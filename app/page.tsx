// ⚠️ Important pour Next 16 + Turbopack
export const dynamic = "force-dynamic";

import { supabasePublic } from "@/lib/supabase/supabase-public";
import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { getFullPublicUrl } from "@/lib/supabase/storage";
import { AuthButton } from "@/components/auth-button";

// --- Interfaces ---

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
  created_at: string; // ✅ STRING
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
  created_at: string; // ✅ STRING
  exclusivite_agence: boolean;
  price: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

// --- Page principale ---

export default async function Home() {
  const { data: listings, error } = await supabasePublic
    .from("listings")
    .select(`
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
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(28) as { data: ListingData[] | null; error: any };

  if (error) {
    console.error("Erreur lors du chargement des annonces:", error);
    return (
      <main className="min-h-screen p-5">
        <div className="text-center mt-20 text-red-600">
          Erreur lors du chargement des annonces.
        </div>
      </main>
    );
  }

  const listingsWithImages: ListingForCard[] =
    listings?.map((listing) => {
      const primaryImage = listing.listing_images
        .sort((a, b) => a.sort_order - b.sort_order)[0];

      const imageUrl = primaryImage
        ? getFullPublicUrl(primaryImage.image_url)
        : "/placeholder.png";

      return {
        id: listing.id,
        title: listing.title,
        property_type: listing.property_type,
        room_count: listing.room_count,
        surface_area_m2: listing.surface_area_m2,
        zip_code: listing.zip_code,
        city: listing.city,
        exclusivite_agence: listing.exclusivite_agence,
        created_at: listing.created_at,
        price: listing.price,
        latitude: listing.latitude,
        longitude: listing.longitude,
        imageUrl,
      };
    }) || [];

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full p-5 md:p-10">
        {listingsWithImages.length > 0 ? (
          <div
            className="
              grid gap-x-4 gap-y-8
              grid-cols-2 sm:grid-cols-3 md:grid-cols-4
              lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7
            "
          >
            
            {listingsWithImages.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center p-20 border rounded-lg mt-10 text-gray-500">
            Aucune annonce publiée n'a été trouvée.
            <p className="mt-2">
              <Link href="/create" className="text-blue-600 hover:underline">
                Créer la première annonce ?
              </Link>
            </p>
          </div>
        )}
      </div>

      <footer className="w-full border-t text-center text-xs py-8 mt-auto">
        <p>© 2026 unbienimmo.com - annonces immobilières géolocalisées</p>
      </footer>
    </main>
  );
}
