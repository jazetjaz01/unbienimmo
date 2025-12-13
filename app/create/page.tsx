'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AddressAutocomplete from '@/components/AddressAutocomplete'

export default function CreateListingPage() {
  const supabase = createClient()
  const router = useRouter()
  
  // --- CARACTÉRISTIQUES DU BIEN ---
  const [propertyType, setPropertyType] = useState('')
  const [transactionType, setTransactionType] = useState('')
  const [surfaceArea, setSurfaceArea] = useState('') // m²
  const [roomCount, setRoomCount] = useState('')     // nombre de pièces
  const [exclusiviteAgence, setExclusiviteAgence] = useState(false) // ✅ exclusivité agence
  
  // --- INFOS GÉNÉRALES ---
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  
  // --- LOCALISATION ---
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null) 
  const [city, setCity] = useState<string | null>(null)
  const [zipCode, setZipCode] = useState<string | null>(null)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  
  // --- UI ---
  const [loading, setLoading] = useState(false) 
  const [isGeocoding, setIsGeocoding] = useState(false) 

  // --- Adresse sélectionnée depuis AddressAutocomplete ---
  const handleAddressSelect = (
    address: string,
    lat: number,
    lng: number,
    detectedCity: string,
    detectedZip: string | null
  ) => {
    setSelectedAddress(address)
    setLatitude(lat)
    setLongitude(lng)
    setCity(detectedCity)
    setZipCode(detectedZip)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // --- VALIDATIONS ---
    if (!selectedAddress || latitude === null || longitude === null || !city) {
      alert("Veuillez sélectionner une adresse valide.")
      setLoading(false)
      return
    }

    if (!propertyType || !transactionType || !surfaceArea || !roomCount) {
      alert("Veuillez remplir toutes les caractéristiques du bien.")
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("Vous devez être connecté.")
      router.push('/login')
      setLoading(false)
      return
    }

    // --- INSERT LISTING ---
    const { data: listingData, error: listingError } = await supabase
      .from('listings')
      .insert([
        {
          owner_id: user.id,
          title,
          price: parseFloat(price),
          description: `Annonce localisée à : ${selectedAddress}`,
          latitude,
          longitude,
          property_type: propertyType,
          transaction_type: transactionType,
          surface_area_m2: parseFloat(surfaceArea),
          room_count: parseInt(roomCount, 10),
          city,
          street_address: selectedAddress,
          zip_code: zipCode,            // ✅ automatiquement depuis AddressAutocomplete
          exclusivite_agence: exclusiviteAgence, // ✅ exclusivité agence
          is_published: false,
        },
      ])
      .select('id')
      .single()

    if (listingError || !listingData) {
      console.error(listingError)
      alert("Erreur lors de la création de l'annonce.")
      setLoading(false)
      return
    }

    // --- REDIRECTION VERS UPLOAD IMAGES ---
    router.push(`/create/${listingData.id}/images`)
    setLoading(false)
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle annonce</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* LOCALISATION */}
        <label className="block text-lg font-medium">Localisation</label>
        <AddressAutocomplete
          onAddressSelect={handleAddressSelect}
          onLoadingChange={setIsGeocoding}
        />

        {isGeocoding && (
          <p className="text-blue-500 text-sm">Recherche d’adresse en cours...</p>
        )}

        {selectedAddress && city && (
          <p className="text-green-600 text-sm">
            Adresse sélectionnée : <strong>{selectedAddress}</strong> à <strong>{city}</strong>
            {zipCode && ` • ${zipCode}`}
          </p>
        )}

        {/* CARACTÉRISTIQUES */}
        <label className="block text-lg font-medium mt-6">Caractéristiques du bien</label>

        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Type de bien --</option>
          <option value="Maison">Maison</option>
          <option value="Appartement">Appartement</option>
          <option value="T1">T1</option>
          <option value="T2">T2</option>
          <option value="Chalet">Chalet</option>
          <option value="Chateau">Château</option>
          <option value="Hangar">Hangar</option>
          <option value="Terrain">Terrain</option>
          <option value="Autre">Autre</option>
        </select>

        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Type de transaction --</option>
          <option value="Vente">Vente</option>
          <option value="Location">Location</option>
          <option value="Viager">Viager</option>
        </select>

        <input
          type="number"
          min="1"
          value={surfaceArea}
          onChange={(e) => setSurfaceArea(e.target.value)}
          placeholder="Surface habitable (m²)"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          min="0"
          value={roomCount}
          onChange={(e) => setRoomCount(e.target.value)}
          placeholder="Nombre de pièces"
          required
          className="w-full p-2 border rounded"
        />

        {/* EXCLUSIVITÉ AGENCE */}
        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={exclusiviteAgence}
            onChange={(e) => setExclusiviteAgence(e.target.checked)}
            className="h-4 w-4"
          />
          Exclusivité agence
        </label>

        {/* DÉTAILS DE L’ANNONCE */}
        <label className="block text-lg font-medium mt-6">Détails de l’annonce</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l’annonce"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Prix (€)"
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={
            loading ||
            isGeocoding ||
            !selectedAddress ||
            !propertyType ||
            !transactionType ||
            !surfaceArea ||
            !roomCount
          }
          className={`w-full p-3 text-white rounded font-bold transition ${
            loading || isGeocoding
              ? 'bg-gray-400'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? "Création en cours..." : "Créer et ajouter les images"}
        </button>

      </form>
    </div>
  )
}

