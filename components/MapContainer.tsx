"use client";

import { useState, useRef, useEffect } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import bbox from '@turf/bbox';

export default function MapContainer({ 
  data, 
  communesData, 
  selectedDepartment,
  onResetSelection,
  onDepartmentClick // Ajout de la nouvelle prop
}: { 
  data: any, 
  communesData: any, 
  selectedDepartment: string | null,
  onResetSelection: () => void,
  onDepartmentClick: (code: string) => void // Type pour la nouvelle prop
}) {
  const mapRef = useRef<MapRef>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDepartment && data) {
      const feature = data.features.find((f: any) => f.properties.code === selectedDepartment);
      if (feature) {
        const [minLng, minLat, maxLng, maxLat] = bbox(feature);
        mapRef.current?.fitBounds(
          [[minLng, minLat], [maxLng, maxLat]], 
          { padding: 50, duration: 1000 }
        );
      }
    }
  }, [selectedDepartment, data]);

  

  const onMouseMove = (e: any) => {
    if (e.features && e.features.length > 0) {
      const newHoveredId = e.features[0].id;
      if (hoveredId !== newHoveredId) {
        if (hoveredId) mapRef.current?.setFeatureState({ source: 'my-data', id: hoveredId }, { hover: false });
        mapRef.current?.setFeatureState({ source: 'my-data', id: newHoveredId }, { hover: true });
        setHoveredId(newHoveredId);
      }
    }
  };

  const onMouseLeave = () => {
    if (hoveredId) mapRef.current?.setFeatureState({ source: 'my-data', id: hoveredId }, { hover: false });
    setHoveredId(null);
  };

  // Dans votre MapContainer.tsx, améliorez handleMoveEnd :
const handleMoveEnd = (e: any) => {
  const map = e.target;
  const zoom = map.getZoom();
  
  if (zoom >= 7) {
    const center = map.getCenter();
    const features = map.queryRenderedFeatures(map.project(center), { layers: ['data-layer'] });
    
    if (features.length > 0) {
      const deptCode = features[0].properties.code;
      // VÉRIFICATION CRUCIALE : 
      // On ne change le département que si c'est VRAIMENT un nouveau département
      if (deptCode !== selectedDepartment) {
        onDepartmentClick(deptCode);
      }
    }
  } else if (zoom < 7 && selectedDepartment !== null) {
    onResetSelection();
  }
};


  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 2.2137, latitude: 46.2276, zoom: 5.5 }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMoveEnd={handleMoveEnd}
        interactiveLayerIds={['data-layer']}
        // Gestion du clic sur la carte
        onClick={(e) => {
  // 1. Vérifier si des features existent
  if (e.features && e.features.length > 0) {
    // 2. Extraire la feature en forçant le typage vers 'any' pour éviter l'erreur TypeScript
    const feature = e.features[0] as any;
    
    // 3. Vérifier que 'properties' et 'code' existent avant d'appeler la fonction
    if (feature.properties?.code) {
      onDepartmentClick(feature.properties.code);
    }
  }
}}
      >
       {data && data.features && data.features.length > 0 && (
          <Source id="my-data" type="geojson" data={data} generateId={true}>
            <Layer
              id="data-layer"
              type="fill"
              paint={{
                'fill-color': [
                  'case',
                  ['==', ['coalesce', ['get', 'prix_m2_appt'], 0], 0], 
                  '#e0e0e0',
                  ['interpolate', ['linear'], ['coalesce', ['get', 'prix_m2_appt'], 0], 
                    1500, '#2ecc71', 3000, '#f1c40f', 6000, '#e74c3c'
                  ]
                ],
                'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false], 1.0, 0.8
                ]
              }}
            />
            <Layer id="data-outline" type="line" paint={{ 'line-color': '#ffffff', 'line-width': 1 }} />
          </Source>
        )}

        {communesData && (
          <Source id="communes-data" type="geojson" data={communesData}>
            <Layer
              id="communes-layer"
              type="line"
              paint={{ 'line-color': '#000000', 'line-width': 0.5, 'line-opacity': 0.4 }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}