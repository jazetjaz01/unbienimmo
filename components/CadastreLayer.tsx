"use client";

import { useEffect } from "react";
import { useMap } from "react-map-gl/mapbox";
import bbox from "@turf/bbox";
import { point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

export default function CadastreLayer({ lat, lng }: { lat: number; lng: number }) {
  const { current: mapRef } = useMap();

  useEffect(() => {
    if (!mapRef || isNaN(lat) || isNaN(lng)) return;
    const map = mapRef.getMap();
    let isMounted = true;

    const fetchParcel = async () => {
      try {
        const res = await fetch(`/api/historiques/cadastres?lat=${lat}&lng=${lng}`);
        const result = await res.json();
        
        if (!isMounted) return;

        const features = result?.features;
        if (!features || features.length === 0) return;

        const searchPoint = point([lng, lat]);
        const bestParcel = features.find((f: any) => booleanPointInPolygon(searchPoint, f)) || features[0];

        // Nettoyage avant ajout
        if (map.getLayer("parcel-fill")) map.removeLayer("parcel-fill");
        if (map.getLayer("parcel-line")) map.removeLayer("parcel-line");
        if (map.getSource("parcel")) map.removeSource("parcel");

        map.addSource("parcel", { type: "geojson", data: bestParcel });
        map.addLayer({ id: "parcel-fill", type: "fill", source: "parcel", paint: { "fill-color": "#f59e0b", "fill-opacity": 0.35 } });
        map.addLayer({ id: "parcel-line", type: "line", source: "parcel", paint: { "line-color": "#b45309", "line-width": 3 } });

        const bounds = bbox(bestParcel);
        map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], { padding: 80, duration: 1000 });
      } catch (err) {
        console.error("Erreur:", err);
      }
    };

    fetchParcel();

    return () => {
      isMounted = false;
      if (map.getLayer("parcel-fill")) map.removeLayer("parcel-fill");
      if (map.getLayer("parcel-line")) map.removeLayer("parcel-line");
      if (map.getSource("parcel")) map.removeSource("parcel");
    };
  }, [mapRef, lat, lng]);

  return null;
}