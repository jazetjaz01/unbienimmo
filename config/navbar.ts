import {
  Backpack,
  CakeSlice,
  Coffee,
  Grape,
  Hotel,
  IceCream,
  MapPin,
  Package,
  Pizza,
  Plane,
  Sandwich,
  Smile,House,
  Building2,
  SquareRoundCorner,
  BriefcaseBusiness,
  Building,
} from "lucide-react";

export const foods = [
  {
    title: "Estimer maison",
    icon: House,
    href: "/estimation-immobiliere", // Ajout du lien
    description: "Estimation de votre maison",
  },
  {
    title: "Estimer appartement",
    icon: Building2,
    href: "/estimation-immobiliere", // Ajout du lien
    description: "Estimation de votre appartement.",
  },
  {
    title: "Estimer terrain",
    icon: SquareRoundCorner,
    href: "/estimation-immobiliere", // Ajout du lien
    description: "Estimation de votre terrain",
  },
  {
    title: "Estimer bureaux",
    icon: BriefcaseBusiness,
    href: "/estimation-immobiliere", // Ajout du lien
    description: "Estimation de vos bureaux",
  },
  {
    title: "Locaux commerciaux",
    icon: Building2,
    href: "/estimation-immobiliere", // Ajout du lien
    description: "Estimation locaux commerciaux",
  },
  {
    title: "Fond de commerce",
    icon: Building,
    href: "/estimation-immobiliere", // Ajout du lien
    description: "Estimation fond de commerce",
  },
];

export const travelMenuItems = [
  {
    title: "Historique ventes maisons",
    icon: MapPin,
    href: "/historique-ventes", 
    description: "Toutes les ventes des 10 dernières années géolocalisées",
  },
  {
    title: "Historique ventes appartements",
    icon: MapPin,
    href: "/historique-ventes", 
    description: "Toutes les ventes des 10 dernières années géolocalisées",
  },
  {
    title: "Historique ventes terrains",
    icon: MapPin,
    href: "/historique-ventes", 
   description: "Toutes les ventes des 10 dernières années géolocalisées",
  },
  {
    title: "Historique ventes locaux",
    icon: MapPin,
    href: "/historique-ventes", 
   description: "Toutes les ventes des 10 dernières années géolocalisées",
  },
  {
    title: "Estimation personalisée",
    icon: Smile,
    href: "/estimation-immobiliere", // Ajout du lien
    description: "Estimation personalisée.",
  },
  
];
