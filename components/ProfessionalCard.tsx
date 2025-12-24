import Image from "next/image";
import { Globe, Phone, BadgeCheck, ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getFullPublicUrl } from "@/lib/supabase/storage";
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
    <div className="group">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* LOGO - Format carré rigoureux */}
        <div className="flex-shrink-0">
          {professional.logo_url ? (
            <div className="relative h-20 w-20 bg-white border border-gray-100 p-2 overflow-hidden">
              <Image
                src={professional.logo_url}
                alt={professional.name || "Logo"}
                fill
                className="object-contain p-1 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center bg-gray-900 text-white text-xl font-light italic">
              {professional.name?.charAt(0) ?? "P"}
            </div>
          )}
        </div>

        {/* CONTENU TEXTUEL */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* HEADER : Nom + Badge */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-900">
              {professional.name}
            </h3>
            {professional.is_verified && (
              <BadgeCheck size={14} className="text-gray-900" />
            )}
          </div>

          {/* TYPE & ADRESSE */}
          <div className="space-y-1 mb-6">
            <p className="text-2xl font-light tracking-tighter text-gray-900 italic leading-none">
              {professional.type || "Conseiller Immobilier"}
            </p>
            {(professional.street_address || professional.city) && (
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                {professional.street_address && <span>{professional.street_address}, </span>}
                {professional.zip_code} {professional.city}
              </p>
            )}
          </div>

          <Separator className="bg-gray-50 mb-6" />

          {/* ACTIONS / CONTACT */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {professional.phone && (
              <div className="flex items-center gap-3 group/phone">
                <div className="h-8 w-8 rounded-none border border-gray-100 flex items-center justify-center group-hover/phone:border-gray-900 transition-colors">
                  <Phone size={12} className="text-gray-400 group-hover/phone:text-gray-900" />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-gray-900">
                  {professional.phone}
                </span>
              </div>
            )}

            {professional.website && (
              <a
                href={professional.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group/link"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 group-hover/link:text-gray-900 transition-colors">
                  Accéder au site
                </span>
                <ArrowUpRight size={14} className="text-gray-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}