import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  // --- ZONE MODIFIÉE POUR LAISSER LA PAGE D'ACCUEIL LIBRE ---
  
  const pathname = request.nextUrl.pathname

  // Définis ici la liste des routes qui demandent obligatoirement un compte connecté
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/estimation-success')

  // On ne redirige QUE si l'utilisateur n'est pas connecté ET qu'il essaie d'accéder à une page protégée
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login' // Ou ta page de connexion
    return NextResponse.redirect(url)
  }

  // --- FIN DE LA ZONE MODIFIÉE ---

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}