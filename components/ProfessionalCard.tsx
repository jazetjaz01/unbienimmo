import Image from "next/image";
import { Globe, Phone, BadgeCheck, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator"
interface Professional {
  name?: string;
  type?: string;
  street_address?: string | null;
  city?: string | null;
  zip_code?: string | null;
  logo_url?: string | null;
  phone?: string | null;
  website?: string | null;
  is_verified?: boolean;
}

interface ProfessionalCardProps {
  professional?: Professional | null;
}

export default function ProfessionalCard({ professional }: ProfessionalCardProps) {
  if (!professional) return null;

  return (
    <div className="mt-6 ">
      {/* Ligne principale */}
      <div className="flex gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          {professional.logo_url ? (
            <Image
              src={professional.logo_url}
              alt={professional.name || "Logo"}
              width={56}
              height={56}
              className="h-14 w-14 rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-base font-semibold">
              {professional.name?.charAt(0) ?? "?"}
            </div>
          )}
        </div>

        {/* Bloc texte aligné sous le nom */}
        <div className="flex flex-col gap-1 min-w-0">
          {/* Nom */}
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold truncate">
              {professional.name}
            </h3>
            {professional.is_verified && (
              <BadgeCheck size={16} className="text-teal-600" />
            )}

                <Separator orientation="vertical" />
            {professional.type && (
              <span className="text-base">
                {professional.type}
              </span>
            )}

          </div>

          {/* Adresse */}
          {(professional.street_address ||
            professional.city ||
            professional.zip_code) && (
            <p className="text-base truncate">
              {professional.street_address && (
                <span>{professional.street_address}, </span>
              )}
              {professional.zip_code} {professional.city}
            </p>
          )}

          {/* Ligne 2 : type + tel + site */}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            

            {professional.phone && (
              <span className="flex items-center gap-1 text-base">
                <Phone size={14} />
                {professional.phone}
              </span>
            )}

            {professional.website && (
              <a
                href={professional.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium text-teal-600 hover:underline text-base"
              >
                <ExternalLink size={14} />
                Voir le site 
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
