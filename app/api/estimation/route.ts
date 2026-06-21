import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

/**
 * Calcule un coefficient multiplicateur ajusté selon les caractéristiques du bien.
 * Logique métier basée sur les standards du marché immobilier.
 */
function calculatePropertyCoefficient(data: any): number {
  let coef = 1.0;

  // 1. STANDING ET ÉTAT
  if (data.property_quality === 'prestige') coef += 0.20;
  if (data.property_state === 'excellent') coef += 0.10;
  if (data.property_state === 'a_renover') coef -= 0.15;
  if (data.has_great_view) coef += 0.08;

  // 2. EXTÉRIEURS ET ESPACES (Pondération)
  // Primes pour surfaces extérieures
  if (data.has_balcony) coef += (data.balcony_surface > 5 ? 0.04 : 0.02);
  if (data.has_terrace) coef += (data.terrace_surface > 15 ? 0.08 : 0.05);
  
  // Pénalité sévère si aucun extérieur (Facteur clé de décote)
  if (!data.has_balcony && !data.has_terrace) coef -= 0.10;
// Sécurité : ne pas accorder de prime si la surface est nulle
if (data.has_balcony && data.balcony_surface <= 0) data.has_balcony = false;
  // 3. STATIONNEMENT ET RANGEMENT
  if (data.has_parking) coef += (data.parking_count >= 2 ? 0.08 : 0.05);
  if (data.has_cellar) coef += (data.cellar_count >= 1 ? 0.02 : 0);

  // 4. ÉTAGE ET IMMEUBLE
  // Pénalité pour le RDC (0)
  if (data.floor === 0) coef -= 0.05; 
  // Prime dernier étage (si ascenseur ou immeuble bas)
  if (data.floor === data.total_floors && data.total_floors > 1) coef += 0.04;
  // Pénalité pour étage élevé sans ascenseur
  if (data.floor > 2 && !data.has_elevator) coef -= 0.12;
  
  if (data.renovated_common_areas) coef += 0.03;
  if (data.recent_facading) coef += 0.04;

  // 5. SERVICES
  if (data.has_service_room) coef += 0.02;

  // Bornes de sécurité : empêche une estimation irréaliste
  return Math.max(0.60, Math.min(1.45, coef));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const surface = parseFloat(searchParams.get('surface') || '0');
  const radius = parseInt(searchParams.get('radius') || '500');

  const propertyData = {
    property_state: searchParams.get('propertyState'),
    property_quality: searchParams.get('propertyQuality'),
    has_great_view: searchParams.get('hasGreatView') === 'true',
    floor: parseInt(searchParams.get('floor') || '0'),
    total_floors: parseInt(searchParams.get('totalFloors') || '1'),
    has_elevator: searchParams.get('hasElevator') === 'true',
    renovated_common_areas: searchParams.get('renovatedCommonAreas') === 'true',
    recent_facading: searchParams.get('recentFacading') === 'true',
    has_balcony: searchParams.get('hasBalcony') === 'true',
    balcony_surface: parseFloat(searchParams.get('balconySurface') || '0'),
    has_terrace: searchParams.get('hasTerrace') === 'true',
    terrace_surface: parseFloat(searchParams.get('terraceSurface') || '0'),
    has_parking: searchParams.get('hasParking') === 'true',
    parking_count: parseInt(searchParams.get('parkingCount') || '0'),
    has_cellar: searchParams.get('hasCellar') === 'true',
    cellar_count: parseInt(searchParams.get('cellarCount') || '0'),
    has_service_room: searchParams.get('hasServiceRoom') === 'true'
  };

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Coordonnées manquantes' }, { status: 400 });
  }

  try {
    const query = `
      SELECT AVG(valeurfonc / NULLIF(sbati, 0)) as prix_m2_local, COUNT(*) as nb_transactions_local
      FROM dvf_mutation
      WHERE ST_DWithin(geom, ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 2154), $3)
      AND sbati > 0 AND valeurfonc > 0
      AND datemut::date > CURRENT_DATE - INTERVAL '24 months';
    `;

    const { rows } = await pool.query(query, [lon, lat, radius]);
    const result = rows[0];

    const prixM2Base = result.prix_m2_local || 0;
    const coef = calculatePropertyCoefficient(propertyData);
    
    // Application du coefficient
    const prixM2Ajuste = prixM2Base * coef;
    // Arrondi au millier le plus proche
    const estimationArrondie = Math.round((prixM2Ajuste * surface) / 1000) * 1000;

    return NextResponse.json({
      prixM2: Math.round(prixM2Base),
      prixM2Ajuste: Math.round(prixM2Ajuste),
      estimation: estimationArrondie,
      nbTransactions: result.nb_transactions_local,
      coefficientApplique: coef.toFixed(2),
      message: result.nb_transactions_local < 3 ? "Échantillon faible" : "Estimation ajustée selon les critères"
    });

  } catch (err) {
    console.error("Erreur calcul:", err);
    return NextResponse.json({ error: 'Erreur interne lors du calcul' }, { status: 500 });
  }
}