'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 1. ÉCOUTEUR D'ÉTAT : Déclenche la redirection robuste vers le Dashboard
  useEffect(() => {
    const supabase = createClient()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        console.log("Session Alamiia validée, redirection forcée...")
        
        // Ordre d'exécution crucial pour bypasser le cache agressif de Next.js
        router.refresh() 
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // 2. Connexion via Google OAuth
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
        redirectTo: `${window.location.origin}/auth/oauth`,
        },
      })

      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue avec Google')
      setIsGoogleLoading(false)
    }
  }

  // 3. Connexion standard via E-mail
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data?.user) {
        // Redirection email sécurisée
        router.refresh()
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Identifiants invalides')
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-medium tracking-tight">Bienvenue !</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre espace 
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          
          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoading || isGoogleLoading}
            onClick={handleGoogleLogin}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.58z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.46l4.11-3.22z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.64l4.11 3.22c.94-2.84 3.57-4.95 6.68-4.95z"/>
              </svg>
            )}
            Continuer avec Google
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">Ou via email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="grid gap-2 text-left">
              <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Adresse Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                className="w-full p-3 border border-slate-200 focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700 rounded-lg outline-none text-sm transition-all shadow-sm"
                required
              />
            </div>
            
            <div className="grid gap-2 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mot de passe
                </label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-xs text-cyan-700 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                className="w-full p-3 border border-slate-200 focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700 rounded-lg outline-none text-sm transition-all shadow-sm"
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2 bg-slate-800 hover:bg-black text-white" disabled={isLoading || isGoogleLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}