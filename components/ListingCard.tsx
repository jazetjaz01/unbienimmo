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
    imageUrl?: string // ⚠ rendre optionnel
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(listing.price)

  const roomLabel =
    typeof listing.room_count === 'number'
      ? listing.room_count === 1
        ? '1 pièce'
        : `${listing.room_count} pièces`
      : null

  const surfaceLabel =
    typeof listing.surface_area_m2 === 'number'
      ? `${listing.surface_area_m2} m²`
      : null

  const isNew = (() => {
    const created = new Date(listing.created_at).getTime()
    const now = Date.now()
    const days = (now - created) / (1000 * 60 * 60 * 24)
    return days <= 7
  })()

  // ✅ si imageUrl vide, utiliser un placeholder
  const imageSrc = listing.imageUrl && listing.imageUrl.trim() !== ''
    ? listing.imageUrl
    : '/placeholder-image.jpg'

  return (
    <Link href={`/listings/${listing.id}`} className="group block cursor-pointer">
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl mb-2">
        {listing.exclusivite_agence && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gray-100 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Exclusivité
            </span>
          </div>
        )}
        {isNew && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Nouveau
            </span>
          </div>
        )}

        <Image
          src={imageSrc}
          alt={listing.title || 'Annonce'}
          fill
          className="transition-transform duration-300 group-hover:scale-105 object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </div>

      {/* DÉTAILS */}
      <div className="p-1 text-sm">
        <h3 className="text-gray-600 truncate">
          {listing.property_type}
          {roomLabel && ` • ${roomLabel}`}
          {surfaceLabel && ` • ${surfaceLabel}`}
        </h3>

        <div className="flex gap-2 text-gray-700 mt-1">
          <span>{listing.zip_code}</span>
          <span>{listing.city}</span>
        </div>

        <p className="text-teal-700 mt-1 font-bold">
          {formattedPrice}
        </p>
      </div>
    </Link>
  )
}
