"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LucideSearch } from "lucide-react";

export default function IconSearchBar() {
  const router = useRouter();

  const icons = [
    { label: "Achat", src: "/achat.mp4" },
    { label: "Location", src: "/location.mp4" },
    { label: "Commerce", src: "/commerce.mp4" },
    { label: "Terrain", src: "/terrain.mp4" },
  ];

  const [selected, setSelected] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState(icons[0].label);

  const [linePos, setLinePos] = useState(0);
  const [lineWidth, setLineWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("");
  const [budget, setBudget] = useState("");

  // Jouer les vidéos au chargement
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  }, []);

  const handleIconClick = (index: number) => {
    setSelected(index);
    setSelectedIcon(icons[index].label);
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const children = Array.from(containerRef.current.children) as HTMLElement[];
    const selectedChild = children[selected];
    if (selectedChild) {
      setLinePos(selectedChild.offsetLeft);
      setLineWidth(selectedChild.offsetWidth);
    }
  }, [selected]);

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
    <div className="w-full flex flex-col items-center gap-6 mx-auto p-2 rounded-xl">
      
      {/* Icônes avec texte */}
      <div
        ref={containerRef}
        className="flex justify-center items-center gap-6 relative w-full"
      >
        {icons.map((icon, index) => (
          <div
            key={icon.label}
            className="flex flex-row items-center gap-2 cursor-pointer"
            onClick={() => handleIconClick(index)}
          >
            <motion.video
              ref={(el) => {
                if (el) videoRefs.current[index] = el;
              }}
              src={icon.src}
              muted
              playsInline
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md"
              whileHover={{ scale: 1.15 }}
            />
            <span
              className={`text-sm font-medium ${
                selected === index ? "text-black" : "text-gray-600"
              }`}
            >
              {icon.label}
            </span>
          </div>
        ))}

        <motion.div
          className="absolute bottom-[-10px] h-1 bg-black rounded"
          animate={{ left: linePos, width: lineWidth }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>

      {/* Barre de recherche centrée */}
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-full shadow-lg p-3 sm:p-4 gap-3 sm:gap-4 w-full max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Saisissez une ville, un code postal ou un département..."
          className="flex-1 px-4 py-3 rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none text-sm max-w-xl mx-auto"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Pièces"
          className="w-24 px-4 py-3 rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
        />
        <input
          type="number"
          placeholder="Budget max"
          className="w-28 px-4 py-3 rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
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
