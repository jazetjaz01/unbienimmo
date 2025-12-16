"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { X } from "lucide-react";

type Image = {
  src: string;
  alt?: string;
};

interface LightboxCarouselProps {
  images: Image[];
  initialIndex: number;
  onClose: () => void;
}

export default function LightboxCarousel({
  images,
  initialIndex,
  onClose,
}: LightboxCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(initialIndex);

  /* ----------------------------------
     Init carousel position
  -----------------------------------*/
  React.useEffect(() => {
    if (!api) return;
    api.scrollTo(initialIndex, true);
    setCurrent(initialIndex);
  }, [api, initialIndex]);

  /* ----------------------------------
     Update index on slide change
  -----------------------------------*/
  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  /* ----------------------------------
     Keyboard navigation
  -----------------------------------*/
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!api) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") api.scrollPrev();
      if (e.key === "ArrowRight") api.scrollNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [api, onClose]);

  /* ----------------------------------
     Preload adjacent images
  -----------------------------------*/
  React.useEffect(() => {
    const preload = (index: number) => {
      const img = new Image();
      img.src = images[index]?.src;
    };

    preload(current + 1);
    preload(current - 1);
  }, [current, images]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* ❌ Close button – top right screen */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 rounded-full bg-black/70 p-2 text-white hover:bg-black"
      >
        <X size={28} />
      </button>

      <div className="relative w-full max-w-6xl px-12">
        {/* Counter */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 text-sm text-white bg-black/70 px-3 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            dragFree: false,
            skipSnaps: false,
            duration: 30, // 👉 inertie renforcée
          }}
          className="w-full"
        >
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem
                key={index}
                className="flex items-center justify-center"
              >
                <img
                  src={img.src}
                  alt={img.alt ?? ""}
                  loading={index === current ? "eager" : "lazy"}
                  className="max-h-[85vh] max-w-full object-contain rounded-lg select-none"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Flèches – toujours visibles */}
          <CarouselPrevious className="left-2 text-white bg-black/70 hover:bg-black border-none" />
          <CarouselNext className="right-2 text-white bg-black/70 hover:bg-black border-none" />
        </Carousel>

        {/* Pagination dots */}
        <div className="mt-6 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === current ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
