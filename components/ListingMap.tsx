'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Listing {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
}

interface ListingMapProps {
  listings: Listing[];
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function ListingMap({ listings }: ListingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const INITIAL_VIEW_STATE = { lng: 2.45, lat: 46.6, zoom: 5 };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Init map only once
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [INITIAL_VIEW_STATE.lng, INITIAL_VIEW_STATE.lat],
        zoom: INITIAL_VIEW_STATE.zoom,
      });
    }

    // Add markers only after map is loaded
    const handleLoad = () => {
      // Remove old markers
      markers.forEach((m) => m.remove());
      const newMarkers: Marker[] = [];

      listings.forEach((listing) => {
        const el = document.createElement('div');
        el.className = 'listing-marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.backgroundColor = 'red';
        el.style.borderRadius = '50%';
        el.title = `${listing.title} - ${listing.price} €`;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([listing.longitude, listing.latitude])
          .addTo(map.current!);

        newMarkers.push(marker);
      });

      setMarkers(newMarkers);
    };

    map.current.on('load', handleLoad);

    // Si la carte est déjà chargée (rafraîchissement ou SSR), appeler directement
    if (map.current.loaded()) {
      handleLoad();
    }

    return () => {
      map.current?.off('load', handleLoad);
    };
  }, [listings]); // Re-run when listings change

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '500px', width: '100%' }}
    />
  );
}
