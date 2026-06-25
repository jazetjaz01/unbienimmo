import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // 1. Récupération des données depuis la base
    const { rows: prixData } = await query(`
      SELECT code_departement, prix_m2_appt, prix_m2_maison 
      FROM stats_departements_2025
    `);
    
    // 2. Chargement du fichier GeoJSON
    const filePath = path.join(process.cwd(), 'public/data/departements.geojson');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const geojson = JSON.parse(fileContent);

    // 3. Création d'une Map pour une recherche ultra-rapide (O(1) au lieu de O(N))
    const prixMap = new Map(
      prixData.map((p: any) => [p.code_departement, p])
    );

    // 4. Fusion des données
    geojson.features = geojson.features.map((feature: any) => {
      const code = feature.properties.code;
      const prix = prixMap.get(code);
      
      return {
        ...feature,
        id: code, // Utilisé par Mapbox pour le feature-state
        properties: { 
          ...feature.properties, 
          prix_m2_appt: prix?.prix_m2_appt || 0,
          prix_m2_maison: prix?.prix_m2_maison || 0
        }
      };
    });

    return NextResponse.json(geojson);
  } catch (error) {
    console.error("Erreur API prix-departement:", error);
    return NextResponse.json({ error: "Erreur lors de la fusion des données" }, { status: 500 });
  }
}