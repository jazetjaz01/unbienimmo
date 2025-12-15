import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabase/supabase-public";
import { getFullPublicUrl } from "@/lib/supabase/storage";
import Gallery from "@/components/Gallery1";

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
  const { id } = await params;

  const { data: listing } = await supabasePublic
    .from("listings")
    .select(
      `
      *,
      listing_images (image_url, sort_order)
    `
    )
    .eq("id", id)
    .single<Listing>();

  if (!listing) notFound();

  // 🔁 Transformation Supabase → Gallery1
  const sortedImages =
    listing.listing_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];

  const sections = [
    // Image principale
    {
      images: sortedImages.slice(0, 1).map((img) => ({
        src: getFullPublicUrl(img.image_url),
        alt: listing.title,
      })),
    },
    // Grilles suivantes par groupe de 4
    ...Array.from({ length: Math.ceil((sortedImages.length - 1) / 4) }).map(
      (_, i) => ({
        type: "grid" as const,
        images: sortedImages
          .slice(1 + i * 4, 1 + (i + 1) * 4)
          .map((img) => ({
            src: getFullPublicUrl(img.image_url),
            alt: listing.title,
          })),
      })
    ),
  ];

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <main className="py-6 ">
      {/* ✅ Galerie IDENTIQUE à /test */}
      <Gallery sections={sections} />

      {/* Infos */}
          
      <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        {/* Gauche */}
        <div>
          <h1 className="text-3xl  font-semibold">{listing.title}</h1>

          <p className="mt-2 text-gray-600">
            {listing.city} ({listing.zip_code})
          </p>

          <div className="mt-4 text-gray-700">
            {listing.property_type}
            {listing.room_count && ` • ${listing.room_count} pièces`}
            {listing.surface_area_m2 && ` • ${listing.surface_area_m2} m²`}
          </div>

          {listing.description && (
            <p className="mt-6 leading-relaxed text-gray-800">
              {listing.description}
            </p>
          )}
        </div>

        {/* Droite */}
        <aside className="sticky top-24 h-fit rounded-xl border bg-white p-6 shadow-sm">
          <div className="text-2xl font-semibold">{formattedPrice}</div>

          <button className="mt-6 w-full rounded-lg bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 transition">
            Contacter l’agence
          </button>
        </aside>
      </div>
    </main>
  );
}
