import { Ruler, Home, Bed, Bath, Scan, Sofa, SquaresUniteIcon } from "lucide-react";

interface ListingFeaturesProps {
  surfaceArea?: number | null;
  roomCount?: number | null;
  bedroomCount?: number | null;
  bathroomCount?: number | null;
}

export default function ListingFeatures({
  surfaceArea,
  roomCount,
  bedroomCount,
  bathroomCount,
}: ListingFeaturesProps) {
  const features = [
    surfaceArea !== null && surfaceArea !== undefined && {
      icon: SquaresUniteIcon,
      label: `${surfaceArea} m²`,
    },
    roomCount !== null && roomCount !== undefined && {
      icon: Sofa,
      label: `${roomCount} pièces`,
    },
    bedroomCount !== null && bedroomCount !== undefined && {
      icon: Bed,
      label: `${bedroomCount} chambres`,
    },
    bathroomCount !== null && bathroomCount !== undefined && {
      icon: Bath,
      label: `${bathroomCount} salle(s) de bain`,
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    label: string;
  }[];

  // Si aucune donnée → on n'affiche rien
  if (features.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-700">
      {features.map(({ icon: Icon, label }, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1"
        >
          <Icon size={18} className="" />
          <span className="font-semibold">{label}</span>
        </div>
      ))}
    </div>
  );
}
