'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, PhoneIncoming, CheckCircle2 } from 'lucide-react'

interface CallbackFormProps {
  listingId: number;
  listingTitle: string;
}

export default function CallbackForm({ listingId, listingTitle }: CallbackFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const payload = {
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      listing_id: listingId,
      message: `Demande de rappel pour l'annonce : ${listingTitle} (Ref: ${listingId})`,
      created_at: new Date().toISOString(),
    }

    const { error: insertError } = await supabase
      .from('contact_requests') // Assurez-vous que cette table existe
      .insert([payload])

    if (insertError) {
      setError("Une erreur est survenue lors de l'envoi.")
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-4 rounded-full bg-teal-50 p-3 text-teal-600">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Demande envoyée !</h3>
        <p className="mt-2 text-sm text-gray-600">
          Un conseiller vous rappellera dans les plus brefs délais sur votre numéro.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-xl font-semibold  mb-4">
        
        Je souhaite être recontacté par l'agence
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">Prénom</label>
          <input required name="firstName" type="text" className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" placeholder="Jean" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">Nom</label>
          <input required name="lastName" type="text" className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" placeholder="Dupont" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
        <input required name="email" type="email" className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" placeholder="jean@exemple.com" />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase">Téléphone</label>
        <input required name="phone" type="tel" className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500" placeholder="06 12 34 56 78" />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        disabled={loading}
        type="submit"
        className="flex w-full items-center justify-center rounded-lg bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Je soihaite être rapelé concernant ce bien"}
      </button>

      <p className="text-[10px] text-center text-gray-400">
        En validant, vous acceptez que vos données soient transmises à l'agence pour traiter votre demande.
      </p>
    </form>
  )
}