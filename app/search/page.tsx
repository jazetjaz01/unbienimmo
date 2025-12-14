import { Suspense } from 'react';
import { SearchContainer } from '@/components/SearchContainer'; // ⬅️ Importer le nouveau composant

// Le composant de la page principale (Server Component)
export default function SearchPage() {
  return (
    // ➡️ Le Suspense Boundary est la solution requise par Next.js
    <Suspense fallback={<SearchLoading />}>
        {/* Le SearchContainer est un client component qui utilise useSearchParams() */}
        <SearchContainer />
    </Suspense>
  );
}

// Composant simple de chargement
function SearchLoading() {
    return (
        <div className="p-4 container mx-auto text-center py-20">
            <h1 className="text-2xl font-bold mb-6">Chargement des résultats...</h1>
            {/* Vous pouvez ajouter un spinner ou un squelette de mise en page ici */}
        </div>
    );
}

// ⚠️ IMPORTANT : Vous devez supprimer le 'use client' et l'importation de useSearchParams()
// de ce fichier '/search/page.tsx' et vous assurer qu'ils sont uniquement dans SearchContainer.