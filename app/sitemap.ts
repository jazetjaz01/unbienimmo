import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server'; // Ton fichier serveur

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Initialisation du client serveur
  const supabase = await createClient();

  // 2. Récupération des données depuis la table 'posts'
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, created_at');

  // 3. Transformation des posts en entrées sitemap
  const actualitesEntries = (posts || []).map((post) => ({
    url: `https://www.unbienimmo.com/actualite/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. Définition des pages statiques
  const staticPages = [
    { url: '', priority: 1.0 },
    { url: '/actualite', priority: 0.9 },
    { url: '/contact', priority: 0.5 },
    { url: '/cgu', priority: 0.3 },
    { url: '/confidentialite', priority: 0.3 },
    { url: '/cookies', priority: 0.3 },
    { url: '/mentions', priority: 0.3 },
    { url: '/estimation-immobiliere', priority: 0.9 },
    { url: '/estimer', priority: 0.7 },
    { url: '/historique-ventes', priority: 0.6 },
    { url: '/prix-immobilier', priority: 0.7 },
  ];

  const staticEntries = staticPages.map((page) => ({
    url: `https://www.unbienimmo.com${page.url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: page.priority,
  }));

  // 5. Fusion et retour
  return [...staticEntries, ...actualitesEntries];
}