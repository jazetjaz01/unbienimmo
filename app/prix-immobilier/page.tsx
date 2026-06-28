"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Building2, Home, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
interface FeatureProperties {
  code: string;
  nom: string;
  prix_m2_appt?: number;
  prix_m2_maison?: number;
  est_loyer_appt?: number;
  est_loyer_maison?: number;
}

interface Feature {
  id: string;
  properties: FeatureProperties;
}

const MapContainer = dynamic(() => import('@/components/MapContainer'), {
  ssr: false,
  loading: () => <p>Chargement de la carte en cours...</p>,
});

export default function Page() {
  const [data, setData] = useState<{ features: Feature[] } | null>(null);
  const [communesData, setCommunesData] = useState<any>(null);
  const [cityDetails, setCityDetails] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setSelectedCity(null);
    setSelectedDept(null);
    setCityDetails(null);
  };
  
  const handleBackToDept = () => {
    setSelectedCity(null);
    setCityDetails(null);
  };

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

  useEffect(() => {
    if (!selectedDept) {
      setCommunesData(null);
      return;
    }
    async function fetchCommunes() {
      try {
        const res = await fetch(`/api/communes/${selectedDept}`);
        if (!res.ok) throw new Error("Erreur chargement communes");
        const json = await res.json();
        setCommunesData(json);
      } catch (err) { console.error(err); }
    }
    fetchCommunes();
  }, [selectedDept]);

  useEffect(() => {
    if (selectedCity?.properties?.code) {
      async function fetchCityDetails() {
        try {
          const res = await fetch(`/api/communes/details/${selectedCity.properties.code}`);
          const json = await res.json();
          setCityDetails(json);
        } catch (err) { console.error("Erreur chargement détails ville", err); }
      }
      fetchCityDetails();
    }
  }, [selectedCity]);

  if (error) return <div>Erreur : {error}</div>;
  if (!data) return <div>Chargement des données...</div>;

  const selectedDeptName = data?.features.find(f => f.properties.code === selectedDept)?.properties.nom;

  return (
    <main style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <section style={{ width: '650px', padding: '18px', borderRight: '1px solid #e5e7eb', overflowY: 'auto', backgroundColor: '#F5F5F5' }}>
        
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink onClick={handleReset} style={{ cursor: 'pointer' }}>Accueil</BreadcrumbLink></BreadcrumbItem>
            {selectedDept && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink onClick={handleBackToDept} style={{ cursor: 'pointer' }}>{selectedDeptName}</BreadcrumbLink></BreadcrumbItem>
              </>
            )}
            {selectedCity && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>{selectedCity.properties.nom}</BreadcrumbPage></BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {selectedCity ? (
  // À placer dans ton bloc conditionnel {selectedCity ? (...)}
<div className="flex flex-col space-y-6 rounded-xs p-4 bg-white">
  {/* En-tête */}
  <div className="space-y-1 ">
    <h1 className="text-2xl font-semibold tracking-wide text-gray-900">
      Prix immobilier à {selectedCity.properties.nom}
    </h1>
    <p className="text-sm text-muted-foreground">
      Estimations de prix Unbienimmo au {new Date().toLocaleDateString('fr-FR')}
    </p>
  </div>

  <div className="grid grid-cols-1 gap-4">
  {/* Bloc Appartement */}
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <div className="flex items-center gap-3 font-semibold text-gray-900">
      <Building2 className="w-5 h-5 text-gray-500" />
      <span>Appartement</span>
    </div>
    <div className="text-lg font-bold">
      {cityDetails?.prix_m2_appt ? `${Math.round(cityDetails.prix_m2_appt).toLocaleString('fr-FR')} €/m²` : 'N/A'}
    </div>
  </div>

  {/* Bloc Maison */}
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <div className="flex items-center gap-3 font-semibold text-gray-900">
      <Home className="w-5 h-5 text-gray-500" />
      <span>Maison</span>
    </div>
    <div className="text-lg font-bold">
      {cityDetails?.prix_m2_maison ? `${Math.round(cityDetails.prix_m2_maison).toLocaleString('fr-FR')} €/m²` : 'N/A'}
    </div>
  </div>
</div>

  {/* Actions */}
  <div className="flex flex-col gap-3">
    <Button className=" bg-teal-700 hover:bg-teal-800 h-12 text-base">
      Estimer un bien en ligne
    </Button>
    <Button variant="outline" className="w-full border-blue-700 text-blue-700 hover:bg-blue-50 h-12 text-base">
      Obtenir les prix de vente
    </Button>
    <Button variant="link" className="text-blue-700 p-0 justify-start h-auto mt-2">
      Comparer les professionnels <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  </div>
</div>
) : (

          <>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'black', fontWeight: '600' }}>Carte des prix immobiliers</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ccc', color: 'black' }}>
                  <th style={{ textAlign: 'left', padding: '12px 4px' }}>Nom</th>
                  <th style={{ textAlign: 'right', padding: '12px 4px' }}>Prix m2 <br/>Appt</th>
                  <th style={{ textAlign: 'right', padding: '12px 4px' }}>Prix m2 <br/>Maison</th>
                </tr>
              </thead>
              <tbody>
                {data.features
                  .filter((f) => f.properties.prix_m2_appt || f.properties.prix_m2_maison)
                  .map((f) => (
                    <tr key={f.properties.code || f.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 4px', color: 'black', cursor: 'pointer', fontWeight: '600' }} onClick={() => setSelectedDept(f.properties.code)}>
                        {f.properties.nom}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 4px' }}>{f.properties.prix_m2_appt ? Math.round(f.properties.prix_m2_appt).toLocaleString('fr-FR') + ' €' : '-'}</td>
                      <td style={{ textAlign: 'right', padding: '12px 4px' }}>{f.properties.prix_m2_maison ? Math.round(f.properties.prix_m2_maison).toLocaleString('fr-FR') + ' €' : '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      <section style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
          data={data} 
          communesData={communesData} 
          selectedDepartment={selectedDept} 
          selectedCity={selectedCity}
          onDepartmentClick={(code: string) => setSelectedDept(code)}
          onCityClick={(city: any) => setSelectedCity(city)}
        />
      </section>
    </main>
  );
}