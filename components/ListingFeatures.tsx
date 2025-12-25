"use client"; // Optionnel, mais conseillé si vous utilisez des interactions Framer Motion plus tard

import React from "react";
import { 
  Bed, 
  Bath, 
  Sofa, 
  Square, 
  Car, 
  ParkingSquare,
ArrowDownUp,
  Waves, 
  Trees,  
  ArrowUpDown, 
  Wind, 
  ShieldCheck, 
  Warehouse, 
  Thermometer,
  Zap,
  Fence , 
  CopyMinus,
  
  Compass,
  WindArrowDown
} from "lucide-react";

/**
 * Mappage des slugs d'icônes stockés en BDD vers les composants Lucide réels.
 * Assurez-vous que les valeurs dans la colonne 'icon' de votre table 'features'
 * correspondent aux clés ci-dessous (ex: 'pool', 'garage').
 */
const ICON_MAP: Record<string, React.ElementType> = {
  bed: Bed,
  bath: Bath,
  sofa: Sofa,
  surface: Square,
  garage: ParkingSquare,
  pool: Waves,
  garden: Trees,
  elevator: ArrowUpDown,
  security: ShieldCheck,
  cellar: Warehouse,
  heating: Thermometer,
  ac: Wind,
  terrace: Fence,
  electricity: Zap,
  glass: CopyMinus,
  sun:Compass,
  sunrise:Compass,
  sunset:Compass,
  cloud:Compass,
  columns:ArrowDownUp
};

interface DynamicFeature {
  name: string;
  icon?: string | null;
}

interface ListingFeaturesProps {
  surfaceArea?: number | null;
  roomCount?: number | null;
  bedroomCount?: number | null;
  bathroomCount?: number | null;
  dynamicFeatures?: DynamicFeature[]; 
}

export default function ListingFeatures({
  surfaceArea,
  roomCount,
  bedroomCount,
  bathroomCount,
  dynamicFeatures = [],
}: ListingFeaturesProps) {
  
  // Construction sécurisée de la liste d'affichage
  const featuresList: { icon: React.ElementType; label: string }[] = [];

  /**
   * 1. AJOUT DES DONNÉES STRUCTURELLES (Table listings)
   * On vérifie systématiquement que le composant icône existe pour éviter l'erreur "undefined"
   */
  if (surfaceArea && Square) {
    featuresList.push({ icon: Square, label: `${surfaceArea} m²` });
  }
  if (roomCount && Sofa) {
    featuresList.push({ icon: Sofa, label: `${roomCount} pièces` });
  }
  if (bedroomCount && Bed) {
    featuresList.push({ icon: Bed, label: `${bedroomCount} chambres` });
  }
  if (bathroomCount && Bath) {
    featuresList.push({ icon: Bath, label: `${bathroomCount} sdb` });
  }

  /**
   * 2. AJOUT DES DONNÉES DYNAMIQUES (Jointure features)
   */
  dynamicFeatures.forEach((feat) => {
    // On cherche l'icône dans la map, sinon on utilise Square par défaut
    // On valide que c'est bien une fonction ou un objet (composant React valide)
    const IconComponent = (feat.icon && ICON_MAP[feat.icon]) ? ICON_MAP[feat.icon] : Square;
    
    if (IconComponent && typeof IconComponent !== 'undefined' && feat.name) {
      // Éviter les doublons de labels (ex: si '3 pièces' est déjà ajouté via roomCount)
      const isDuplicate = featuresList.some(
        f => f.label.toLowerCase().trim() === feat.name.toLowerCase().trim()
      );
      
      if (!isDuplicate) {
        featuresList.push({
          icon: IconComponent, 
          label: feat.name,
        });
      }
    }
  });

  // Si rien à afficher, on ne rend rien pour ne pas casser le layout
  if (featuresList.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-10">
      {featuresList.map(({ icon: Icon, label }, index) => {
        // Ultime sécurité : si l'icône est quand même manquante, on passe l'élément
        if (typeof Icon === 'undefined' || Icon === null) return null;

        return (
          <div key={`${label}-${index}`} className="flex items-center gap-4 group">
            {/* Conteneur d'icône minimaliste */}
            <div className="flex-shrink-0 p-2.5 rounded-full bg-gray-50 border border-gray-100 group-hover:bg-gray-900 group-hover:border-gray-900 transition-all duration-300">
              <Icon 
                size={15} 
                strokeWidth={1.5} 
                className="text-gray-900 group-hover:text-white transition-colors duration-300" 
              />
            </div>
            
            {/* Label en majuscules aérées */}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-900 transition-colors">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}