import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code) {
    return NextResponse.json({ error: 'Code commune manquant' }, { status: 400 });
  }

  try {
    // Utilisation des colonnes réelles confirmées par ta requête SQL
    const { rows } = await query(`
      SELECT 
        code_insee, 
        code_departement,
        prix_m2_appt, 
        prix_m2_maison, 
        prix_m2_moyen,
        nb_transactions
      FROM communes 
      WHERE code_insee = $1 OR code_insee = $2
    `, [
      code, 
      code.padStart(5, '0') // Gestion du zéro initial
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Commune non trouvée' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
    
  } catch (error) {
    console.error("[API] Erreur détails commune :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}