"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LucideSearch } from "lucide-react";

interface SearchBarProps {
  selectedIcon: string;
}

export default function SearchBar({ selectedIcon }: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    const query = new URLSearchParams({
      type: selectedIcon,
      location,
      rooms,
      budget,
    }).toString();

    router.push(`/results?${query}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 ">
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-full shadow-md p-2 sm:p-4 gap-2 sm:gap-4 border border-gray-200">
        
        {/* Champ Localisation */}
        <input
          type="text"
          placeholder="Saisissez une ville, un code postal ou un département..."
          className="flex-1 px-4 py-2 rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Champ Pièces */}
        <input
          type="number"
          placeholder="Pièces"
          className="w-24 px-4 py-2 rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
        />

        {/* Champ Budget */}
        <input
          type="number"
          placeholder="Budget max"
          className="w-28 px-4 py-2 rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        {/* Bouton recherche */}
        <button
          onClick={handleSearch}
          className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md"
        >
          <LucideSearch className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
