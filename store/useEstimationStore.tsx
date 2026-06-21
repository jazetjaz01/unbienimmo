import { create } from 'zustand';

// 1. Structure de données complète (incluant l'étape 6 "Ce bien et vous")
interface EstimationData {
  // Étape 1 : Localisation
  address: string;
  city: string;
  postcode: string;
  lat: number | null; 
  lon: number | null; 
  
  // Étape 2 : Type
  propertyType: 'maison' | 'appartement' | 'duplex' | 'triplex' | 'loft' | 'hotel_particulier' | null;
  
  // Étape 3 : Détails techniques
  surface: number | string;
  landSurface: number | string;
  rooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  
  // Étape 4 : Caractéristiques & Équipements
  hasElevator: boolean;
  hasBalcony: boolean;
  balconySurface: number | string;
  hasTerrace: boolean;
  terraceSurface: number | string;
  hasCellar: boolean;
  cellarCount: number;
  hasParking: boolean;
  parkingCount: number;
  hasServiceRoom: boolean;
  serviceRoomCount: number;
  hasGreatView: boolean;
  renovatedCommonAreas: boolean;
  recentFacading: boolean;
  
  // Étape 5 : Précisions (État, Période, Qualité)
  constructionPeriod: string;
  propertyState: 'refurbished' | 'standard' | 'refreshment' | 'renovation' | string;
  propertyQuality: 'inferior' | 'comparable' | 'superior';
  
  // Étape 6 : Ce bien et vous (NOUVEAU)
  userType: 'particulier' | 'professionnel';
  isOwner: boolean;
  propertyUsage: 'principale' | 'secondaire' | 'autre';
  saleIntent: 'des_que_possible' | 'vente_commencee' | 'sous_3_mois' | 'sous_6_mois' | 'pas_de_projet' | 'vient_de_vendre';
  priorityContact: boolean;
  phoneNumber: string; // Aligné avec le schéma Zod

  // Étape FINAL : Coordonnées finales (si nécessaire par la suite)
  fullName: string;
  email: string;
}

interface EstimationStore {
  data: Partial<EstimationData>;
  setStepData: (stepData: Partial<EstimationData>) => void;
  reset: () => void;
}

const initialData: Partial<EstimationData> = {
  lat: null,
  lon: null,
  address: "",
  city: "",
  postcode: "",
  propertyType: null,
  surface: "",
  landSurface: "",
  rooms: 1,
  bathrooms: 1,
  floor: 0,
  totalFloors: 1,
  
  // Étape 4
  hasElevator: false,
  hasBalcony: false,
  balconySurface: "",
  hasTerrace: false,
  terraceSurface: "",
  hasCellar: false,
  cellarCount: 0,
  hasParking: false,
  parkingCount: 0,
  hasServiceRoom: false,
  serviceRoomCount: 0,
  hasGreatView: false,
  renovatedCommonAreas: false,
  recentFacading: false,
  
  // Étape 5 : Initialisation Précisions
  constructionPeriod: "",
  propertyState: "standard",
  propertyQuality: "comparable",
  
  // Étape 6 : Initialisation "Ce bien et vous" (NOUVEAU)
  userType: "particulier",
  isOwner: true,
  propertyUsage: undefined, // undefined pour forcer le choix "-- Choisir --" au départ
  saleIntent: undefined,    // idem
  priorityContact: false,
  phoneNumber: "",
  
  // Étape FINALE
  fullName: "",
  email: "",
};

export const useEstimationStore = create<EstimationStore>((set) => ({
  data: initialData,

  setStepData: (stepData) => 
    set((state) => ({
      data: { ...state.data, ...stepData }
    })),

  reset: () => set({ data: initialData }),
}));