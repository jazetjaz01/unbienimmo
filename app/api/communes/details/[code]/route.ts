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
    // ... dans ton try { ... }
const { rows } = await query(`
  SELECT 
    code_insee, 
    code_departement,
    prix_m2_appt, 
    prix_m2_maison, 
    prix_m2_moyen,
    nb_trans_appt,
    nb_trans_maison,
    CASE 
      WHEN nb_trans_appt < 50 THEN 1
      WHEN nb_trans_appt < 200 THEN 2
      WHEN nb_trans_appt < 500 THEN 3
      ELSE 4 
    END AS conf_appt,
    CASE 
      WHEN nb_trans_maison < 50 THEN 1
      WHEN nb_trans_maison < 200 THEN 2
      WHEN nb_trans_maison < 500 THEN 3
      ELSE 4 
    END AS conf_maison
  FROM communes 
  WHERE code_insee = $1 OR code_insee = $2
`, [code, code.padStart(5, '0')]);
// ...

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Commune non trouvée' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
    
  } catch (error) {
    console.error("[API] Erreur détails commune :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}