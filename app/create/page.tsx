// app/create/page.tsx (maintenant : app/create/page.tsx)
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AddressAutocomplete from '@/components/AddressAutocomplete'

export default function CreateListingPage() {
  const supabase = createClient()
  const router = useRouter()
  
  // --- NOUVEAUX ÉTATS ---
  const [propertyType, setPropertyType] = useState('')
  const [transactionType, setTransactionType] = useState('')
  const [surfaceArea, setSurfaceArea] = useState('') // Stocké en chaîne pour le formulaire
  
  // --- ÉTATS EXISTANTS ---
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null) 
  
  // Nouveau : Pour stocker le nom de la ville
  const [city, setCity] = useState<string | null>(null); 
  
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  
  const [loading, setLoading] = useState(false) 
  const [isGeocoding, setIsGeocoding] = useState(false); 

  // --- MISE À JOUR DE LA FONCTION SELECT ---
  // On ajoute le paramètre 'city'
  const handleAddressSelect = (address: string, lat: number, lng: number, detectedCity: string) => {
    setSelectedAddress(address);
    setLatitude(lat);
    setLongitude(lng);
    setCity(detectedCity); // On stocke la ville
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!selectedAddress || latitude === null || longitude === null || !city) {
      alert('Veuillez sélectionner une adresse valide et complète pour l\'annonce.')
      setLoading(false)
      return
    }
    if (!propertyType || !transactionType || !surfaceArea) {
      alert('Veuillez remplir toutes les caractéristiques du bien (Type, Transaction, Surface).')
      setLoading(false)
      return
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { 
      alert('Vous devez être connecté.')
      router.push('/login') 
      setLoading(false)
      return 
    }

    // --- ÉTAPE 1 : Création de l'annonce ---
    const { data: listingData, error: listingError } = await supabase
      .from('listings')
      .insert([
        { 
          owner_id: user.id, 
          title,
          price: parseFloat(price),
          description: `Annonce localisée à : ${selectedAddress}`, 
          latitude: latitude,         
          longitude: longitude,
          
          // ✅ NOUVEAUX CHAMPS AJOUTÉS :
          property_type: propertyType,
          transaction_type: transactionType,
          surface_area_m2: parseFloat(surfaceArea),
          
          // ✅ CHAMPS DE LOCALISATION AJOUTÉS :
          city: city, // Le nom de la ville
          street_address: selectedAddress, // L'adresse complète
          
          is_published: false,
        },
      ])
      .select('id') 
      .single();

    if (listingError || !listingData) {
      console.error('Erreur lors de la création de l\'annonce principale:', listingError);
      alert('Erreur lors de la création de l\'annonce principale: ' + listingError?.message);
    } else {
      // 🚀 REDIRECTION VERS LA PAGE D'UPLOAD avec l'ID
      router.push(`/create/${listingData.id}/images`);
    }

    setLoading(false)
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Créer une nouvelle annonce</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        <label className="block text-lg font-medium mb-1">Localisation de l'annonce</label>
        {/* Assurez-vous que votre AddressAutocomplete est mis à jour pour renvoyer la ville */}
        <AddressAutocomplete 
            // ⚠️ ATTENTION : Assurez-vous que le composant AddressAutocomplete gère le paramètre 'city'
            onAddressSelect={handleAddressSelect} 
            onLoadingChange={setIsGeocoding}
        />
        {isGeocoding && (
             <p className="text-blue-500 text-sm">Recherche d'adresses en cours...</p>
        )}
        {selectedAddress && city && (
             <p className="text-green-600 text-sm">
                 Adresse sélectionnée : **{selectedAddress}** à **{city}**
             </p>
        )}

        <label className="block text-lg font-medium mt-6 mb-1">Caractéristiques du Bien</label>
        
        {/* Type de Bien (SELECT) */}
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Choisir le type de bien --</option>
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

        {/* Type de Transaction (SELECT) */}
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Choisir le type de transaction --</option>
          <option value="Vente">Vente</option>
          <option value="Location">Location</option>
          <option value="Viager">Viager</option>
        </select>
        
        {/* Surface Habitable (INPUT NUMBER) */}
        <input 
          type="number" 
          value={surfaceArea} 
          onChange={(e) => setSurfaceArea(e.target.value)} 
          placeholder="Surface habitable (m²)" 
          required 
          min="1"
          className="w-full p-2 border rounded"
        />


        <label className="block text-lg font-medium mt-6 mb-1">Détails de l'annonce</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Titre de l'annonce" 
          required 
          className="w-full p-2 border rounded"
        />
        <input 
          type="number" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          placeholder="Prix (en €)" 
          required 
          className="w-full p-2 border rounded"
        />
        
        <button 
          type="submit" 
          disabled={loading || isGeocoding || !selectedAddress || !propertyType || !transactionType || !surfaceArea} 
          className={`w-full p-3 text-white rounded font-bold ${loading || !selectedAddress || isGeocoding || !propertyType || !transactionType || !surfaceArea ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Création et redirection...' : 'Créer et passer à l\'ajout des images'}
        </button>
      </form>
    </div>
  )
}