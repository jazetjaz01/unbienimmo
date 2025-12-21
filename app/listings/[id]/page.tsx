import { notFound } from "next/navigation";
import Image from "next/image";
import { supabasePublic } from "@/lib/supabase/supabase-public";
import { getFullPublicUrl } from "@/lib/supabase/storage";
import Gallery from "@/components/Gallery1";
import CallbackForm from "@/components/CallbackForm";
import ListingFeatures from "@/components/ListingFeatures";
import ProfessionalCard from "@/components/ProfessionalCard";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

/* --------------------------------
   Interfaces
--------------------------------- */

interface ListingImage {
  image_url: string;
  sort_order: number;
}

interface Professional {
  id?: number;
  name?: string;
  type?: string;
  street_address?: string | null;
  city?: string | null;
  zip_code?: string | null;
  logo_url?: string | null;
  phone?: string | null;
  website?: string | null;
  is_verified?: boolean;
}

interface Listing {
  id: number;
  title: string;
  transaction_type: string;
  description: string | null;
  property_type: string;
  room_count: number | null;
  bedroom_count: number | null;
  bathroom_count: number | null;
  surface_area_m2: number | null;
  zip_code: string;
  city: string;
  price: number;
  created_at: string;
  updated_at: string;
  listing_images: ListingImage[];
  professional: Professional | null;
}

/* -------------------------------
   Format date FR
-------------------------------- */
const formatDateFR = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(date));
};

/* --------------------------------
   Page
--------------------------------- */
export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /* -------------------------------
     Requête Supabase
  -------------------------------- */
  const { data: listing } = await supabasePublic
    .from("listings")
    .select(`
      *,
      listing_images (image_url, sort_order),
      professional:professionals!listings_professional_id_fkey (
        id,
        name,
        type,
        street_address,
        city,
        zip_code,
        logo_url,
        phone,
        website,
        is_verified
      )
    `)
    .eq("id", id)
    .maybeSingle<Listing>();

  if (!listing) notFound();

  /* -------------------------------
     Images (solution propre)
  -------------------------------- */
  const sortedImages: ListingImage[] =
    listing.listing_images?.slice().sort(
      (a, b) => a.sort_order - b.sort_order
    ) ?? [];

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

  /* -------------------------------
     Prix formaté
  -------------------------------- */
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(listing.price);

  /* --------------------------------
     Render
  --------------------------------- */
  return (
    <main className="py-6">
      {/* Galerie */}
      <Gallery sections={sections} />

      {/* Contenu */}
      <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-24
                      grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">

        {/* Colonne gauche */}
        <div>
          <h1 className="text-xl font-semibold">
            {listing.transaction_type} {listing.property_type}{" "}
            {listing.room_count && `${listing.room_count} pièces`}{" "}
            {listing.surface_area_m2 && `${listing.surface_area_m2} m²`}
          </h1>

          <p className="text-xl font-semibold">
            {listing.zip_code} {listing.city}
          </p>

          <p className="text-2xl font-bold text-teal-500">
            {formattedPrice}
          </p>

          <p className="mt-3 text-sm flex items-center gap-2">
            <span>Référence annonce {listing.id}</span> /
            <span>Mise en ligne le {formatDateFR(listing.created_at)}</span> /
            <span>Modifiée le {formatDateFR(listing.updated_at)}</span>
          </p>

          <ListingFeatures
            surfaceArea={listing.surface_area_m2}
            roomCount={listing.room_count}
            bedroomCount={listing.bedroom_count}
            bathroomCount={listing.bathroom_count}
          />

          {listing.description && (
            <p className="mt-6 leading-relaxed">
              {listing.description}
            </p>
          )}
        </div>

        {/* Colonne droite */}
        <aside className="sticky top-24 h-fit space-y-6">
          <div className="rounded-xl bg-slate-50 p-6 shadow-sm">
            <CallbackForm
              listingId={listing.id}
              listingTitle={listing.title}
              transactionType={listing.transaction_type}
              price={listing.price}
              city={listing.city}
            />
          </div>

          <div className="rounded-xl bg-slate-50 p-6 shadow-sm">
            <ProfessionalCard professional={listing.professional} />
          </div>
        </aside>
      </div>
    </main>
  );
}
