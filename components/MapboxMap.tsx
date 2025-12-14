'use client'

import * as React from 'react'
import mapboxgl, { LngLatBounds } from 'mapbox-gl' // Import de LngLatBounds
import 'mapbox-gl/dist/mapbox-gl.css' 
import { useEffect, useRef } from 'react'

// Définitions de types (synchronisées avec SearchPage.tsx)
interface ListingForCard {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
}

interface MapboxMapProps {
  listings: ListingForCard[];
}

// ⚠️ Assurez-vous que votre token est défini soit dans le .env, soit ici si vous le hardcodez pour des tests
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''; 

// Stockage pour suivre les marqueurs Mapbox GL, pour pouvoir les retirer
const markersRef = new Map<number, mapboxgl.Marker>();

export function MapboxMap({ listings }: MapboxMapProps) {
    // Référence au conteneur DOM (où la carte sera injectée)
    const mapContainer = useRef<HTMLDivElement>(null);
    // Référence à l'objet Mapbox (pour pouvoir interagir avec lui après initialisation)
    const map = useRef<mapboxgl.Map | null>(null);

    // Initialisation de la carte (S'exécute une seule fois au montage)
    useEffect(() => {
        if (map.current || !mapContainer.current || !mapboxgl.accessToken) return; 

        // 1. Déterminer le centre initial
        const initialCenter: [number, number] = listings.length > 0 
            ? [listings[0].longitude, listings[0].latitude]
            : [1.888334, 46.603354]; // Centre France

        // 2. Création de l'instance Mapbox
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11', // Style de carte standard
            center: initialCenter,
            zoom: listings.length > 0 ? 12 : 5,
        });

        // 3. Ajouter les contrôles de navigation
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Fonction de nettoyage (démontage du composant)
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };

    }, []); // Dépendance vide pour s'assurer que cela ne s'exécute qu'une fois

    // ➡️ Gestion des marqueurs et de la vue (S'exécute lorsque 'listings' change)
    useEffect(() => {
        if (!map.current) return;

        // --- Logique de mise à jour des marqueurs ---

        // 1. Enlever les marqueurs qui ne sont plus dans la liste 'listings'
        const listingIds = new Set(listings.map(l => l.id));
        
        markersRef.forEach((marker, id) => {
            if (!listingIds.has(id)) {
                marker.remove();
                markersRef.delete(id);
            }
        });

        // 2. Ajouter/Mettre à jour les marqueurs
        const bounds = new LngLatBounds();
        let markersAdded = 0;

        listings.forEach((listing) => {
            // Si le marqueur existe déjà, on ne fait rien pour l'instant (mais on pourrait mettre à jour)
            if (markersRef.has(listing.id)) {
                bounds.extend([listing.longitude, listing.latitude]);
                markersAdded++;
                return; 
            }
            
            // Créer l'élément DOM du marqueur (similaire au style de react-map-gl)
            const el = document.createElement('div');
            el.className = 'mapbox-marker-price'; // Classe pour le style (à définir en CSS)
            el.innerHTML = `
                <div class="
                    bg-rose-600 text-white
                    font-semibold text-xs rounded-full 
                    px-2 py-1 shadow-md cursor-pointer 
                    hover:bg-rose-700 transition whitespace-nowrap
                ">
                    ${new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 0,
                    }).format(listing.price)}
                </div>
            `;

            const marker = new mapboxgl.Marker(el)
                .setLngLat([listing.longitude, listing.latitude])
                .addTo(map.current!);

            markersRef.set(listing.id, marker);
            bounds.extend([listing.longitude, listing.latitude]);
            markersAdded++;
        });

        // 3. Ajuster la vue pour englober tous les biens trouvés
        if (markersAdded > 0) {
            map.current.fitBounds(bounds, {
                padding: { top: 40, bottom: 40, left: 20, right: 20 },
                duration: 1000,
                maxZoom: 15 // Ne pas trop zoomer même si un seul point
            });
        }
    }, [listings]); // Dépend de la liste des biens

    // Affichage d'un message si le token est manquant
    if (!mapboxgl.accessToken) {
        return (
            <div className="w-full h-full bg-red-100 flex items-center justify-center text-red-700">
                Erreur: Le token Mapbox n'est pas configuré (NEXT_PUBLIC_MAPBOX_TOKEN).
            </div>
        );
    }

    return (
        // Le conteneur DIV doit avoir une hauteur et une largeur définies (gérées par MapAndListLayout)
        <div ref={mapContainer} className="w-full h-full" />
    );
}