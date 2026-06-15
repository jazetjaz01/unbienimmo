import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Coordonnées manquantes' }, { status: 400 });
  }

  const delta = 0.001; 
  const latVal = parseFloat(lat);
  const lngVal = parseFloat(lng);

  const url = `https://data.geopf.fr/wfs/ows` +
    `?service=WFS&version=2.0.0&request=GetFeature` +
    `&typeName=CADASTRALPARCELS.PARCELLAIRE_EXPRESS:parcelle` +
    `&outputFormat=application/json&srsName=EPSG:4326` +
    `&bbox=${lngVal - delta},${latVal - delta},${lngVal + delta},${latVal + delta},EPSG:4326`;

  // Création d'un contrôleur de timeout (5 secondes)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MonAppCadastre/1.0 (contact@tondomaine.com)', // Indispensable pour le Geoportail
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      // Si le Geoportail est en surcharge, on logue mais on ne fait pas planter l'UI
      console.error(`Erreur Geoportail: ${response.statusText}`);
      return NextResponse.json({ type: "FeatureCollection", features: [] });
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    clearTimeout(timeout);
    console.error("Erreur proxy cadastre:", error.message);
    
    // On renvoie un tableau vide plutôt qu'une erreur 500 
    // pour permettre à la carte de continuer à fonctionner silencieusement
    return NextResponse.json({ type: "FeatureCollection", features: [] });
  }
}