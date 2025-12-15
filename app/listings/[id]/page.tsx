import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabase/supabase-public";
import { getFullPublicUrl } from "@/lib/supabase/storage";
import Gallery6 from "@/components/Gallery6";

export const dynamic = "force-dynamic";

interface ListingImage {
  image_url: string;
  sort_order: number;
}

interface Listing {
  id: number;
  title: string;
  description: string | null;
  property_type: string;
  room_count: number | null;
  surface_area_m2: number | null;
  zip_code: string;
  city: string;
  price: number;
  created_at: string;
  listing_images: ListingImage[];
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ OBLIGATOIRE Next 16

  const { data: listing } = await supabasePublic
    .from("listings")
    .select(`
      *,
      listing_images (image_url, sort_order)
    `)
    .eq("id", id)
    .single<Listing>();

  if (!listing) notFound();

  const images =
    listing.listing_images
      ?.sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => getFullPublicUrl(img.image_url)) ?? [];

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
   <main className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 mt-4 mb-4">
      {/* Galerie */}
      <Gallery6 images={images} />

      {/* Infos */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        {/* Colonne gauche */}
        <div>
          <h1 className="text-3xl font-semibold">{listing.title}</h1>
          <p className="mt-2 text-gray-600">
            {listing.city} ({listing.zip_code})
          </p>

          <div className="mt-4 text-gray-700">
            {listing.property_type}
            {listing.room_count && ` • ${listing.room_count} pièces`}
            {listing.surface_area_m2 && ` • ${listing.surface_area_m2} m²`}
          </div>

          {listing.description && (
            <p className="mt-6 leading-relaxed">
              {listing.description}
            </p>
          )}
        </div>

        {/* Colonne droite (prix façon Airbnb) */}
        <div className="sticky top-24 h-fit rounded-xl border p-6 shadow-sm">
          <div className="text-2xl font-semibold">
            {formattedPrice}
          </div>

          <button className="mt-6 w-full rounded-lg bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 transition">
            Contacter l’agence
          </button>
        </div>
      </div>
    </main>
  );
}
