import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { searchParams } = new URL(request.url);
  const type_bien = searchParams.get('type') || 'appt'; // 'appt' ou 'maison'

  try {
    console.log("Code reçu par l'API :", code); // Regarde dans ton terminal serveur
const { rows } = await query(`
  SELECT 
    EXTRACT(YEAR FROM annee_mois)::int as annee, 
    AVG(prix_m2) as prix_m2 
  FROM historique_prix 
  WHERE code_insee = $1 AND type_bien = $2
  GROUP BY annee
  ORDER BY annee ASC
`, [code.padStart(5, '0'), type_bien]);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}