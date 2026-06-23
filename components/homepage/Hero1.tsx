import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link"; 

const Hero1 = () => {
  return (
    <section className="bg-background w-full py-12 md:py-12 lg:py-12">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-syncopate font-bold tracking-tighter text-foreground max-w-5xl leading-tight">
          Une bonne vente commence par une bonne estimation
        </h1>

        <p className="mt-6 text-xl  max-w-3xl leading-relaxed">
          Découvrez la valeur réelle de votre bien en 2 minutes. Simple, rapide et 100% gratuit.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
          
          <Link href="/estimation-immobiliere">
            <Button size="lg" className="px-8 font-semibold text-lg rounded-full">
              Estimer mon bien <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          {/* Lien ajouté ici */}
          <Link href="https://www.unbienimmo.com/actualite/comment-nous-estimons-">
            <Button size="lg" variant="outline" className="px-8 font-semibold text-lg rounded-full">
              Comment ça marche ?
            </Button>
          </Link>
          
        </div>

      </div>
    </section>
  );
};

export default Hero1;