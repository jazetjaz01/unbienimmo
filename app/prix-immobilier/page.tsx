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
import { Building2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EvolutionChart } from "@/components/EvolutionChart";

interface FeatureProperties {
  code: string;
  nom: string;
  prix_m2_appt?: number;
  prix_m2_maison?: number;
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
  const [historyData, setHistoryData] = useState<{ appt: any[], maison: any[] } | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setSelectedCity(null);
    setSelectedDept(null);
    setCityDetails(null);
    setHistoryData(null);
  };
  
  const handleBackToDept = () => {
    setSelectedCity(null);
    setCityDetails(null);
    setHistoryData(null);
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
      const code = selectedCity.properties.code;
      
      // 1. Charger les détails
      fetch(`/api/communes/details/${code}`).then(res => res.json()).then(setCityDetails);

      // 2. Charger et transformer l'historique
      Promise.all([
        fetch(`/api/communes/historique/${code}?type=appt`).then(r => r.json()),
        fetch(`/api/communes/historique/${code}?type=maison`).then(r => r.json())
      ]).then(([appt, maison]) => {
        // Fonction de nettoyage pour transformer les chaînes en nombres
        const clean = (list: any[]) => (Array.isArray(list) ? list.map(item => ({
          annee: Number(item.annee),
          prix_m2: Number(item.prix_m2)
        })) : []);

        setHistoryData({ 
          appt: clean(appt), 
          maison: clean(maison) 
        });
      });
    }
  }, [selectedCity]);

  if (!data) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  const selectedDeptName = data?.features.find(f => f.properties.code === selectedDept)?.properties.nom;

  const ConfidenceIndicator = ({ score, count }: { score: number; count: number }) => (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted-foreground mr-1">Indice de confiance</span>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i <= score ? "bg-teal-600" : "bg-gray-200"}`} />
        ))}
      </div>
      <span className="text-[10px] text-gray-500 font-medium">Basé sur {count.toLocaleString('fr-FR')} transactions</span>
    </div>
  );

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
          <div className="flex flex-col space-y-6 rounded-xs p-4 bg-white">
            <div className="space-y-1 ">
              <h1 className="text-2xl font-semibold tracking-wide text-gray-900">Prix immobilier à {selectedCity.properties.nom}</h1>
              <p className="text-sm text-muted-foreground">Estimations au {new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium text-sm text-gray-600"><Building2 className="w-4 h-4" /> Appartement</div>
                <div className="text-lg font-bold text-gray-900">{cityDetails?.prix_m2_appt ? `${Math.round(cityDetails.prix_m2_appt).toLocaleString('fr-FR')} €/m²` : 'N/A'}</div>
                {cityDetails?.conf_appt !== undefined && <ConfidenceIndicator score={cityDetails.conf_appt} count={cityDetails.nb_trans_appt || 0} />}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium text-sm text-gray-600"><Home className="w-4 h-4" /> Maison</div>
                <div className="text-lg font-bold text-gray-900">{cityDetails?.prix_m2_maison ? `${Math.round(cityDetails.prix_m2_maison).toLocaleString('fr-FR')} €/m²` : 'N/A'}</div>
                {cityDetails?.conf_maison !== undefined && <ConfidenceIndicator score={cityDetails.conf_maison} count={cityDetails.nb_trans_maison || 0} />}
              </div>
            </div>

            <div className="flex flex-col gap-3 items-center">
              <Link href="/estimation-immobiliere">
                <Button variant="outline" className="border-teal-700 text-teal-700 hover:bg-teal-50 h-12 text-base w-fit px-8 rounded-xs">
                  Estimer un bien en ligne
                </Button>
              </Link>
            </div>

            {historyData && (historyData.appt.length > 0 || historyData.maison.length > 0) && (
              <EvolutionChart dataAppt={historyData.appt} dataMaison={historyData.maison} />
            )}

            
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
  {(selectedDept 
    ? (Array.isArray(communesData) ? communesData : communesData?.features || []) 
    : data.features
  ).map((f: any) => {
    // On extrait les variables de manière flexible
    // Si f.properties existe, on regarde dedans, sinon on regarde directement dans f
    const source = f.properties || f; 
// AJOUTE CETTE LIGNE ICI
    console.log("Structure de la commune :", { 
        nom: source.nom, 
        prixAppt: source.prix_m2_appt, 
        prixMaison: source.prix_m2_maison,
        objetComplet: source 
    });


    
    const nom = source.nom || "Inconnu";
    const prixAppt = source.prix_m2_appt;
    const prixMaison = source.prix_m2_maison;
    const code = source.code || f.id;

    return (
      <tr key={code} style={{ borderBottom: '1px solid #eee' }}>
        <td 
          style={{ padding: '12px 4px', color: 'black', cursor: 'pointer', fontWeight: '600' }} 
          onClick={() => {
            if (!selectedDept) {
              setSelectedDept(code);
            } else {
              // On reconstruit un objet propre pour la suite
              setSelectedCity({
                properties: { code, nom, prix_m2_appt: prixAppt, prix_m2_maison: prixMaison }
              });
            }
          }}
        >
          {nom}
        </td>
        
        {/* Affichage des prix */}
        <td style={{ textAlign: 'right', padding: '12px 4px' }}>
          {prixAppt ? Math.round(prixAppt).toLocaleString('fr-FR') + ' €' : '-'}
        </td>
        <td style={{ textAlign: 'right', padding: '12px 4px' }}>
          {prixMaison ? Math.round(prixMaison).toLocaleString('fr-FR') + ' €' : '-'}
        </td>
      </tr>
    );
  })}
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