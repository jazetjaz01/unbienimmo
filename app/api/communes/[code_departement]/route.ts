import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code_departement: string }> }
) {
  const { code_departement } = await params;

  try {
    // 1. Récupération des prix depuis ta base PostgreSQL
    const { rows: prixData } = await query(`
      SELECT code_insee, prix_m2_moyen, nb_transactions 
      FROM communes 
      WHERE code_departement = $1
    `, [code_departement]);

    // 2. Calcul de la moyenne départementale pour l'imputation
    const prixExistants = prixData.filter(p => p.prix_m2_moyen != null).map(p => parseFloat(p.prix_m2_moyen));
    const avgPrixDept = prixExistants.length > 0 
      ? prixExistants.reduce((a, b) => a + b, 0) / prixExistants.length 
      : 0;

    // 3. Récupération de la géométrie (API publique en secours)
    const geoRes = await fetch(`https://geo.api.gouv.fr/communes?codeDepartement=${code_departement}&format=geojson&geometry=contour`);
    if (!geoRes.ok) throw new Error("Impossible de récupérer les contours via l'API publique");
    const geojson = await geoRes.json();

    // 4. Fusion des données (La logique que tu avais déjà)
    const prixMap = new Map(
      prixData.map((p: any) => [String(p.code_insee).trim().padStart(5, '0'), p])
    );

    geojson.features = geojson.features.map((feature: any) => {
      const codeGeo = String(feature.properties.code || "").trim().padStart(5, '0');
      const prixInfo = prixMap.get(codeGeo);
      const hasData = prixInfo && parseFloat(prixInfo.prix_m2_moyen) > 0;
      
      return {
        ...feature,
        id: codeGeo,
        properties: { 
          ...feature.properties, 
          prix_m2: hasData ? parseFloat(prixInfo.prix_m2_moyen) : avgPrixDept,
          nb_transactions: hasData ? parseInt(prixInfo.nb_transactions) : 0,
          is_estimated: !hasData
        }
      };
    });

    return NextResponse.json(geojson);
  } catch (error) {
    console.error("[API] Erreur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}