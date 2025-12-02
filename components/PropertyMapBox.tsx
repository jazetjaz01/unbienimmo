"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Property {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  properties: Property[];
  selectedPropertyId?: string;
  onMarkerClick?: (property: Property) => void;
}

export default function PropertyMapBox({
  properties,
  selectedPropertyId,
  onMarkerClick,
}: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]); // 👈 référence aux markers

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [2.3522, 48.8566],
      zoom: 5,
    });

    return () => mapRef.current?.remove();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Supprimer tous les markers existants
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Ajouter les nouveaux markers
    properties.forEach((p) => {
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([p.longitude, p.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h1>${p.title}</h1>`))
        .addTo(mapRef.current!);

      if (onMarkerClick) {
        marker.getElement().addEventListener("click", () => onMarkerClick(p));
      }

      markersRef.current.push(marker); // 👈 stocker la référence
    });
  }, [properties, onMarkerClick]);

  useEffect(() => {
    if (selectedPropertyId && mapRef.current) {
      const selected = properties.find((p) => p.id === selectedPropertyId);
      if (selected) {
        mapRef.current.flyTo({
          center: [selected.longitude, selected.latitude],
          zoom: 14,
        });
      }
    }
  }, [selectedPropertyId, properties]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />;
}
