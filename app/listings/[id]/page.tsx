// ⚠️ Next 16 + Turbopack
export const dynamic = 'force-dynamic'

import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabasePublic } from '@/lib/supabase/supabase-public'
import { getFullPublicUrl } from '@/lib/supabase/storage'

interface ListingImage {
  image_url: string
  sort_order: number
}

interface Listing {
  id: number
  title: string
  description: string | null
  property_type: string
  room_count: number | null
  surface_area_m2: number | null
  zip_code: string
  city: string
  price: number
  exclusivite_agence: boolean
  created_at: string
  listing_images: ListingImage[]
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // ✅ OBLIGATOIRE en Next 15+
  const { id } = await params

  const { data: listing } = await supabasePublic
    .from('listings')
    .select(`
      id,
      title,
      description,
      property_type,
      room_count,
      surface_area_m2,
      zip_code,
      city,
      price,
      exclusivite_agence,
      created_at,
      listing_images (image_url, sort_order)
    `)
    .eq('id', id)
    .single<Listing>()

  if (!listing) notFound()

  const images =
    listing.listing_images
      ?.sort((a, b) => a.sort_order - b.sort_order)
      .map(img => getFullPublicUrl(img.image_url)) || []

  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(listing.price)

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16 xl:px-24 py-8">

        {/* TITRE */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">{listing.title}</h1>
          <p className="text-gray-600 mt-1">
            {listing.zip_code} {listing.city}
          </p>
        </header>

        {/* GALERIE */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-10 rounded-xl overflow-hidden">
          {images.slice(0, 5).map((src, index) => (
            <div
              key={index}
              className={`relative aspect-[4/3] ${
                index === 0 ? 'md:row-span-2' : ''
              }`}
            >
              <Image
                src={src}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}
        </section>

        {/* CONTENU */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* GAUCHE */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              {listing.property_type}
              {listing.room_count && ` • ${listing.room_count} pièces`}
              {listing.surface_area_m2 && ` • ${listing.surface_area_m2} m²`}
            </h2>

            <div className="prose max-w-none text-gray-700">
              {listing.description || 'Aucune description fournie.'}
            </div>
          </div>

          {/* DROITE */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 border rounded-xl p-6 shadow-sm">
              <p className="text-2xl font-semibold text-teal-700">
                {formattedPrice}
              </p>

              <button className="w-full mt-6 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition">
                Contacter l’agence
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
