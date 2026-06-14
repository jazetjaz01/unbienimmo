"use client";

import { PlusIcon } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const faqData = [
  {
    question: "Comment est calculé le prix estimé ?",
    answer: "Nos estimations se basent sur l'analyse des ventes réelles enregistrées par le ministère des Finances, croisées avec les caractéristiques spécifiques de votre bien.",
  },
  {
    question: "Quelle est la fiabilité des données ?",
    answer: "Les données proviennent de la base officielle Etalab, garantissant une transparence totale sur les transactions immobilières françaises depuis 2014.",
  },
  {
    question: "Est-ce un service payant ?",
    answer: "L'accès à la carte des ventes et la consultation des prix du quartier sont totalement gratuits pour tous les utilisateurs.",
  },
  {
    question: "À quelle fréquence les données sont-elles mises à jour ?",
    answer: "Les données sont mises à jour régulièrement dès que de nouvelles informations sont rendues publiques par l'administration fiscale.",
  },
  {
    question: "Peut-on trouver des informations sur tous les types de biens ?",
    answer: "Oui, notre outil couvre l'ensemble des transactions enregistrées (maisons, appartements, terrains) sur le territoire national.",
  },
  {
    question: "Comment protéger ma vie privée ?",
    answer: "Nous ne conservons aucune donnée personnelle identifiable sur les propriétaires ; seules les données publiques relatives aux transactions sont traitées.",
  },
  {
    question: "Quelle est la zone géographique couverte ?",
    answer: "Notre outil couvre l'intégralité des communes françaises où des données de ventes immobilières ont été publiées.",
  },
  {
    question: "Pourquoi les prix diffèrent-ils parfois d'une agence à l'autre ?",
    answer: "Les agences utilisent souvent des méthodologies privées. Notre outil vous offre une référence basée uniquement sur les faits réels (les ventes passées).",
  },
  {
    question: "Puis-je imprimer le rapport de mon quartier ?",
    answer: "Oui, vous pouvez exporter les données de votre recherche pour conserver une trace de l'historique des ventes de votre secteur.",
  },
  {
    question: "Comment contacter le support en cas de bug ?",
    answer: "Pour toute question technique ou suggestion, vous pouvez nous contacter directement via l'onglet support sur votre espace utilisateur.",
  },
];

const Hero3 = () => {
  return (
    <div className="px-6 py-24 bg-white">
      <div className="mx-auto w-full max-w-450">
        <h2 className="text-4xl md:text-5xl font-medium text-center text-slate-900 mb-20 tracking-tight">
          Questions fréquentes
        </h2>
        <p className="text-slate-600 mb-16 text-lg">
          Tout ce qu'il faut savoir pour bien utiliser notre outil.
        </p>

        <div className="grid w-full gap-x-12 gap-y-4 md:grid-cols-2">
          {/* Note : Pour une gestion indépendante, on utilise deux composants Accordion distincts */}
          <FAQColumn items={faqData.slice(0, 5)} startIndex={0} />
          <FAQColumn items={faqData.slice(5)} startIndex={5} />
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour alléger le code
const FAQColumn = ({ items, startIndex }: { items: typeof faqData, startIndex: number }) => (
  <Accordion type="single" collapsible className="w-full">
    {items.map(({ question, answer }, index) => (
      <AccordionItem 
        key={question} 
        value={`item-${startIndex + index}`}
        className="border-b border-slate-200"
      >
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger
            className={cn(
              "flex flex-1 items-center justify-between py-6 text-left font-medium transition-all",
              "hover:text-slate-600 [&[data-state=open]>svg]:rotate-45"
            )}
          >
            <span className="text-lg">{question}</span>
            <PlusIcon className="h-5 w-5 shrink-0 text-red-400 transition-transform duration-200" />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionContent className="text-slate-600 leading-relaxed pb-6 text-lg">
          {answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default Hero3;