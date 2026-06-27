"use client";

import { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import bbox from '@turf/bbox';

export default function MapContainer({ data, selectedDepartment, onDepartmentClick, communesData }: any) {
  const mapRef = useRef<MapRef>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  // --- Zoom automatique ---
  useEffect(() => {
    if (selectedDepartment && data?.features) {
      const feature = data.features.find((f: any) => f.properties.code === selectedDepartment);
      if (feature && mapRef.current) {
        const [minLng, minLat, maxLng, maxLat] = bbox(feature);
        mapRef.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 50, duration: 1000 });
        setIsZoomedIn(true);
      }
    }
  }, [selectedDepartment, data]);

  // --- Gestion du Hover ---
  const onMouseMove = (e: any) => {
    if (e.features && e.features.length > 0) {
      if (hoveredId) mapRef.current?.setFeatureState({ source: 'my-data', id: hoveredId }, { hover: false });
      const newHoveredId = e.features[0].id;
      mapRef.current?.setFeatureState({ source: 'my-data', id: newHoveredId }, { hover: true });
      setHoveredId(newHoveredId);
    }
  };

  const onMouseLeave = () => {
    if (hoveredId) mapRef.current?.setFeatureState({ source: 'my-data', id: hoveredId }, { hover: false });
    setHoveredId(null);
  };

  const handleMoveEnd = (e: any) => {
    setIsZoomedIn(e.target.getZoom() >= 7);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>

{/* --- DEBUGGER VISUEL --- */}
      {isZoomedIn && communesData?.features?.[0] && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 1,
          background: 'white', padding: '10px', borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)', pointerEvents: 'auto'
        }}>
          <strong>Debug Commune 0 :</strong>
          <pre style={{ fontSize: '12px' }}>
            {JSON.stringify(communesData.features[0].properties, null, 2)}
          </pre>
        </div>
      )}




      <Map
        ref={mapRef}
        initialViewState={{ longitude: 2.2137, latitude: 46.2276, zoom: 5.5 }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        interactiveLayerIds={['data-layer']}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMoveEnd={handleMoveEnd}
        onClick={(e) => {
          if (e.features && e.features.length > 0) onDepartmentClick(e.features[0].properties?.code);
        }}
      >
        {/* Source des Départements */}
       {data && data.features ? (
      <Source id="my-data" type="geojson" data={data} generateId={true}>
        <Layer
          id="data-layer"
          type="fill"
          paint={{
            'fill-color': [
              'interpolate', 
              ['linear'], 
              ['coalesce', ['to-number', ['get', 'prix_m2_moyen']], 0],
              1500, '#2ecc71', 3500, '#f1c40f', 6000, '#e74c3c'
            ],
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.9, 0.7],
            'fill-outline-color': '#ffffff'
          }}
        />
      </Source>
    ) : null}

        {/* 2. Sécurise la source des communes */}
    {isZoomedIn && communesData && communesData.features ? (
      <Source 
        key={`communes-${selectedDepartment}`}
        id="communes-source" 
        type="geojson" 
        data={communesData}
      >
      <Layer
  id="communes-layer"
  type="fill"
  paint={{
    'fill-color': [
      'interpolate', 
      ['linear'], 
      ['coalesce', ['to-number', ['get', 'prix_m2']], 0],
      // Échelle optimisée : 1000 à 10 000 €
      1000, '#1e8449',  // Vert très foncé (très bas)
      2000, '#27ae60',  // Vert standard
      2500, '#a2d149',  // Vert lime
      3000, '#f1c40f',  // Jaune (seuil de transition)
      5000, '#e67e22',  // Orange
      7500, '#d35400',  // Orange foncé
      10000, '#c0392b'  // Rouge vif (très haut)
    ],
    'fill-opacity': [
      'case',
      ['boolean', ['get', 'is_estimated'], false], 0.4, 
      0.8                                             
    ],
    'fill-outline-color': '#ffffff'
  }}
/>
      </Source>
    ) : null}
      </Map>
    </div>
  );
}