import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

// Ratio moyen de rendement locatif (ex: 0.45% du prix de vente par mois)
const RATIO_LOYER_VENTE = 0.0045; 

export async function GET() {
  try {
    // 1. Récupération des prix de vente depuis la base
    const { rows: prixData } = await query(`
      SELECT code_departement, prix_m2_appt, prix_m2_maison 
      FROM stats_departements_2025
    `);
    
    const filePath = path.join(process.cwd(), 'public/data/departements.geojson');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const geojson = JSON.parse(fileContent);

    const prixMap = new Map(prixData.map((p: any) => [p.code_departement, p]));

    // 2. Fusion et Calcul de l'estimation
    geojson.features = geojson.features.map((feature: any) => {
      const code = feature.properties.code;
      const prix = prixMap.get(code);
      
      // Calcul estimatif du loyer au m²
      const estLoyerAppt = prix ? Math.round(prix.prix_m2_appt * RATIO_LOYER_VENTE) : 0;
      const estLoyerMaison = prix ? Math.round(prix.prix_m2_maison * RATIO_LOYER_VENTE) : 0;
      
      return {
        ...feature,
        id: code,
        properties: { 
          ...feature.properties, 
          prix_m2_appt: prix?.prix_m2_appt || 0,
          prix_m2_maison: prix?.prix_m2_maison || 0,
          // Ajout des colonnes estimées pour le frontend
          est_loyer_appt: estLoyerAppt,
          est_loyer_maison: estLoyerMaison
        }
      };
    });

    return NextResponse.json(geojson);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'estimation" }, { status: 500 });
  }
}