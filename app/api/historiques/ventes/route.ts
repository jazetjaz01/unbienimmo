import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Assurez-vous d'utiliser votre pool global

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || "0");
  const lng = parseFloat(searchParams.get('lng') || "0");

  try {
    const query = `
  SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', COALESCE(json_agg(
      json_build_object(
        'type', 'Feature',
        /* 1. On transforme le géométrie Lambert-93 (2154) en WGS84 (4326) pour Mapbox */
        'geometry', ST_AsGeoJSON(ST_Transform(ST_Centroid(geom), 4326))::json,
        'properties', json_build_object(
          'adresse', l_idpar,
          'prix', valeurfonc,
          'type', libtypbien,
          'surface', sbati,
          'pieces', (
            (COALESCE(nbapt1pp, 0) * 1) + (COALESCE(nbapt2pp, 0) * 2) + 
            (COALESCE(nbapt3pp, 0) * 3) + (COALESCE(nbapt4pp, 0) * 4) + 
            (COALESCE(nbapt5pp, 0) * 5) + (COALESCE(nbmai1pp, 0) * 1) + 
            (COALESCE(nbmai2pp, 0) * 2) + (COALESCE(nbmai3pp, 0) * 3) + 
            (COALESCE(nbmai4pp, 0) * 4) + (COALESCE(nbmai5pp, 0) * 5)
          ),
          'date', datemut
        )
      )
    ), '[]'::json)
  ) as geojson
  FROM dvf_mutation 
  /* 2. On transforme l'entrée WGS84 ($1, $2) en Lambert-93 pour comparer avec la colonne geom */
  WHERE ST_DWithin(
    geom, 
    ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 2154), 
    500
  )
  AND geom IS NOT NULL;
`;
    
    const { rows } = await pool.query(query, [lng, lat]);
    return NextResponse.json(rows[0]?.geojson || { type: "FeatureCollection", features: [] });
  } catch (err) {
    console.error("Erreur API Ventes:", err);
    return NextResponse.json({ error: 'Erreur BDD' }, { status: 500 });
  }
}