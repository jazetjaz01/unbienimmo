// components/AuthButton.tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { User } from '@supabase/supabase-js' 

// ➡️ Importer la fonction pour créer le client navigateur
import { createClient } from '@/lib/supabase/client' // Assurez-vous du chemin correct

import { LogoutButton } from './logout-button'

// ➡️ Initialiser le client une seule fois en dehors du composant (ou utiliser useMemo si vous le préférez à l'intérieur)
const supabaseClient = createClient();


export function AuthButton() {
  const [user, setUser] = React.useState<User | null>(null) 
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // 1. Abonnement aux changements d'état
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    // 2. Vérification initiale de la session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false) 
    })

    // Nettoyage : Désarmer l'écouteur
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, []) 

  if (loading) return <div>Loading...</div>

  return user ? (
    <div className="flex items-center gap-4">
      <div className='hidden md:block'> {user.email}</div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button    asChild size="sm" variant="outline">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button      asChild size="sm" variant="default" >
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  )
}