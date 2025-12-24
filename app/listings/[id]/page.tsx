import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabase/supabase-public";
import { getFullPublicUrl } from "@/lib/supabase/storage";

import Gallery from "@/components/Gallery1";
import CallbackForm from "@/components/CallbackForm";
import ListingFeatures from "@/components/ListingFeatures";
import ProfessionalCard from "@/components/ProfessionalCard";

import { getEnergyClass, getGhgClass } from "@/lib/dpe/energy-class";
import EnergyPerformance from "@/components/EnergyPerformance";

import { Calendar, Hash, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

/* --------------------------------
   Interfaces
--------------------------------- */
interface ListingImage {
  image_url: string;
  sort_order: number;
}

interface Professional {
  id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  email?: string | null;
  avatar_url?: string | null;
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
  energy_consumption?: number | null;
  ghg_emissions?: number | null;
  annual_energy_cost_min?: number | null;
  annual_energy_cost_max?: number | null;
  diagnostic_date?: string | null;
}

const formatDateFR = (date: string) => {
  if (!date) return "";
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
    .select(`
      *,
      listing_images (image_url, sort_order),
      professional:profiles (
        id,
        first_name,
        last_name,
        phone,
        email
      )
    `)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle<Listing>();

  if (!listing) notFound();

  const sortedImages = listing.listing_images?.slice().sort(
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

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    /* Suppression de font-sans pour utiliser Outfit héritée du layout */
    <main className="min-h-screen bg-white selection:bg-gray-900 selection:text-white ">
      <div className="w-full bg-gray-50">
        <Gallery sections={sections} />
      </div>

      <div className="mx-auto px-6 md:px-12 lg:px-10 max-w-7xl grid grid-cols-1 lg:grid-cols-[1.7fr_1.3fr] gap-10 mt-16 pb-24 ">
        <div className="space-y-24">
          
          <div className="border-b border-gray-100 pb-12">
            <div className="flex items-center gap-3 mb-8">
               <span className="text-[10px] tracking-[0.4em] uppercase font-bold bg-gray-900 text-white px-3 py-1">
                {listing.transaction_type === 'vendre' ? 'Vente' : 'Location'}
              </span>
              <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-400">
                {listing.property_type}
              </span>
            </div>
            
            <h1 className="text-6xl font-light tracking-tighter text-gray-900 mb-6 italic">
              {listing.city}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 mb-10">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-300" />
                <span className="text-sm font-medium uppercase tracking-widest text-gray-500">
                  {listing.zip_code} {listing.city}
                </span>
              </div>
              <div className="text-4xl font-light tracking-tighter text-gray-900 italic">
                {formattedPrice}
              </div>
            </div>

            <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-50">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">
                <Hash className="h-3 w-3" /> Réf. {listing.id}
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">
                <Calendar className="h-3 w-3" /> Mis à jour le {formatDateFR(listing.updated_at)}
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-900 mb-12">Caractéristiques</h2>
            <ListingFeatures
              surfaceArea={listing.surface_area_m2}
              roomCount={listing.room_count}
              bedroomCount={listing.bedroom_count}
              bathroomCount={listing.bathroom_count}
            />
          </section>

          <section className="space-y-8">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-900">Description</h2>
            {listing.description ? (
              <p className="text-xl font-light leading-relaxed text-gray-600 whitespace-pre-line max-w-2xl italic">
                {listing.description}
              </p>
            ) : (
              <p className="italic text-gray-300 uppercase text-[10px] tracking-widest">Aucune description disponible.</p>
            )}
          </section>

          <section className="pt-20 border-t border-gray-100">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-900 mb-12">Performance Énergétique</h2>
            <div className="bg-gray-50/30 p-12 border border-gray-50">
                <EnergyPerformance
                  energyClass={getEnergyClass(listing.energy_consumption ?? null)}
                  ghgClass={getGhgClass(listing.ghg_emissions ?? null)}
                  energyValue={listing.energy_consumption ?? null}
                  ghgValue={listing.ghg_emissions ?? null}
                  annualCostMin={listing.annual_energy_cost_min ?? null}
                  annualCostMax={listing.annual_energy_cost_max ?? null}
                  diagnosticDate={listing.diagnostic_date ?? null}
                />
            </div>
          </section>
        </div>

        <aside>
          <div className="lg:sticky lg:top-12 space-y-12">
            <div className="border border-gray-100 p-12 bg-white transition-all hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-900 mb-10 border-b border-gray-50 pb-6 text-center">
                Contact & Rappel
              </h3>
              <CallbackForm
                listingId={listing.id}
                listingTitle={listing.title}
                transactionType={listing.transaction_type}
                price={listing.price}
                city={listing.city}
              />
            </div>

            <div className="border border-gray-100 p-12 bg-gray-50/20">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-10 text-center">
                Interlocuteur
              </h3>
              <ProfessionalCard professional={listing.professional} />
            </div>

            <div className="px-6 text-center">
              <p className="text-[9px] text-gray-300 uppercase tracking-[0.5em] leading-loose font-bold">
                UnBienImmo Solutions <br/>
                Diffusion Professionnelle
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}