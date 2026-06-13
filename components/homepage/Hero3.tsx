import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Liste des technologies avec leurs chemins locaux
const technologies = [
  { src: "/home-page/carousel/nextjs.svg", alt: "Next.js" },
  { src: "/home-page/carousel/github.svg", alt: "GitHub" },
  { src: "/home-page/carousel/openai.svg", alt: "OpenAI" },
  { src: "/home-page/carousel/ovh.svg", alt: "OVH" },
  { src: "/home-page/carousel/supabase.svg", alt: "Supabase" },
   { src: "/home-page/carousel/postgresql.svg", alt: "Postgresql" },
];

export default function Hero3() {
  return (
    <div className="mx-auto max-w-7xl px-10 py-10">
      <div className="justify-center">
        <div>
          <h2 className="text-xl tracking-tight items-center text-center">
            Nous faisons confiance aux technologies suivantes pour vous fournir les meilleures estimations
          </h2>
        </div>
      </div>
      
      <Carousel className="mt-10 w-full" opts={{ loop: true, align: "start" }}>
        <CarouselContent>
          {technologies.map((tech, index) => (
            <CarouselItem
              className="basis-1/2 md:basis-1/3 lg:basis-1/5" // Ajusté pour afficher plus d'éléments
              key={index}
            >
              <div className="p-4 flex items-center justify-center">
                {/* Utilisation de next/image pour optimiser l'affichage */}
                <div className="relative h-20 w-full">
                  <Image 
                    src={tech.src} 
                    alt={tech.alt}
                    fill
                    className="object-contain" // object-contain évite que le logo soit coupé
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="mt-4 flex items-center justify-between sm:justify-end">
          <div className="flex items-center justify-end gap-1.5">
            <CarouselPrevious className="-left-10 max-md:static max-md:translate-y-0" />
            <CarouselNext className="-right-10 max-md:static max-md:translate-y-0" />
          </div>
        </div>
      </Carousel>
    </div>
  );
}