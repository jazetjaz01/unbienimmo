import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

// Ratio moyen de rendement locatif (ex: 0.45% du prix de vente par mois)
const RATIO_LOYER_VENTE = 0.0045; 

export async function GET() {
  try {
    // 1. Récupération des statistiques par département
    const { rows: statsData } = await query(`
      SELECT code_departement, prix_m2_moyen, prix_m2_appt, prix_m2_maison 
      FROM stats_departements_2025
    `);
    
    // 2. Chargement du GeoJSON
    const filePath = path.join(process.cwd(), 'public/data/departements.geojson');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const geojson = JSON.parse(fileContent);

    // 3. Création d'un index pour une fusion rapide
    const statsMap = new Map(statsData.map((s: any) => [s.code_departement, s]));

    // 4. Fusion des données
    geojson.features = geojson.features.map((feature: any) => {
      const code = feature.properties.code; // Assure-toi que c'est bien la clé de ton GeoJSON
      const stats = statsMap.get(code);
      
      return {
        ...feature,
        properties: { 
          ...feature.properties, 
          // On injecte les valeurs directement
          prix_m2_moyen: stats?.prix_m2_moyen || 0,
          prix_m2_appt: stats?.prix_m2_appt || 0,
          prix_m2_maison: stats?.prix_m2_maison || 0
        }
      };
    });

    return NextResponse.json(geojson);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la fusion" }, { status: 500 });
  }
}