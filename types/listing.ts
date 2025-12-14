// types/listing.ts
export interface Listing {
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
  // Assurez-vous d'avoir une colonne 'image_url' ou 'images' dans votre base de données
  imageUrl: string // Utilisation de `imageUrl` pour correspondre à votre `ListingCard`
}