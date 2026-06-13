import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 3) { // Optionnel : ne pas appeler l'API si la requête est trop courte
    return NextResponse.json({ features: [] });
  }

  try {
    // Timeout de 5 secondes pour ne pas bloquer l'utilisateur
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
      signal: controller.signal
    });
    
    clearTimeout(id); // On nettoie le timer
    
    if (!response.ok) {
      return NextResponse.json({ features: [] }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Erreur Proxy API :", error);
    // Gestion spécifique du timeout
    return NextResponse.json(
      { features: [], error: error.name === 'AbortError' ? 'Timeout' : 'Erreur serveur' }, 
      { status: 500 }
    );
  }
}