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
    minimumFractionDigits: 0,
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
    <Link href={`/listings/${listing.id}`} className="group block cursor-pointer bg-white">
      {/* CONTENEUR IMAGE - Suppression des arrondis pour le style Flat */}
      <div className="relative w-full aspect-[3/3] overflow-hidden bg-gray-100 rounded-md">
        
        {/* LABELS MINIMALISTES */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10">
          <div className="flex flex-col gap-2">
            {listing.exclusivite_agence && (
              <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1 border border-gray-100">
                Exclusivité
              </span>
            )}
            {isNew && (
              <span className="bg-gray-900 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1">
                Nouveau
              </span>
            )}
          </div>
        </div>

        <Image
          src={imageSrc}
          alt={listing.title || 'Annonce'}
          fill
          className="transition-transform duration-700 ease-out group-hover:scale-110 object-cover grayscale-[0.1] group-hover:grayscale-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* OVERLAY AU SURVOL */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* DÉTAILS - Utilisation de l'espacement Outfit */}
      <div className="py-6 px-1">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
              {listing.property_type}
            </h3>
            <p className="text-lg font-light tracking-tight text-gray-900 italic">
              {listing.city} <span className="text-gray-300 not-italic ml-1">{listing.zip_code}</span>
            </p>
          </div>
          <p className="text-lg font-medium tracking-tighter text-gray-900">
            {formattedPrice}
          </p>
        </div>

        {/* CARACTÉRISTIQUES TECHNIQUES EN BAS */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex gap-6">
          {listing.room_count && (
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Pièces</span>
              <span className="text-xs font-medium text-gray-700">{listing.room_count}</span>
            </div>
          )}
          {listing.surface_area_m2 && (
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Surface</span>
              <span className="text-xs font-medium text-gray-700">{listing.surface_area_m2} m²</span>
            </div>
          )}
          <div className="flex flex-col ml-auto">
             <span className="text-[10px] text-gray-900 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 font-bold uppercase tracking-widest">
               Voir le bien →
             </span>
          </div>
        </div>
      </div>
    </Link>
  )
}