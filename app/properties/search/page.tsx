"use client";

import React, { useState, useMemo } from "react";
import PropertyMapBox from "@/components/PropertyMapBox";

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  latitude: number;
  longitude: number;
}

const initialProperties: Property[] = [
  { id: "1", title: "Appartement Paris", type: "Appartement", price: 250000, latitude: 48.8566, longitude: 2.3522 },
  { id: "2", title: "Maison Lyon", type: "Maison", price: 350000, latitude: 45.764, longitude: 4.8357 },
  { id: "3", title: "Villa Nice", type: "Villa", price: 550000, latitude: 43.7034, longitude: 7.2663 },
];

export default function PropertySearchPage() {
  const [properties] = useState<Property[]>(initialProperties);
  const [filters, setFilters] = useState({ type: "", maxPrice: 0 });
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (filters.type && p.type !== filters.type) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      return true;
    });
  }, [properties, filters]);

  return (
    <div className="flex h-screen">
      {/* Carte */}
      <div className="w-2/3">
        <PropertyMapBox
          properties={filteredProperties}
          selectedPropertyId={selectedPropertyId ?? undefined}
          onMarkerClick={(p) => setSelectedPropertyId(p.id)}
        />
      </div>

      {/* Sidebar */}
      <div className="w-1/3 p-4 overflow-y-auto border-l border-gray-200">
        <h2 className="text-xl font-bold mb-4">Rechercher un bien</h2>

        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Type (Appartement, Maison...)"
            className="border p-2 rounded"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          />
          <input
            type="number"
            placeholder="Prix maximum"
            className="border p-2 rounded"
            value={filters.maxPrice || ""}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          />
        </div>

        <h3 className="text-lg font-semibold mb-2">Résultats</h3>
        <ul className="flex flex-col gap-2">
          {filteredProperties.map((p) => (
            <li
              key={p.id}
              className="p-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedPropertyId(p.id)}
            >
              {p.title} - {p.type} - {p.price.toLocaleString()}€
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
