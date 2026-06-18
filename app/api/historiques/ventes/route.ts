import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// Dictionnaire de correspondance entre les filtres frontend et les valeurs réelles de la BDD
const TYPE_MAPPING: Record<string, string[]> = {
  maison: ["DES MAISONS", "MAISON - INDETERMINEE", "UNE MAISON"],
  appartement: ["DEUX APPARTEMENTS", "UN APPARTEMENT"],
  terrain: [
    "TERRAIN AGRICOLE MIXTE", "TERRAIN ARTIFICIALISE MIXTE", "TERRAIN D'AGREMENT", 
    "TERRAIN D'EXTRACTION", "TERRAIN DE TYPE RESEAU", "TERRAIN DE TYPE TAB", 
    "TERRAIN DE TYPE TERRE ET PRE", "TERRAIN FORESTIER", "TERRAIN LANDES ET EAUX", 
    "TERRAIN NATUREL MIXTE", "TERRAIN NON BATIS INDETERMINE", "TERRAIN VERGER", "TERRAIN VITICOLE"
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const bounds = searchParams.get('bounds');
  const typeParam = searchParams.get('type'); // ex: "maison,terrain"
  const zoom = parseFloat(searchParams.get('zoom') || '16');

  if (!bounds) {
    return NextResponse.json({ error: 'Bounds manquants' }, { status: 400 });
  }

  const [west, south, east, north] = bounds.split(',').map(Number);
  const limit = parseInt(searchParams.get('limit') || '100');

  // Logique de conversion : transformer les types du front en valeurs réelles de la DB
  const rawTypes = typeParam ? typeParam.split(',') : [];
  let valuesToQuery: string[] = [];
  
  const isAll = rawTypes.includes('tous') || rawTypes.length === 0;

  if (!isAll) {
    rawTypes.forEach(t => {
      if (TYPE_MAPPING[t]) {
        valuesToQuery.push(...TYPE_MAPPING[t]);
      }
    });
  }

  const filterByTypes = valuesToQuery.length > 0;

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
            ${filterByTypes ? "AND libtypbien = ANY($6)" : ""}
            ORDER BY datemut DESC
            LIMIT $5
          ) AS subquery
        ), '[]'::json)
      ) as geojson;
    `;
    
    // On prépare les paramètres (si filterByTypes est vrai, on ajoute le tableau des valeurs)
    const params: any[] = [west, south, east, north, limit];
    if (filterByTypes) params.push(valuesToQuery);

    const { rows } = await pool.query(query, params);
    return NextResponse.json(rows[0]?.geojson || { type: "FeatureCollection", features: [] });
  } catch (err) {
    console.error("Erreur API Ventes:", err);
    return NextResponse.json({ error: 'Erreur BDD' }, { status: 500 });
  }
}