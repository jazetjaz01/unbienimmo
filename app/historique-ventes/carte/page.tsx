"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Map, { Source, Layer, NavigationControl, Popup } from "react-map-gl/mapbox";
import { useSearchParams, useRouter } from "next/navigation";
import CadastreLayer from "@/components/CadastreLayer";
import AddressSearch from "@/components/AdressSearch";
import { MapPin, List, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const lat = parseFloat(searchParams.get("lat") || "42.6701");
  const lng = parseFloat(searchParams.get("lng") || "2.8371");
  const type = searchParams.get("type") || "tous";

  const [ventes, setVentes] = useState<any>({ type: "FeatureCollection", features: [] });
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [adresses, setAdresses] = useState<Record<number, string>>({});
  const [showList, setShowList] = useState(false);

  const capitalize = (str: string) => (!str ? "" : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });

  const handleNewSearch = (newLat: number, newLng: number) => {
    router.push(`/historique-ventes/carte?lat=${newLat}&lng=${newLng}`);
  };





  
  useEffect(() => {


    
    if (isNaN(lat) || isNaN(lng)) return;
    const controller = new AbortController();
    
    
    fetch(`/api/historiques/ventes?lat=${lat}&lng=${lng}&type=${type}`, { signal: controller.signal })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        console.log("Données GeoJSON reçues :", data);
        setVentes(data || { type: "FeatureCollection", features: [] });
        setAdresses({});
        data?.features?.forEach((f: any, i: number) => {
          setTimeout(() => {
            fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${f.geometry.coordinates[0]}&lat=${f.geometry.coordinates[1]}`)
              .then(res => res.json())
              .then(addr => setAdresses(prev => ({ ...prev, [i]: addr.features[0]?.properties.label || "Adresse non trouvée" })));
          }, i * 300);
        });
      })
      .catch((err) => { if (err && err.name !== "AbortError") console.error(err); });
    return () => controller.abort();
  }, [lat, lng, type]);

  const onMapClick = useCallback((event: any) => {
    const features = event.features;
    if (!features || features.length === 0) return;
    setPopupInfo({ 
      longitude: features[0].geometry.coordinates[0], 
      latitude: features[0].geometry.coordinates[1], 
      features: features, 
      adresse: null 
    });
    setCurrentIndex(0);
    setIsFetchingAddress(true);
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${features[0].geometry.coordinates[0]}&lat=${features[0].geometry.coordinates[1]}`)
      .then(res => res.json())
      .then(data => setPopupInfo((prev: any) => ({ ...prev, adresse: data.features[0]?.properties.label })))
      .finally(() => setIsFetchingAddress(false));
  }, []);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="w-full p-4 bg-white border-b z-50">
        <div className="max-w-2xl">
          <AddressSearch onSearch={handleNewSearch} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <button className="md:hidden absolute top-4 left-4 z-30 bg-white p-3 rounded-full shadow-lg border" onClick={() => setShowList(!showList)}>
          {showList ? <X size={20} /> : <List size={20} />}
        </button>

        <div className={`${showList ? "fixed inset-0 z-20 mt-16" : "hidden"} md:flex md:w-[350px] bg-white border-r shadow-xl flex-col h-full overflow-y-auto`}>
          <div className="p-6 border-b bg-gray-50/50">
            <h1 className="text-lg font-bold text-gray-900 mb-4">Biens vendus</h1>
            <div className="flex gap-2 items-center text-sm">
              <MapPin size={16} className="text-cyan-700" /> Trouvez les prix de vente des biens par Etalab.
            </div>
          </div>
          <div className="divide-y">
            {ventes.features.map((f: any, i: number) => (
              <div key={i} className="p-4 hover:bg-cyan-50 cursor-pointer" onClick={() => setShowList(false)}>
                <p className="font-bold text-gray-800 text-sm mb-1">{adresses[i] || "Chargement..."}</p>
                <p className="text-xs text-gray-500 mb-2">{capitalize(f.properties.type)} • {f.properties.pieces} p • {f.properties.surface} m²</p>
                <div className="flex justify-between items-center">
                  <span className="font-black text-cyan-700">{f.properties.prix?.toLocaleString()} €</span>
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold uppercase">{formatDate(f.properties.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 relative">
          <Map
            initialViewState={{ longitude: lng, latitude: lat, zoom: 16 }}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            interactiveLayerIds={["v-circle"]}
            onClick={onMapClick}
          >
            <NavigationControl position="top-right" />
            <CadastreLayer lat={lat} lng={lng} />
            {ventes.features.length > 0 && (
              <Source id="ventes" type="geojson" data={ventes}>
                <Layer id="v-circle" type="circle" paint={{ "circle-radius": 7, "circle-color": "#0e7490", "circle-stroke-width": 2, "circle-stroke-color": "#ffffff" }} />
                <Layer id="v-label" type="symbol" layout={{ "text-field": ["concat", ["to-string", ["get", "prix"]], " €"], "text-size": 11, "text-offset": [0, -1.5], "text-anchor": "bottom", "text-optional": true }} paint={{ "text-color": "#1f2937", "text-halo-color": "#ffffff", "text-halo-width": 2 }} />
              </Source>
            )}
            {popupInfo && (
              <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} onClose={() => setPopupInfo(null)} className="custom-popup">
                <div className="w-[200px] p-2 font-sans">
                  <h2 className="text-sm font-semibold mb-2">{isFetchingAddress ? "Recherche..." : (popupInfo.adresse || "Adresse")}</h2>
                  <div className="text-sm font-semibold mb-2">
                    {capitalize(popupInfo.features[currentIndex].properties.type)} • {popupInfo.features[currentIndex].properties.pieces} p • {popupInfo.features[currentIndex].properties.surface} m²
                  </div>
                  <div className="text-lg font-bold text-cyan-700">{popupInfo.features[currentIndex].properties.prix?.toLocaleString()} €</div>
                  <div className="font-semibold mb-3">Vendu en {formatDate(popupInfo.features[currentIndex].properties.date)}</div>
                  
                  {popupInfo.features.length > 1 && (
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <button onClick={() => setCurrentIndex(p => (p === 0 ? popupInfo.features.length - 1 : p - 1))} className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold hover:bg-gray-200">◀ PRÉC.</button>
                      <span className="text-[10px] flex items-center font-bold">{currentIndex + 1} / {popupInfo.features.length}</span>
                      <button onClick={() => setCurrentIndex(p => (p === popupInfo.features.length - 1 ? 0 : p + 1))} className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold hover:bg-gray-200">SUIV. ▶</button>
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