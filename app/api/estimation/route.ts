import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * Calcule un coefficient multiplicateur ajusté selon les caractéristiques du bien.
 */
function getConstructionAgeCoefficient(period: string): number {
  switch (period.trim()) {
    case "Avant 1900": return -0.10;
    case "1900 - 1950": return -0.05;
    case "1950 - 1970": return -0.08;
    case "Après 2020": return 0.05;
    default: return 0;
  }
}

function calculateConfidenceScore(nbTransactions: number, prixMoyen: number, ecartType: number): number {
  if (nbTransactions === 0) return 0;
  const volScore = 1 - Math.exp(-0.1 * nbTransactions);
  const cv = (ecartType || 0) / (prixMoyen || 1);
  const dispScore = Math.max(0, 1 - (cv * 2)); 
  const finalScore = (volScore * 0.6) + (dispScore * 0.4);
  return Math.round(finalScore * 100);
}

function calculatePropertyCoefficient(data: any): number {
  let coef = 1.0;

  if (data.property_state === 'refurbished') coef += 0.15;
  if (data.property_state === 'refreshment') coef -= 0.10;
  if (data.property_state === 'renovation') coef -= 0.25;

  if (data.property_quality === 'superior') coef += 0.10;
  if (data.property_quality === 'inferior') coef -= 0.10;

  if (data.has_great_view) coef += 0.08;

  if (data.has_balcony) coef += (data.balcony_surface > 5 ? 0.04 : 0.02);
  if (data.has_terrace) coef += (data.terrace_surface > 15 ? 0.08 : 0.05);
  
  if (!data.has_balcony && !data.has_terrace) coef -= 0.20;

  if (data.has_parking) coef += (data.parking_count >= 2 ? 0.15 : 0.10);
  if (data.has_cellar) coef += (data.cellar_count >= 1 ? 0.02 : 0);

  if (data.floor === 0) coef -= 0.05; 
  if (data.floor === data.total_floors && data.total_floors > 1) coef += 0.04;
  if (data.floor > 2 && !data.has_elevator) coef -= 0.12;
  
  if (data.renovated_common_areas) coef += 0.03;
  if (data.recent_facading) coef += 0.04;

  if (data.has_service_room) coef += 0.02;

  return coef;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const surface = parseFloat(searchParams.get('surface') || '0');
  const radius = parseInt(searchParams.get('radius') || '500');
  const constructionPeriod = searchParams.get('constructionPeriod') || "";
  
  // Sécurisation du type de bien
  const rawType = searchParams.get('propertyType');
const propertyType = (rawType === 'house' || rawType === 'maison') ? 'house' : 'apartment';
  const typeCodes = propertyType === 'apartment' ? ['120', '121', '122'] : ['110', '111', '112'];
  
  // Choix des colonnes dynamiques sans concaténation dangereuse
  const surfaceCol = propertyType === 'apartment' ? 'sbatapt' : 'sbatmai';

console.log("Type de bien demandé :", propertyType);
console.log("Codes SQL filtrés :", typeCodes);


  if (!lat || !lon) {
    return NextResponse.json({ error: 'Coordonnées manquantes' }, { status: 400 });
  }

  try {
    // Utilisation de paramètres SQL ($1, $2, etc) pour tout
    const query = `
      SELECT 
        AVG(valeurfonc / ${surfaceCol}) as prix_m2_local, 
        STDDEV(valeurfonc / ${surfaceCol}) as ecart_type,
        COUNT(*) as nb_transactions_local
      FROM dvf_mutation
      WHERE ST_DWithin(geom, ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 2154), $3)
      AND codtypbien = ANY($4::text[])
      AND ${surfaceCol} > 9 
      AND valeurfonc > 10000 
      AND datemut::date > CURRENT_DATE - INTERVAL '24 months'
    `;

    const { rows } = await pool.query(query, [lon, lat, radius, typeCodes]);
    const result = rows[0];

    // Vérification si des données ont été trouvées
    if (!result.prix_m2_local) {
      return NextResponse.json({ error: 'Aucune donnée trouvée dans cette zone' }, { status: 404 });
    }

    const prixM2Base = parseFloat(result.prix_m2_local);
    const ecartType = parseFloat(result.ecart_type) || 0;
    const nbTransactions = parseInt(result.nb_transactions_local) || 0;

    const confidenceScore = calculateConfidenceScore(nbTransactions, prixM2Base, ecartType);
    
    // Reste du calcul...
    const propertyData = { /* ... tes données du form ... */ };
    const coefBase = calculatePropertyCoefficient(propertyData);
    const coefEpoque = getConstructionAgeCoefficient(constructionPeriod);
    const coefTotal = Math.max(0.60, Math.min(1.45, coefBase + coefEpoque));

    const prixM2Ajuste = prixM2Base * coefTotal;
    const estimationArrondie = Math.round((prixM2Ajuste * surface) / 1000) * 1000;

    return NextResponse.json({
      prixM2: Math.round(prixM2Base),
      estimation: estimationArrondie,
      nbTransactions,
      indiceConfiance: confidenceScore,
      coefficientApplique: coefTotal, 
      dispersion: ecartType.toFixed(0) 
    });

  } catch (err) {
    console.error("Erreur calcul:", err);
    return NextResponse.json({ error: 'Erreur interne lors du calcul' }, { status: 500 });
  }
}