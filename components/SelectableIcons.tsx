"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface SelectableIconsProps {
  onSelect: (value: string) => void;
}

export default function SelectableIcons({ onSelect }: SelectableIconsProps) {
  const icons = [
    { label: "Achat", src: "/achat.mp4" },
    { label: "Location", src: "/location.mp4" },
    { label: "Commerce", src: "/commerce.mp4" },
    { label: "Terrain", src: "/terrain.mp4" },
  ];

  const [selected, setSelected] = useState(0);
  const [linePos, setLinePos] = useState(0);
  const [lineWidth, setLineWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  // Jouer toutes les vidéos au chargement
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  }, []);

  const handleClick = (index: number) => {
    setSelected(index);
    onSelect(icons[index].label);

    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  // Mise à jour de la position et largeur de la ligne
  useEffect(() => {
    if (!containerRef.current) return;
    const children = Array.from(containerRef.current.children) as HTMLElement[];
    const selectedChild = children[selected];
    if (selectedChild) {
      setLinePos(selectedChild.offsetLeft);
      setLineWidth(selectedChild.offsetWidth);
    }
  }, [selected]);

  return (
    <div className="relative flex flex-col items-center w-full">
      <div
        ref={containerRef}
        className="flex justify-center items-center gap-6 relative"
      >
        {icons.map((icon, index) => (
          <div
            key={icon.label}
            className="flex flex-row items-center gap-2 cursor-pointer"
            onClick={() => handleClick(index)}
          >
            <motion.video
              ref={(el) => {
                if (el) videoRefs.current[index] = el;
              }}
              src={icon.src}
              muted
              playsInline
              className="w-10 h-10 sm:w-16 sm:h-16 object-contain rounded-md"
              whileHover={{ scale: 1.15 }}
            />

            <span
              className={`text-sm font-medium ${
                selected === index ? "text-black" : "text-gray-400"
              }`}
            >
              {icon.label}
            </span>
          </div>
        ))}

        {/* Ligne animée sous l'icône + texte */}
        <motion.div
          className="absolute bottom-[-10px] h-1 bg-black rounded"
          animate={{ left: linePos, width: lineWidth }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>
    </div>
  );
}
