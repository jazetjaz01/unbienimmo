import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const bounds = searchParams.get('bounds');
  // On récupère le zoom pour adapter la limite (défaut: 16)
  const zoom = parseFloat(searchParams.get('zoom') || '16');

  if (!bounds) {
    return NextResponse.json({ error: 'Bounds manquants' }, { status: 400 });
  }

  const [west, south, east, north] = bounds.split(',').map(Number);

  // Plus le zoom est faible, plus on limite drastiquement le nombre de points
// Dans votre fichier API route
const limitParam = searchParams.get('limit');
// Si le paramètre est présent, on l'utilise, sinon on garde la logique de zoom
const limit = limitParam ? parseInt(limitParam) : (zoom < 12 ? 100 : 1000);

  try {
    const query = `
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE((
          SELECT json_agg(
            json_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(ST_Transform(ST_Simplify(ST_Centroid(geom), 0.00001), 4326))::json,
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
          )
          FROM (
            SELECT * FROM dvf_mutation 
            WHERE ST_Intersects(
              geom, 
              ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, 4326), 2154)
            )
            AND geom IS NOT NULL
            ORDER BY datemut DESC
            LIMIT $5
          ) AS subquery
        ), '[]'::json)
      ) as geojson;
    `;
    
    const { rows } = await pool.query(query, [west, south, east, north, limit]);
    return NextResponse.json(rows[0]?.geojson || { type: "FeatureCollection", features: [] });
  } catch (err) {
    console.error("Erreur API Ventes:", err);
    return NextResponse.json({ error: 'Erreur BDD' }, { status: 500 });
  }
}