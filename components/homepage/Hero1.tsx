import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero1 = () => {
  return (
    <section className="bg-background w-full py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        
        {/* TITRE PRINCIPAL (Hero Title) */}
        {/* On utilise text-foreground pour la couleur et font-syncopate pour le style Display */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-syncopate font-bold tracking-tighter text-foreground max-w-4xl leading-tight">
          Une bonne vente commence par une bonne estimation
        </h1>

        {/* SOUS-TITRE (Description) */}
        {/* On utilise text-muted-foreground pour un gris plus doux et font-sans par défaut */}
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Découvrez la valeur réelle de votre bien en 2 minutes. Simple, rapide et 100% gratuit.
        </p>

        {/* SECTION BOUTONS (CTA) */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
          
          {/* Bouton Principal : Estimer mon bien */}
          {/* Utilise la variante par défaut de Shadcn (fill) */}
          <Button size="lg" className="px-8 font-semibold text-lg">
            Estimer mon bien <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Bouton Secondaire : Comment ça marche ? */}
          {/* Utilise la variante outline (bordure) pour le contraste */}
          <Button size="lg" variant="outline" className="px-8 font-semibold text-lg">
            Comment ça marche ?
          </Button>
          
        </div>

      </div>
    </section>
  );
};

export default Hero1;