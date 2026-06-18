"use client";

import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import Map, { Source, Layer, NavigationControl, Popup } from "react-map-gl/mapbox";
import { useSearchParams, useRouter } from "next/navigation";
import CadastreLayer from "@/components/CadastreLayer";
import AddressSearch from "@/components/AdressSearch";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, List, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

const simplifyType = (type: string) => {
  const upperType = type.toUpperCase();
  if (upperType.includes("TERRAIN")) return "Terrain";
  if (upperType.includes("MAISON")) return "Maison";
  if (upperType.includes("APPARTEMENT")) return "Appartement";
  return type;
};

// Fonction utilitaire pour calculer la distance à vol d'oiseau en km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Rayon de la terre en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

// Composant pour afficher chaque bien avec chargement d'adresse différé
// Composant pour afficher chaque bien avec chargement d'adresse différé
function BienItem({ feature, userLat, userLng, onClick }: { feature: any, userLat: number, userLng: number, onClick: () => void }) {
  const [adresse, setAdresse] = useState<string>("Chargement...");
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // Formatage spécifique pour le rendu de la date
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleDateString("fr-FR", { month: "long" });
    const year = date.getFullYear();
    return `Vendu en ${month} ${year}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setIsVisible(true);
    });
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const [lon, lat] = feature.geometry.coordinates;
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`)
      .then(res => res.json())
      .then(data => setAdresse(data.features[0]?.properties.label || "Adresse non trouvée"))
      .catch(() => setAdresse("Erreur chargement"));
  }, [isVisible, feature]);

  const p = feature.properties;
  const isTerrain = p.type.toUpperCase().includes("TERRAIN");
  const distance = calculateDistance(userLat, userLng, feature.geometry.coordinates[1], feature.geometry.coordinates[0]);

  return (
    <div ref={itemRef} onClick={onClick} className="p-4 hover:bg-cyan-50 cursor-pointer border-b">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-gray-500 mb-1 truncate">{adresse}</p>
        <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
          {distance} km
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-1">
        {simplifyType(p.type)}
        {!isTerrain && p.pieces > 0 && ` • ${p.pieces} p`}
        {p.surface > 0 && ` • ${p.surface} m²`}
      </p>
      <div className="flex justify-between items-end">
        <span className="text-cyan-700 text-sm font-semibold">
          {p.prix && p.prix > 0 ? `${p.prix.toLocaleString()} €` : "Prix non communiqué"}
        </span>
        {/* Affichage de la date au format demandé */}
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          {formatDateLabel(p.date)}
        </span>
      </div>
    </div>
  );
}

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const lat = parseFloat(searchParams.get("lat") || "42.6701");
  const lng = parseFloat(searchParams.get("lng") || "2.8371");
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type")?.split(",") || ["tous"]
  );

  const [viewState, setViewState] = useState({ longitude: lng, latitude: lat, zoom: 16 });
  const [ventes, setVentes] = useState<any>({ type: "FeatureCollection", features: [] });
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showList, setShowList] = useState(false);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });

  // Fonction appelée au clic sur un bien dans la liste
  const handleItemClick = (feature: any) => {
    const [lon, lat] = feature.geometry.coordinates;
    mapRef.current?.flyTo({ center: [lon, lat], zoom: 17 });
    
    setPopupInfo({ 
      longitude: lon, 
      latitude: lat, 
      features: [feature], 
      adresse: "Chargement de l'adresse..." 
    });
    setCurrentIndex(0);

    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`)
      .then(res => res.json())
      .then(data => setPopupInfo((prev: any) => ({ ...prev, adresse: data.features[0]?.properties.label || "Adresse non trouvée" })));
  };

  const handleNewSearch = (newLat: number, newLng: number) => {
    router.push(`/historique-ventes/carte?lat=${newLat}&lng=${newLng}&type=${selectedTypes.join(",")}`);
  };

  const handleTypeToggle = (type: string) => {
    let newTypes: string[];
    if (type === "tous") {
      newTypes = ["tous"];
    } else {
      const filtered = selectedTypes.filter(t => t !== "tous");
      newTypes = filtered.includes(type) 
        ? filtered.filter(t => t !== type) 
        : [...filtered, type];
      if (newTypes.length === 0) newTypes = ["tous"];
    }
    setSelectedTypes(newTypes);
    router.push(`/historique-ventes/carte?lat=${lat}&lng=${lng}&type=${newTypes.join(",")}`);
  };

  const fetchVentesInBounds = useCallback(() => {
    if (!mapRef.current) return;
    const zoom = mapRef.current.getZoom();
    if (zoom < 12) {
      setVentes({ type: "FeatureCollection", features: [] });
      return;
    }

    const b = mapRef.current.getBounds();
    const boundsString = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
    const typeQuery = selectedTypes.join(",");
    fetch(`/api/historiques/ventes?bounds=${boundsString}&type=${typeQuery}&zoom=${zoom}&limit=100`)
      .then((res) => res.json())
      .then((data) => setVentes(data || { type: "FeatureCollection", features: [] }))
      .catch((err) => console.error("Erreur fetch:", err));
  }, [selectedTypes]);

  const handleMoveEnd = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(fetchVentesInBounds, 500);
  };

  const onClusterClick = (event: any) => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;
    const mapboxMap = mapRef.current.getMap();
    mapboxMap.getSource("ventes").getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
      if (err) return;
      mapboxMap.easeTo({ center: feature.geometry.coordinates, zoom: zoom });
    });
  };

  const onMapClick = useCallback((event: any) => {
    const features = event.features;
    if (!features || features.length === 0) return;
    setPopupInfo({ 
      longitude: features[0].geometry.coordinates[0], 
      latitude: features[0].geometry.coordinates[1], 
      features: features, 
      adresse: "Recherche de l'adresse..." 
    });
    setCurrentIndex(0);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${features[0].geometry.coordinates[0]}&lat=${features[0].geometry.coordinates[1]}`)
      .then(res => res.json())
      .then(data => setPopupInfo((prev: any) => ({ ...prev, adresse: data.features[0]?.properties.label || "Adresse non trouvée" })));
  }, []);

  useEffect(() => {
    fetchVentesInBounds();
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [fetchVentesInBounds]);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="w-full p-4 bg-white border-b z-50 flex flex-wrap gap-4 items-center">
        <div className="max-w-xl flex-1"><AddressSearch onSearch={handleNewSearch} /></div>
        <div className="flex gap-4">
          {["tous", "maison", "appartement", "terrain"].map((t) => (
            <div key={t} className="flex items-center space-x-2">
              <Checkbox id={t} checked={selectedTypes.includes(t)} onCheckedChange={() => handleTypeToggle(t)} />
              <label htmlFor={t} className="text-xs font-medium capitalize cursor-pointer">{t}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        <button className="md:hidden absolute top-4 left-4 z-30 bg-white p-3 rounded-full shadow-lg border" onClick={() => setShowList(!showList)}>
          {showList ? <X size={20} /> : <List size={20} />}
        </button>
        
        <div className={`${showList ? "fixed inset-0 z-20 mt-16" : "hidden"} md:flex md:w-[350px] bg-white border-r  flex-col h-full overflow-y-auto`}>
          <div className="p-6 border-b bg-gray-50/50">
            <h1 className="font-semibold text-sm uppercase">Liste des biens vendus</h1>
            <h2 className="font-semibold text-sm text-justify text-slate-500 mt-2">Données valeurs foncières DVF publiées et produites par la Direction Générale des Finances Publiques</h2>
          </div>
          <div className="divide-y">
            {ventes.features.slice(0, 8).map((f: any, i: number) => (
              <BienItem key={i} feature={f} userLat={lat} userLng={lng} onClick={() => handleItemClick(f)} />
            ))}
          </div>
        </div>

        <div className="flex-1 relative">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            onMoveEnd={handleMoveEnd}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            interactiveLayerIds={["v-circle", "clusters"]}
            onClick={(e) => {
              if (e.features && e.features.length > 0) {
                const layerId = e.features[0]?.layer?.id;
                if (layerId === 'clusters') onClusterClick(e);
                else onMapClick(e);
              } else {
                setPopupInfo(null);
              }
            }}
          >
            <NavigationControl position="top-right" />
            <CadastreLayer lat={lat} lng={lng} />
            {ventes.features.length > 0 && (
              <Source id="ventes" type="geojson" data={ventes} cluster={true} clusterMaxZoom={14} clusterRadius={50}>
                <Layer id="clusters" type="circle" filter={["has", "point_count"]} paint={{ "circle-color": "#0891b2", "circle-radius": 20 }} />
                <Layer id="cluster-count" type="symbol" filter={["has", "point_count"]} layout={{ "text-field": "{point_count_abbreviated}", "text-size": 12 }} paint={{ "text-color": "#ffffff" }} />
                <Layer id="v-circle" type="circle" filter={["!", ["has", "point_count"]]} paint={{ "circle-radius": 7, "circle-color": "#0e7490", "circle-stroke-width": 2, "circle-stroke-color": "#ffffff" }} />
              </Source>
            )}
            
          {popupInfo && (
  <Popup 
    longitude={popupInfo.longitude} 
    latitude={popupInfo.latitude} 
    onClose={() => setPopupInfo(null)}
    className="mapbox-popup-custom"
    closeButton={true}
    closeOnClick={false}
  >
    <div className="w-[320px] bg-white rounded-xl shadow-2xl font-sans overflow-hidden border border-slate-100">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-[16px] font-extrabold text-slate-900 leading-snug pr-6">
          {popupInfo.adresse}
        </h2>
      </div>

      <div className="px-5 pb-5">
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-cyan-50 text-cyan-700 border border-cyan-100">
            {simplifyType(popupInfo.features[currentIndex].properties.type)}
          </span>
          {!popupInfo.features[currentIndex].properties.type.toUpperCase().includes("TERRAIN") && 
            popupInfo.features[currentIndex].properties.pieces > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
              {popupInfo.features[currentIndex].properties.pieces} p
            </span>
          )}
          {popupInfo.features[currentIndex].properties.surface > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
              {popupInfo.features[currentIndex].properties.surface} m²
            </span>
          )}
        </div>

        {/* Section Prix et Date harmonisée */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 tracking-wider">
              {popupInfo.features[currentIndex].properties.prix?.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-500">€</span>
          </div>
          {/* Remplacement par le format "Vendu en [mois] [année]" */}
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            {(() => {
              const date = new Date(popupInfo.features[currentIndex].properties.date);
              const month = date.toLocaleDateString("fr-FR", { month: "long" });
              const year = date.getFullYear();
              return `Vendu en ${month} ${year}`;
            })()}
          </div>
        </div>

        <a 
          href="/estimation-immobiliere" 
          className="block w-full text-center text-[13px] border hover:bg-cyan-600 hover:text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 transform active:scale-[0.97]"
        >
          Estimer mon bien gratuitement
        </a>
      </div>

      {popupInfo.features.length > 1 && (
        <div className="flex justify-between items-center px-5 py-3 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={() => setCurrentIndex(p => (p === 0 ? popupInfo.features.length - 1 : p - 1))} 
            className="text-[10px] font-black text-slate-400 hover:text-cyan-600 uppercase tracking-[0.2em] transition-colors"
          >
            Précédent
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span className="text-[10px] font-black text-slate-800">
              {currentIndex + 1} / {popupInfo.features.length}
            </span>
          </div>
          <button 
            onClick={() => setCurrentIndex(p => (p === popupInfo.features.length - 1 ? 0 : p + 1))} 
            className="text-[10px] font-black text-slate-400 hover:text-cyan-600 uppercase tracking-[0.2em] transition-colors"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  </Popup>
)}
          </Map>
        </div>
      </div>
    </div>
  );
}

export default function CartePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <MapContent />
    </Suspense>
  );
}