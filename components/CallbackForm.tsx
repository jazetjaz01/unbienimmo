'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2 } from 'lucide-react'

interface CallbackFormProps {
  listingId: number
  listingTitle: string
  transactionType?: string | null
  price?: number | null
  city?: string | null
}

export default function CallbackForm({
  listingId,
  listingTitle,
  transactionType,
  price,
  city,
}: CallbackFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const userMessage = formData.get('message') as string | null

    const formattedPrice = price
      ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
      : '-'

    const payload = {
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      listing_id: listingId,
      message: `
Je suis intéressé par le bien à la ${(transactionType ?? '-').toLowerCase()} au prix de ${formattedPrice} situé dans la ville de ${city ?? '-'}, annonce ayant pour référence ${listingId}.
Message du client :
${userMessage || '—'}
      `.trim(),
      created_at: new Date().toISOString(),
    }

    const { error: insertError } = await supabase
      .from('contact_requests')
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
          L’agence vous recontactera dans les plus brefs délais.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-xl font-semibold mb-4">
        Je souhaite être recontacté 
      </div>

      {/* Prénom / Nom */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">Prénom</label>
          <input
            required
            name="firstName"
            type="text"
            placeholder="Jean"
            className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">Nom</label>
          <input
            required
            name="lastName"
            type="text"
            placeholder="Dupont"
            className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
        <input
          required
          name="email"
          type="email"
          placeholder="jean@exemple.com"
          className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Téléphone */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase">Téléphone</label>
        <input
          required
          name="phone"
          type="tel"
          placeholder="06 12 34 56 78"
          className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Message utilisateur */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500 uppercase">
          Message (optionnel)
        </label>
        <textarea
          name="message"
          rows={4}
          defaultValue={`Je suis intéressé par le bien à la ${(transactionType ?? '-').toLowerCase()} au prix de ${price ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price) : '-'} situé dans la ville de ${city ?? '-'}, annonce ayant pour référence ${listingId}.`}
          className="w-full resize-none rounded-md border border-gray-200 p-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        disabled={loading}
        type="submit"
        className="flex w-full items-center justify-center rounded-lg bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Validez'}
      </button>

      <p className="text-[10px] text-center text-gray-400">
        En validant, vous acceptez que vos données soient transmises à l'agence pour traiter votre demande.
      </p>
    </form>
  )
}
