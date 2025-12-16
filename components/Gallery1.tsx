"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import LightboxCarousel from "./LightboxCarousel";

type GalleryImage = {
  src: string;
  alt: string;
};

type GallerySection = {
  type?: string;
  images: GalleryImage[];
};

const Gallery = ({ sections }: { sections: GallerySection[] }) => {
  const allImages = sections.flatMap((section) => section.images);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <section className="py-4 sm:py-16 lg:py-6">
        <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
          <div className="grid gap-6 md:grid-cols-3">
            {sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={cn({
                  "grid grid-cols-2 gap-6": section.type === "grid",
                })}
              >
                {section.images.map((image, imageIndex) => {
                  const globalIndex =
                    sections
                      .slice(0, sectionIndex)
                      .flatMap((s) => s.images).length + imageIndex;

                  return (
                    <img
                      key={imageIndex}
                      src={image.src}
                      alt={image.alt}
                      className="rounded-lg object-cover cursor-pointer"
                      onClick={() => {
                        setIndex(globalIndex);
                        setOpen(true);
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {open && (
        <LightboxCarousel
          images={allImages}
          initialIndex={index}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Gallery;
