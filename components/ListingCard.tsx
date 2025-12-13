import Link from 'next/link';
import Image from 'next/image';

interface ListingCardProps {
  listing: {
    id: number;
    title: string;
    property_type: string;
    zip_code: string;
    city:string;
    room_count: number | null;
    surface_area_m2: number | null;
    price: number;
    imageUrl: string;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(listing.price);

  const roomLabel =
    typeof listing.room_count === 'number'
      ? listing.room_count === 1
        ? '1 pièce'
        : `${listing.room_count} pièces`
      : null;

  const surfaceLabel =
    typeof listing.surface_area_m2 === 'number'
      ? `${listing.surface_area_m2} m²`
      : null;

  return (
    <Link href={`/listings/${listing.id}`} className="group block cursor-pointer">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl mb-2">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </div>

      {/* Détails */}
      <div className="p-1 text-sm">
        <h3 className=" font-normal text-gray-600 dark:text-gray-400 truncate">
          {listing.property_type}

          {roomLabel && (
            <span className="font-normal text-gray-600 dark:text-gray-400">
              {' '}• {roomLabel}
            </span>
          )}

          {surfaceLabel && (
            <span className="font-normal text-gray-600 dark:text-gray-400">
              {' '}• {surfaceLabel}
            </span>
          )}
        </h3>
        <div className='flex gap-2'>
        <p className="text-gray-700 dark:text-gray-300 mt-1 font-bold">
          <span className="font-normal">{listing.zip_code}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-1 font-bold">
          <span className="font-normal">{listing.city}</span>
        </p>
        
            </div>
        <p className="text-teal-700 dark:text-gray-300 mt-1 font-bold">
          {formattedPrice} <span className="font-normal"></span>
        </p>
      </div>
    </Link>
  );
}
