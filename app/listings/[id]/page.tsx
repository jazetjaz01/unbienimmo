import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabase/supabase-public";
import { getFullPublicUrl } from "@/lib/supabase/storage";
import Gallery from "@/components/Gallery1";
import CallbackForm from "@/components/CallbackForm";
export const dynamic = "force-dynamic";

interface ListingImage {
  image_url: string;
  sort_order: number;
}

interface Listing {
  id: number;
  title: string;
  transaction_type: string;
  description: string | null;
  property_type: string;
  room_count: number | null;
  surface_area_m2: number | null;
  zip_code: string;
  city: string;
  price: number;
  created_at: string;
  updated_at: string;
  listing_images: ListingImage[];
}

/* -------------------------------
   Format date FR : le 10 déc. 2025
-------------------------------- */
const formatDateFR = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(date));
};

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

  /* -------------------------------
     Images
  -------------------------------- */
  const sortedImages =
    listing.listing_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];

  const limitedImages = sortedImages.slice(0, 9);

  const sections = [
    {
      images: limitedImages.slice(0, 1).map((img) => ({
        src: getFullPublicUrl(img.image_url),
        alt: listing.title,
      })),
    },
    ...Array.from({
      length: Math.ceil((limitedImages.length - 1) / 4),
    }).map((_, i) => ({
      type: "grid" as const,
      images: limitedImages
        .slice(1 + i * 4, 1 + (i + 1) * 4)
        .map((img) => ({
          src: getFullPublicUrl(img.image_url),
          alt: listing.title,
        })),
    })),
  ];

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <main className="py-6">
      {/* Galerie */}
      <Gallery sections={sections} />

      {/* Infos */}
      <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        {/* Colonne gauche */}
        <div>
          <h1 className="text-xl font-semibold ">
            {listing.transaction_type} {listing.property_type}{" "}
            {listing.room_count && `${listing.room_count} pièces`}{" "}
            {listing.surface_area_m2 && `${listing.surface_area_m2} m²`}
          </h1>

          <p className="text-xl font-semibold ">
            {listing.zip_code} {listing.city}
          </p>

          <p className="text-2xl font-bold  text-teal-500">
            {formattedPrice}
          </p>

          <p className="mt-3 text-base ">
            Référence annonce {listing.id} · Mise en ligne le{" "}
            {formatDateFR(listing.created_at)} · Modifié le{" "}
            {formatDateFR(listing.updated_at)}
          </p>

          {listing.description && (
            <p className="mt-6 leading-relaxed text-gray-800">
              {listing.description}
            </p>
          )}
        </div>

        {/* Colonne droite */}
        <aside className="sticky top-24 h-fit rounded-xl  bg-slate-50 p-6 shadow-sm">
          <CallbackForm listingId={listing.id} listingTitle={listing.title} />
        </aside>
      </div>
    </main>
  );
}