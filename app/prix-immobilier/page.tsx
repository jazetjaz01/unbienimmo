"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('@/components/MapContainer'), {
  ssr: false,
  loading: () => <p>Chargement de la carte en cours...</p>,
});

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/prix-departement', { cache: 'no-store' });
        if (!res.ok) throw new Error('Erreur lors du chargement des données');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchData();
  }, []);

  if (error) return <div>Erreur : {error}</div>;
  if (!data) return <div>Chargement des données...</div>;

  return (
    <main style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <section style={{ 
        width: '450px', 
        padding: '24px', 
        borderRight: '1px solid #e5e7eb', 
        overflowY: 'auto',
        backgroundColor: '#ffffff'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
          Prix immobilier partout en France
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '20px' }}>
          Cliquez sur un département pour zoomer.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.features
            .sort((a: any, b: any) => a.properties.code.localeCompare(b.properties.code))
            .map((f: any) => (
              <div 
                key={f.id} 
                onClick={() => setSelectedDept(f.properties.code)}
                style={{ 
                  padding: '12px', 
                  border: selectedDept === f.properties.code ? '2px solid #3b82f6' : '1px solid #eee', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedDept === f.properties.code ? '#eff6ff' : '#ffffff'
                }}
              >
                <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {f.properties.code} - {f.properties.nom}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Appartement: <strong>{f.properties.prix_m2_appt ? Math.round(f.properties.prix_m2_appt) + '€' : 'N/A'}</strong></span>
                  <span>Maison: <strong>{f.properties.prix_m2_maison ? Math.round(f.properties.prix_m2_maison) + '€' : 'N/A'}</strong></span>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section style={{ flex: 1, position: 'relative' }}>
        <MapContainer data={data} selectedDepartment={selectedDept} />
      </section>
    </main>
  );
}