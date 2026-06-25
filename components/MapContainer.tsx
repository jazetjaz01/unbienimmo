"use client";
import { useState, useRef, useEffect } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import bbox from '@turf/bbox';

export default function MapContainer({ data, selectedDepartment }: { data: any, selectedDepartment: string | null }) {
  const mapRef = useRef<MapRef>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Effet pour zoomer sur le département sélectionné
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

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: 2.2137, latitude: 46.2276, zoom: 5.5 }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        interactiveLayerIds={['data-layer']}
      >
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
                  1500, '#2ecc71', 
                  3000, '#f1c40f', 
                  6000, '#e74c3c'
                ]
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false], 1.0, 
                0.9
              ]
            }}
          />
          <Layer
            id="data-outline"
            type="line"
            paint={{
              'line-color': '#ffffff',
              'line-width': 1
            }}
          />
        </Source>
      </Map>
    </div>
  );
}