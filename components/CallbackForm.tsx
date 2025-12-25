'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  // MISE À JOUR : Contrastes renforcés pour les bordures et les placeholders
  const inputClasses = "w-full rounded-none border-b  bg-transparent py-3 text-sm font-medium text-gray-900 transition-all focus:border-gray-900 focus:outline-none placeholder:text-gray-500 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
  
  // MISE À JOUR : Label plus sombre (gray-600 au lieu de 400)
  const labelClasses = "text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em]"

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
      message: formData.get('message'),
      created_at: new Date().toISOString(),
    }

    const { error: insertError } = await supabase.from('contact_requests').insert([payload])
    if (insertError) setError("Une erreur est survenue.")
    else setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-700">
        <CheckCircle2 size={32} className="text-gray-900 mb-4 font-light" />
        <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-gray-900">Demande confirmée</h3>
        <p className="mt-4 text-sm text-gray-600 italic font-light">Notre équipe vous recontactera sous peu.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <label className={labelClasses}>Prénom</label>
            <input required name="firstName" type="text" placeholder="JEAN" className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Nom</label>
            <input required name="lastName" type="text" placeholder="DUPONT" className={inputClasses} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-1">
            <label className={labelClasses}>Email</label>
            <input required name="email" type="email" placeholder="JEAN@EXEMPLE.COM" className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Téléphone</label>
            <input required name="phone" type="tel" placeholder="06 00 00 00 00" className={inputClasses} />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>Message</label>
          <textarea
            name="message"
            rows={3}
            defaultValue={`Je souhaite obtenir des informations concernant le bien à la ${(transactionType ?? '-').toLowerCase()} à ${city ?? '-'} (Réf: ${listingId}).`}
            className={cn(inputClasses, "resize-none h-auto")}
          />
        </div>
      </div>

      {error && <p className="text-[10px] uppercase font-bold text-red-600 tracking-widest text-center">{error}</p>}

      <div className="space-y-6">
        <button
          disabled={loading}
          type="submit"
          className="group flex w-full items-center justify-between border border-gray-900 bg-gray-900 px-6 py-4 transition-all hover:bg-white active:scale-[0.98]"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white group-hover:text-gray-900 transition-colors">
            {loading ? 'ENVOI EN COURS...' : 'Envoyer la demande'}
          </span>
          {!loading && <ArrowRight className="h-4 w-4 text-white group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />}
          {loading && <Loader2 className="h-4 w-4 animate-spin text-white group-hover:text-gray-900" />}
        </button>

        {/* MISE À JOUR : Texte légal passé de gray-300 à gray-500 pour lisibilité */}
        <p className="text-[9px] text-center text-gray-500 uppercase leading-relaxed tracking-widest px-4 font-medium">
          En validant ce formulaire  vous acceptez que vos données soient transmises à l'agence immobilière ou professionel partenaire  pour le traitement de votre demande.
        </p>
      </div>
    </form>
  )
}