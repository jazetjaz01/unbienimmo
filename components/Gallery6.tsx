"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Gallery6Props {
  images: string[];
}

export default function Gallery6({ images }: Gallery6Props) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };

    update();
    api.on("select", update);

    return () => {
      api.off("select", update); // ✅ TS OK
    };
  }, [api]);

  return (
    <div className="relative">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem key={i}>
              <div className="aspect-[16/9] overflow-hidden rounded-xl">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => api?.scrollPrev()}
          disabled={!canPrev}
          className="pointer-events-auto"
        >
          <ArrowLeft />
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => api?.scrollNext()}
          disabled={!canNext}
          className="pointer-events-auto"
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
