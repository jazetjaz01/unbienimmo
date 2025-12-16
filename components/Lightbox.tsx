"use client";

import { useEffect } from "react";

type Image = {
  src: string;
  alt: string;
};

interface LightboxProps {
  images: Image[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl"
      >
        ✕
      </button>

      {/* Prev */}
      <button
        onClick={onPrev}
        className="absolute left-6 text-white text-4xl"
      >
        ‹
      </button>

      {/* Image */}
      <img
        src={images[index].src}
        alt={images[index].alt}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
      />

      {/* Next */}
      <button
        onClick={onNext}
        className="absolute right-6 text-white text-4xl"
      >
        ›
      </button>
    </div>
  );
}
