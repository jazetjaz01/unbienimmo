"use client";

import { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import bbox from '@turf/bbox';

export default function MapContainer({ 
  data, 
  selectedDepartment, 
  selectedCity, 
  onDepartmentClick, 
  onCityClick, 
  communesData 
}: any) {
  const mapRef = useRef<MapRef>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // --- Zoom sur DEPARTEMENT ---
  useEffect(() => {
    if (selectedDepartment && !selectedCity && data?.features) {
      const feature = data.features.find((f: any) => f.properties.code === selectedDepartment);
      if (feature && mapRef.current) {
        const [minLng, minLat, maxLng, maxLat] = bbox(feature);
        mapRef.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 50, duration: 1000 });
      }
    }
  }, [selectedDepartment, selectedCity, data]);

  // --- Zoom sur VILLE (Commune) ---
  useEffect(() => {
    if (selectedCity && mapRef.current) {
      const [minLng, minLat, maxLng, maxLat] = bbox(selectedCity);
      mapRef.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 20, duration: 1000 });
    } else if (!selectedDepartment) {
      // Retour vue nationale
      mapRef.current?.flyTo({ center: [2.2137, 46.2276], zoom: 5.5, duration: 1000 });
    }
  }, [selectedCity, selectedDepartment]);

  const onMouseMove = (e: any) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      const sourceId = feature.layer.id === 'data-layer' ? 'my-data' : 'communes-source';
      
      const map = mapRef.current?.getMap();
      if (map && map.getSource(sourceId)) {
        if (hoveredId) map.setFeatureState({ source: sourceId, id: hoveredId }, { hover: false });
        map.setFeatureState({ source: sourceId, id: feature.id }, { hover: true });
        setHoveredId(feature.id);
      }
    }
  };

  const onMouseLeave = () => {
    const map = mapRef.current?.getMap();
    if (map && hoveredId) {
      ['my-data', 'communes-source'].forEach(src => {
        if (map.getSource(src)) {
          map.setFeatureState({ source: src, id: hoveredId }, { hover: false });
        }
      });
      setHoveredId(null);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 2.2137, latitude: 46.2276, zoom: 5.5 }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        interactiveLayerIds={['data-layer', 'communes-layer']}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
       onClick={(e) => {
  if (e.features && e.features.length > 0) {
    const feature = e.features[0];

    // --- CORRECTION : Vérification de sécurité pour la couche ---
    if (!feature.layer) return;

    if (feature.layer.id === 'data-layer') {
      onDepartmentClick(feature.properties?.code);
    } else if (feature.layer.id === 'communes-layer') {
      onCityClick(feature);
    }
  }
}}
      >
        <div style={{
          position: 'absolute', top: '20px', right: '20px', zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '12px',
          borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          fontSize: '12px', fontFamily: 'sans-serif', border: '1px solid #ccc'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Prix / m²</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { color: '#1e8449', label: '< 1 000 €' },
              { color: '#27ae60', label: '1 000 - 2 000 €' },
              { color: '#7fb800', label: '2 000 - 2 500 €' },
              { color: '#f1c40f', label: '2 500 - 3 000 €' },
              { color: '#c0392b', label: '> 3 000 €' }
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '15px', height: '15px', backgroundColor: item.color, marginRight: '8px' }}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {data && data.features && (
          <Source id="my-data" type="geojson" data={data} generateId={true}>
            <Layer
              id="data-layer"
              type="fill"
              paint={{
                'fill-color': [
                  'interpolate', ['linear'], ['coalesce', ['to-number', ['get', 'prix_m2_moyen']], 0],
                  1000, '#1e8449', 2000, '#27ae60', 3000, '#7fb800', 4000, '#f1c40f', 5000, '#c0392b'
                ],
                'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.9, 0.7],
                'fill-outline-color': '#ffffff'
              }}
            />
          </Source>
        )}

        {selectedDepartment && communesData && communesData.features && (
  <Source key={`communes-${selectedDepartment}`} id="communes-source" type="geojson" data={communesData}>
    <Layer
      id="communes-layer"
      type="fill"
      minzoom={7} // <--- AJOUTE CETTE LIGNE
      paint={{
        'fill-color': [
          'interpolate', 
          ['linear'], 
          ['coalesce', ['to-number', ['get', 'prix_m2_appt']], 0],
          500, '#1e8449', 
          1000, '#27ae60', 
          1500, '#7fb800', 
          2000, '#a2d149', 
          2500, '#f1c40f', 
          3000, '#e67e22', 
          3500, '#c0392b'
        ],
        'fill-opacity': ['case', ['boolean', ['get', 'is_estimated'], false], 0.4, 0.8],
        'fill-outline-color': '#ffffff'
      }}
    />
    {/* Optionnel : tu peux aussi appliquer le minzoom au contour hover */}
    <Layer
      id="communes-line-hover"
      type="line"
      source="communes-source"
      minzoom={7} 
      paint={{
        'line-color': '#3b82f6',
        'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 0]
      }}
    />
  </Source>
)}
      </Map>
    </div>
  );
}