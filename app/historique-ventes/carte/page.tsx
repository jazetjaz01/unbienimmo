"use client";

import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import Map, { Source, Layer, NavigationControl, Popup } from "react-map-gl/mapbox";
import { useSearchParams, useRouter } from "next/navigation";
import CadastreLayer from "@/components/CadastreLayer";
import AddressSearch from "@/components/AdressSearch";
import { MapPin, List, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const lat = parseFloat(searchParams.get("lat") || "42.6701");
  const lng = parseFloat(searchParams.get("lng") || "2.8371");
  const type = searchParams.get("type") || "tous";

  const [viewState, setViewState] = useState({ longitude: lng, latitude: lat, zoom: 16 });
  const [ventes, setVentes] = useState<any>({ type: "FeatureCollection", features: [] });
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [showList, setShowList] = useState(false);

  const capitalize = (str: string) => (!str ? "" : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });

  const handleNewSearch = (newLat: number, newLng: number) => {
    router.push(`/historique-ventes/carte?lat=${newLat}&lng=${newLng}`);
  };

  const fetchVentesInBounds = useCallback(() => {
    if (!mapRef.current) return;
    const zoom = mapRef.current.getZoom();
    if (zoom < 12) {
      setVentes({ type: "FeatureCollection", features: [] });
      return;
    }

    try {
      const b = mapRef.current.getBounds();
      const boundsString = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
      fetch(`/api/historiques/ventes?bounds=${boundsString}&type=${type}&zoom=${zoom}&limit=100`)
        .then((res) => res.json())
        .then((data) => setVentes(data || { type: "FeatureCollection", features: [] }))
        .catch((err) => console.error("Erreur fetch:", err));
    } catch (e) {
      console.error("Erreur bounds:", e);
    }
  }, [type]);

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
      <div className="w-full p-4 bg-white border-b z-50">
        <div className="max-w-2xl"><AddressSearch onSearch={handleNewSearch} /></div>
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        <button className="md:hidden absolute top-4 left-4 z-30 bg-white p-3 rounded-full shadow-lg border" onClick={() => setShowList(!showList)}>
          {showList ? <X size={20} /> : <List size={20} />}
        </button>
        <div className={`${showList ? "fixed inset-0 z-20 mt-16" : "hidden"} md:flex md:w-[350px] bg-white border-r shadow-xl flex-col h-full overflow-y-auto`}>
          <div className="p-6 border-b bg-gray-50/50"><h1 className="text-lg font-bold text-gray-900">Biens vendus</h1></div>
          <div className="divide-y">
  {ventes.features.map((f: any, i: number) => (
    <div key={i} className="p-4 hover:bg-cyan-50 cursor-pointer">
      <p className="text-xs text-gray-500 mb-1">
        {capitalize(f.properties.type)} • {f.properties.pieces} p • {f.properties.surface} m²
      </p>
      <div className="flex justify-between items-center">
        <span className="font-black text-cyan-700">{f.properties.prix?.toLocaleString()} €</span>
        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold uppercase text-gray-600">
          {formatDate(f.properties.date)}
        </span>
      </div>
    </div>
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
  // On vérifie que e.features existe ET contient au moins un élément
  if (e.features && e.features.length > 0) {
    const layerId = e.features[0]?.layer?.id;
    
    if (layerId === 'clusters') {
      onClusterClick(e);
    } else {
      onMapClick(e);
    }
  } else {
    // Si on clique sur le vide, on ferme juste les popups si nécessaire
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
  <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} onClose={() => setPopupInfo(null)}>
    <div className="w-[200px] p-2 font-sans text-sm">
      <h2 className="font-semibold mb-2">{popupInfo.adresse}</h2>
      
      {/* Détails du produit */}
      <div className="mb-2 text-gray-700">
        {capitalize(popupInfo.features[currentIndex].properties.type)} • 
        {popupInfo.features[currentIndex].properties.pieces} p • 
        {popupInfo.features[currentIndex].properties.surface} m²
      </div>
      
      <div className="text-lg font-bold text-cyan-700">
        {popupInfo.features[currentIndex].properties.prix?.toLocaleString()} €
      </div>
      
      <div className="text-xs text-gray-500 mt-1">
        Vendu en {formatDate(popupInfo.features[currentIndex].properties.date)}
      </div>

      {/* Navigation si plusieurs biens au même endroit */}
      {popupInfo.features.length > 1 && (
        <div className="flex justify-between border-t pt-2 mt-2">
          <button onClick={() => setCurrentIndex(p => (p === 0 ? popupInfo.features.length - 1 : p - 1))} className="text-[10px] bg-gray-100 px-2 py-1 rounded">◀</button>
          <span className="text-[10px] font-bold">{currentIndex + 1} / {popupInfo.features.length}</span>
          <button onClick={() => setCurrentIndex(p => (p === popupInfo.features.length - 1 ? 0 : p + 1))} className="text-[10px] bg-gray-100 px-2 py-1 rounded">▶</button>
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
  return <Suspense fallback={<div>Chargement...</div>}><MapContent /></Suspense>;
}