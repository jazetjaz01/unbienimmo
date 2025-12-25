import Link from 'next/link'
import Image from 'next/image'

interface ListingCardProps {
  listing: {
    id: number
    title: string
    property_type: string
    zip_code: string
    city: string
    room_count: number | null
    surface_area_m2: number | null
    exclusivite_agence: boolean
    created_at: string
    price: number
    imageUrl?: string 
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(listing.price)

  const isNew = (() => {
    const created = new Date(listing.created_at).getTime()
    const now = Date.now()
    const days = (now - created) / (1000 * 60 * 60 * 24)
    return days <= 7
  })()

  const imageSrc = listing.imageUrl && listing.imageUrl.trim() !== ''
    ? listing.imageUrl
    : '/placeholder-image.jpg'

  return (
    <Link href={`/listings/${listing.id}`} className="group block w-full transition-opacity hover:opacity-95">
      {/* CONTENEUR GLOBAL RÉDUIT : Passé à 85% pour un effet très compact */}
      <div className="mx-auto w-[85%]">
        
        {/* IMAGE CARRÉE RÉDUITE */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          
          {/* BADGES : Masqués sur mobile (hidden), visibles sur sm (tablette/desktop) */}
          <div className="absolute top-2 left-2 hidden sm:flex flex-col gap-1 z-10">
            {listing.exclusivite_agence && (
              <span className="bg-white/95 backdrop-blur-md text-gray-900 text-[6.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm border border-gray-100">
                Exclusivité
              </span>
            )}
            {isNew && (
              <span className="bg-teal-600/90 backdrop-blur-md text-white text-[6.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                Nouveau
              </span>
            )}
          </div>

          <Image
            src={imageSrc}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* INFOS COMPACTES ALIGNÉES SUR L'IMAGE */}
        <div className="mt-2">
          <div className="flex justify-between items-baseline gap-2">
            <h3 className="text-[13px] font-semibold text-gray-900 truncate tracking-tight">
              {listing.city} <span className="font-normal text-gray-400 text-[11px] ml-1">{listing.zip_code}</span>
            </h3>
            <span className="text-[13px] font-bold text-gray-900 whitespace-nowrap">
              {formattedPrice}
            </span>
          </div>
          
          <p className="text-[12px] text-gray-500 font-normal leading-tight mt-0.5 truncate italic">
            {[
              listing.property_type,
              listing.surface_area_m2 ? `${listing.surface_area_m2} m²` : null,
              listing.room_count ? `${listing.room_count} p.` : null
            ].filter(Boolean).join(' • ')}
          </p>
        </div>
      </div>
    </Link>
  )
}