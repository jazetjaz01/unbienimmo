import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const { rows: prixData } = await query(`
  SELECT code_departement, prix_m2_moyen, prix_m2_appt, prix_m2_maison 
  FROM stats_departements_2025
`);
    
    const filePath = path.join(process.cwd(), 'public/data/departements.geojson');
    const geojson = JSON.parse(await fs.readFile(filePath, 'utf8'));

    const prixMap = prixData.reduce((acc: any, p: any) => {
      acc[p.code_departement] = p.prix_m2_moyen;
      return acc;
    }, {});

    geojson.features = geojson.features.map((feature: any) => {
  const code = feature.properties.code; 
  const prix = prixData.find((p: any) => p.code_departement === code);
  
  return {
    ...feature,
    id: code,
    properties: { 
      ...feature.properties, 
      prix_m2_appt: prix?.prix_m2_appt || 0,
      prix_m2_maison: prix?.prix_m2_maison || 0
    }
  };
});

    return NextResponse.json(geojson);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}