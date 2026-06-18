"use client";

import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import Map, { Source, Layer, NavigationControl, Popup } from "react-map-gl/mapbox";
import { useSearchParams, useRouter } from "next/navigation";
import CadastreLayer from "@/components/CadastreLayer";
import AddressSearch from "@/components/AdressSearch";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, List, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

// Composant pour afficher chaque bien avec chargement d'adresse différé
function BienItem({ feature }: { feature: any }) {
  const [adresse, setAdresse] = useState<string>("Chargement...");
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

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

  const isTerrain = feature.properties.type.toUpperCase().includes("TERRAIN");
  const prix = feature.properties.prix;
  const capitalize = (str: string) => (!str ? "" : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());

  return (
    <div ref={itemRef} className="p-4 hover:bg-cyan-50 cursor-pointer border-b">
      <p className="text-xs font-bold text-gray-500 mb-1 truncate">{adresse}</p>
      <p className="text-sm font-semibold text-gray-900 mb-1">
        {capitalize(feature.properties.type)} 
        {!isTerrain && ` • ${feature.properties.pieces || 0} p • ${feature.properties.surface || 0} m²`}
        {isTerrain && ` • ${feature.properties.surface || 0} m²`}
      </p>
      <span className="font-black text-cyan-700 text-sm">
        {prix && prix > 0 ? `${prix.toLocaleString()} €` : "Prix non communiqué"}
      </span>
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

  const capitalize = (str: string) => (!str ? "" : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });

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
        
        <div className={`${showList ? "fixed inset-0 z-20 mt-16" : "hidden"} md:flex md:w-[350px] bg-white border-r shadow-xl flex-col h-full overflow-y-auto`}>
          <div className="p-6 border-b bg-gray-50/50"><h1 className="text-lg font-bold text-gray-900">Biens vendus</h1></div>
          <div className="divide-y">
            {ventes.features.slice(0, 10).map((f: any, i: number) => (
              <BienItem key={i} feature={f} />
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
    className="rounded-lg shadow-xl"
  >
    <div className="w-[300px] p-4 font-sans">
      {/* 1. Adresse très lisible */}
      <h2 className="text-sm font-semibold text-gray-900 leading-tight mb-1">
        {popupInfo.adresse}
      </h2>

      {/* 2. Caractéristiques sur une seule ligne */}
      <p className="text-sm text-gray-600 mb-3">
  {capitalize(popupInfo.features[currentIndex].properties.type)}
  
  {/* On n'affiche les pièces que si ce n'est PAS un terrain */}
  {!popupInfo.features[currentIndex].properties.type.toUpperCase().includes("TERRAIN") && 
    ` • ${popupInfo.features[currentIndex].properties.pieces} pièces`}
  
  {/* On n'affiche la surface que si elle est supérieure à 0 */}
  {popupInfo.features[currentIndex].properties.surface > 0 && 
    ` • ${popupInfo.features[currentIndex].properties.surface} m²`}
</p>

      {/* 3. Prix et date sur la même ligne */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-lg font-extrabold text-gray-900">
          {popupInfo.features[currentIndex].properties.prix?.toLocaleString()} €
        </span>
        <span className="text-xs text-gray-500 italic">
          Vendu en {formatDate(popupInfo.features[currentIndex].properties.date).toLowerCase()}
        </span>
      </div>

      {/* 4. Lien d'action ("Voir le prix actualisé") */}
      <a 
        href="/estimation" 
        className="block text-sm  font-medium hover:underline mb-4"
        onClick={(e) => { e.preventDefault(); /* Ton action ici */ }}
      >
        Demander une estimation personnalisée
      </a>

      {/* 5. Navigation discrète */}
      {popupInfo.features.length > 1 && (
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button onClick={() => setCurrentIndex(p => (p === 0 ? popupInfo.features.length - 1 : p - 1))} 
                  className="text-xs text-gray-400 hover:text-gray-600">◀</button>
          <span className="text-[10px] font-bold text-gray-400">
            {currentIndex + 1} / {popupInfo.features.length}
          </span>
          <button onClick={() => setCurrentIndex(p => (p === popupInfo.features.length - 1 ? 0 : p + 1))} 
                  className="text-xs text-gray-400 hover:text-gray-600">▶</button>
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