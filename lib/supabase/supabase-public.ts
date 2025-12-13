import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANT :
// Ce client n'utilise PAS de cookies →
// Il est 100% compatible avec Next.js 16 et les RSC.
// Utilise l'anon key côté client/serveur pour lire des données publiques.

export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false, // pas de cookies, pas de session
      autoRefreshToken: false,
    },
  }
);
