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
    created_at: string // ✅ AJOUT
    price: number
    imageUrl: string
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

  // ✅ LOGIQUE "NOUVEAU" (≤ 7 jours)
  const isNew = (() => {
    const createdAt = new Date(listing.created_at)
    const now = new Date()
    const diffInDays =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    return diffInDays <= 7
  })()

  return (
    <Link href={`/listings/${listing.id}`} className="group block cursor-pointer">
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl mb-2">

        {/* ✅ BADGES (Airbnb-like) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">

          {listing.exclusivite_agence && (
            <span className="
              bg-gray-100
              text-gray-900
              text-xs
              font-semibold
              px-3
              py-1
              rounded-full
              shadow-sm
            ">
              Exclusivité
            </span>
          )}

          {isNew && (
            <span className="
              bg-teal-500
              text-white
              text-xs
              font-semibold
              px-3
              py-1
              rounded-full
              shadow-sm
            ">
              Nouveau
            </span>
          )}

        </div>

        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="transition-transform duration-300 group-hover:scale-105 object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </div>

      {/* DÉTAILS */}
      <div className="p-1 text-sm">
        <h3 className="font-normal text-gray-600 truncate">
          {listing.property_type}

          {roomLabel && <> • {roomLabel}</>}
          {surfaceLabel && <> • {surfaceLabel}</>}
        </h3>

        <div className="flex gap-2">
          <p className="text-gray-700 mt-1">{listing.zip_code}</p>
          <p className="text-gray-700 mt-1">{listing.city}</p>
        </div>

        <p className="text-teal-700 mt-1 font-bold">
          {formattedPrice}
        </p>
      </div>
    </Link>
  )
}
