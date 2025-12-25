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
  id: number;
  name: string;
  type: string;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  street_address: string | null;
  zip_code: string | null;
  city: string | null;
  is_verified: boolean;
  email: string | null;
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
  energy_reference_year?: string | null;
  // Ajout du type pour les features jointes
  listing_features?: {
    feature: {
      name: string;
      icon: string | null;
    }
  }[];
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

  // REQUÊTE ADAPTÉE : On inclut listing_features et la table features associée
  const { data: listing } = await supabasePublic
    .from("listings")
    .select(`
      *,
      listing_images (image_url, sort_order),
      professional:professionals (
        id, name, type, phone, website, logo_url, street_address, zip_code, city, is_verified
      ),
      listing_features (
        feature:features (
          name,
          icon
        )
      )
    `)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle<Listing>();

  if (!listing) notFound();

  // MAPPAGE DES FEATURES DYNAMIQUES
  const dynamicFeatures = listing.listing_features?.map((lf) => ({
    name: lf.feature.name,
    icon: lf.feature.icon
  })) || [];

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
    <main className="min-h-screen bg-white selection:bg-gray-900 selection:text-white">
      <div className="w-full bg-gray-50 border-b border-gray-100">
        <Gallery sections={sections} />
      </div>

      <div className="mx-auto px-6 md:px-12 lg:px-20 max-w-[1440px] grid grid-cols-1 lg:grid-cols-[1.7fr_1.3fr] gap-24 mt-10 pb-10">
        
        <div className="space-y-32">
          
          <header className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[9px] tracking-[0.5em] uppercase font-black bg-orange-500 text-white px-3 py-1.5">
                  {listing.transaction_type === 'vendre' ? 'Vente' : 'Location'}
                </span>
                <div className="h-[1px] w-16 bg-gray-100" />
                <span className="text-[9px] tracking-[0.5em] uppercase font-bold text-gray-400">
                  {listing.property_type}
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <h1 className="text-7xl md:text-7xl font-light tracking-tighter text-gray-900 italic leading-[0.85]">
                  {listing.city}
                </h1>
                <div className="text-5xl font-light tracking-tighter text-gray-900 italic md:border-l md:border-gray-100 md:pl-10">
                  {formattedPrice}
                </div>
              </div>
            </div>

            {/* SECTION CARACTÉRISTIQUES - Avec dynamicFeatures injecté */}
            <section className="space-y-16">
              <h2 className="text-[10px] uppercase tracking-[0.6em] font-black text-gray-300">
                Fiche Technique
              </h2>
              <div className="px-2">
                <ListingFeatures
                  surfaceArea={listing.surface_area_m2}
                  roomCount={listing.room_count}
                  bedroomCount={listing.bedroom_count}
                  bathroomCount={listing.bathroom_count}
                  dynamicFeatures={dynamicFeatures}
                />
              </div>
            </section>

            <section className="space-y-12">
               <h2 className="text-[10px] uppercase tracking-[0.6em] font-black text-gray-300">
                Description de l'expert
              </h2>
              <div className="max-w-3xl">
                {listing.description ? (
                  <p className="text-2xl font-light leading-[1.7] text-gray-700 whitespace-pre-line italic opacity-90">
                    {listing.description}
                  </p>
                ) : (
                  <p className="italic text-gray-300 uppercase text-[10px] tracking-widest font-bold">Le descriptif détaillé est en cours de validation.</p>
                )}
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-x-16 gap-y-6 py-10 border-y border-gray-50">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-300" />
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500">
                  {listing.zip_code}, France
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-gray-300" />
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">Réf. {listing.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-300" />
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 italic">Dernière mise à jour : {formatDateFR(listing.updated_at)}</span>
              </div>
            </div>
          </header>

          <section className="bg-slate-50 p-12 md:p-20">
            <EnergyPerformance
              energyClass={getEnergyClass(listing.energy_consumption ?? null)}
              ghgClass={getGhgClass(listing.ghg_emissions ?? null)}
              energyValue={listing.energy_consumption ?? null}
              ghgValue={listing.ghg_emissions ?? null}
              annualCostMin={listing.annual_energy_cost_min ?? null}
              annualCostMax={listing.annual_energy_cost_max ?? null}
              diagnosticDate={listing.diagnostic_date ?? null}
              energy_reference_year={listing.energy_reference_year ?? null}
            />
          </section>
        </div>

        <aside>
          <div className="lg:sticky lg:top-12 space-y-10">
            <div className="bg-white p-12 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-gray-300 rounded-sm">
              <div className="text-center mb-12">
                <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-900 mb-3">Nous Contacter</h3>
                <div className="h-[2px] w-8 bg-gray-900 mx-auto" />
              </div>
              <CallbackForm
                listingId={listing.id}
                listingTitle={listing.title}
                transactionType={listing.transaction_type}
                price={listing.price}
                city={listing.city}
              />
            </div>

           <div className="lg:sticky lg:top-12 space-y-10">
            <div className="bg-white p-12 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-gray-300 rounded-sm">
              
              <ProfessionalCard professional={listing.professional} />
            </div>

            <div className="px-6 text-center">
              <p className="text-[9px] text-gray-300 uppercase tracking-[0.5em] leading-loose font-bold italic">
                UnBienImmo Solutions <br/>
                <span className="opacity-40">Diffusion pour professionnels de l'immobilier</span>
              </p>
            </div>
          </div>
          </div>
        </aside>

      </div>
    </main>
  );
}