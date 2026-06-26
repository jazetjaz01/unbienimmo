"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('@/components/MapContainer'), {
  ssr: false,
  loading: () => <p>Chargement de la carte en cours...</p>,
});

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [communesData, setCommunesData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // Fonction pour réinitialiser la sélection
  const handleReset = () => setSelectedDept(null);

  // Charger les départements
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/prix-departement', { cache: 'no-store' });
        if (!res.ok) throw new Error('Erreur lors du chargement des données');
        const json = await res.json();
        setData(json);
      } catch (err: any) { setError(err.message); }
    }
    fetchData();
  }, []);

  // Charger les communes quand un département est sélectionné
  useEffect(() => {
    if (!selectedDept) {
      setCommunesData(null);
      return;
    }

    async function fetchCommunes() {
      try {
        const res = await fetch(`https://geo.api.gouv.fr/communes?codeDepartement=${selectedDept}&format=geojson&geometry=contour`);
        if (!res.ok) throw new Error("Erreur API communes");
        const json = await res.json();
        setCommunesData(json);
      } catch (err) { console.error("Erreur chargement communes", err); }
    }
    fetchCommunes();
  }, [selectedDept]);

  if (error) return <div>Erreur : {error}</div>;
  if (!data) return <div>Chargement des données...</div>;

  return (
    <main style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <section style={{ 
  width: '600px', // Un peu plus large pour laisser respirer le tableau
  padding: '24px', 
  borderRight: '1px solid #e5e7eb', 
  overflowY: 'auto',
  backgroundColor: '#ffffff'
}}>
  <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#333' }}>
    Prix immobilier partout en France
  </h1>
  
  <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid #333', paddingBottom: '8px' }}>
    Le prix du m² à la vente ( source Etalab) et estimations des loyers
  </h2>

  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
    <thead>
      <tr style={{ borderBottom: '1px solid #ccc', color: '#666' }}>
        <th style={{ textAlign: 'left', padding: '12px 4px' }}>Ville</th>
        <th style={{ textAlign: 'right', padding: '12px 4px' }}>Prix m2 moyen<br/>appartement</th>
        <th style={{ textAlign: 'right', padding: '12px 4px' }}>Prix m2 moyen<br/>maison</th>
        <th style={{ textAlign: 'right', padding: '12px 4px' }}>Loyer m2 moyen<br/>appartement</th>
        <th style={{ textAlign: 'right', padding: '12px 4px' }}>Loyer m2 moyen<br/>maison</th>
      </tr>
    </thead>
    <tbody>
      {data.features.map((f: any) => (
        <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
          <td style={{ padding: '12px 4px', color: '#2563eb', cursor: 'pointer' }} onClick={() => setSelectedDept(f.properties.code)}>
            {f.properties.nom}
          </td>
          <td style={{ textAlign: 'right', padding: '12px 4px' }}>
            {f.properties.prix_m2_appt ? Math.round(f.properties.prix_m2_appt).toLocaleString('fr-FR') + ' €' : '-'}
          </td>
          <td style={{ textAlign: 'right', padding: '12px 4px' }}>
            {f.properties.prix_m2_maison ? Math.round(f.properties.prix_m2_maison).toLocaleString('fr-FR') + ' €' : '-'}
          </td>
          <td style={{ textAlign: 'right', padding: '12px 4px' }}>
            {f.properties.est_loyer_appt ? f.properties.est_loyer_appt + ' €' : '-'}
          </td>
          <td style={{ textAlign: 'right', padding: '12px 4px' }}>
            {f.properties.est_loyer_maison ? f.properties.est_loyer_maison + ' €' : '-'}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</section>

      <section style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
  data={data} 
  communesData={communesData} 
  selectedDepartment={selectedDept} 
  onResetSelection={handleReset}
  onDepartmentClick={(code) => setSelectedDept(code)} // <-- AJOUTEZ CECI
/>
      </section>
    </main>
  );
}