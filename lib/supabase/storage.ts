// lib/supabase/storage.ts
import { createClient } from '@/lib/supabase/client'; 

const supabase = createClient();
const BUCKET_NAME = 'listings';

/**
 * Construit l'URL publique complète à partir du chemin relatif stocké dans la DB.
 * @param relativePath Le chemin stocké dans la DB (ex: '24/17...jpg')
 * @returns L'URL complète et affichable
 */
export function getFullPublicUrl(relativePath: string): string {
  // L'appel getPublicUrl fait tout le travail. Il prend le chemin relatif
  // et le préfixe avec l'URL de base et le nom du bucket.
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(relativePath);
  
  return data?.publicUrl || ''; 
}