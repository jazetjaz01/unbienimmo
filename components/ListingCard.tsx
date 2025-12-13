// components/ListingCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface ListingCardProps {
  listing: {
    id: number;
    title: string;
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
  
  return (
    <Link 
      href={`/listings/${listing.id}`} 
      className="group block cursor-pointer"
    >
      {/* 1. Conteneur d'image avec Aspect Ratio (4/3 donne un "presque carré") */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl mb-2">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          style={{ objectFit: 'cover' }}
         
          className="transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          // L'image peut ne pas s'afficher si next.config.js n'autorise pas le domaine Supabase
        />
      </div>

      {/* 2. Détails de l'Annonce */}
      <div className="p-1 text-sm">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
          {listing.title}
        </h3>
        
        <p className="text-gray-700 dark:text-gray-300 mt-1 font-bold">
          {formattedPrice} <span className="font-normal">/ nuit</span>
        </p>
      </div>
    </Link>
  );
}