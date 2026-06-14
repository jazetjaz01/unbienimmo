"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Sophie Martin",
    designation: "Propriétaire à Perpignan",
    testimonial: "L'estimation a été incroyablement précise. J'ai pu vendre mon appartement au prix juste en moins de deux semaines.",
    portraitImage: "/estimation-immobiliere/temoignages/temoignages1.png",
  },
  {
    id: 2,
    name: "Julien Bernard",
    designation: "Propriétaire à Toulouse",
    testimonial: "Simple, rapide et très professionnel. L'outil m'a permis de comprendre la valeur réelle de ma maison.",
    portraitImage: "/estimation-immobiliere/temoignages/temoignages2.png",
  },
  {
    id: 3,
    name: "Claire Dubois",
    designation: "Investisseuse à Paris",
    testimonial: "Une interface claire et une analyse très poussée. C'est devenu mon réflexe avant chaque visite.",
    portraitImage: "/estimation-immobiliere/temoignages/temoignages3.png",
  },
];

const Hero3 = () => {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="container mx-auto max-w-7xl">
        <Carousel className="w-full">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Contrôles de navigation pour le défilement */}
          <div className="flex justify-end gap-2 mt-8">
            <CarouselPrevious className="relative static" />
            <CarouselNext className="relative static" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[number] }) => (
  <div className="flex flex-col md:flex-row items-center gap-12 py-10 border-b border-slate-100 ">
    {/* Image avec style "squircle" */}
    <div className="relative w-full max-w-[300px] aspect-square shrink-0 ">
      <Image
        alt={testimonial.name}
        src={testimonial.portraitImage}
        fill
        className="object-cover rounded-[32px]"
      />
    </div>

    {/* Texte et Infos */}
    <div className="flex flex-col gap-4">
      <blockquote className="text-2xl md:text-3xl font-semibold leading-snug">
        "{testimonial.testimonial}"
      </blockquote>
      
      <div className="mt-2">
        <p className="font-semibold text-slate-900">{testimonial.name}</p>
        <p className="text-slate-600 text-sm">{testimonial.designation}</p>
      </div>

      
    </div>
  </div>
);

export default Hero3;