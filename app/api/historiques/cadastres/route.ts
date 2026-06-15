import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Coordonnées manquantes' }, { status: 400 });
  }

  // Delta de 0.001 : cela crée une zone de recherche (bbox) d'environ 100m.
  // C'est assez large pour inclure la parcelle, mais assez précis pour 
  // ne pas ramener trop de parcelles voisines inutiles.
  const delta = 0.001; 
  const latVal = parseFloat(lat);
  const lngVal = parseFloat(lng);

  const minLat = latVal - delta;
  const maxLat = latVal + delta;
  const minLon = lngVal - delta;
  const maxLon = lngVal + delta;

  // Construction de l'URL WFS Géoportail
  const url = `https://data.geopf.fr/wfs/ows` +
    `?service=WFS` +
    `&version=2.0.0` +
    `&request=GetFeature` +
    `&typeName=CADASTRALPARCELS.PARCELLAIRE_EXPRESS:parcelle` +
    `&outputFormat=application/json` +
    `&srsName=EPSG:4326` +
    `&bbox=${minLon},${minLat},${maxLon},${maxLat},EPSG:4326`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur Géoportail: ${response.status}`);
    }
    
    const data = await response.json();

    // Retourne la donnée structurée pour être lue par ton CadastreLayer
    // Remplace ceci :
// return NextResponse.json({ data });

// Par ceci :
return NextResponse.json(data);

  } catch (error) {
    console.error("Erreur proxy cadastre:", error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des données' }, { status: 500 });
  }
}