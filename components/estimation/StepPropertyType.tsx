"use client";
import React, { useState } from 'react';
import { 
  Home, 
  Building, 
  Layers, 
  Building2, 
  Warehouse, 
  Landmark, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { useEstimationStore } from "@/store/useEstimationStore";

const propertyTypes = [
  { id: 'maison', label: 'MAISON', icon: Home },
  { id: 'appartement', label: 'APPARTEMENT', icon: Building },
  { id: 'duplex', label: 'DUPLEX', icon: Layers },
  { id: 'triplex', label: 'TRIPLEX', icon: Building2 },
  { id: 'loft', label: 'LOFT / ATELIER', icon: Warehouse },
  { id: 'hotel_particulier', label: 'HOTEL PARTICULIER', icon: Landmark },
];

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

const StepPropertyType = ({ onNext, onPrev }: StepProps) => {
  const { data, setStepData } = useEstimationStore();
  const [selected, setSelected] = useState(data.propertyType || "");

  const handleSelect = (id: string) => {
    setSelected(id);
    // Optionnel : on peut déclencher onNext() directement après le clic 
    // pour un formulaire plus rapide, mais gardons le bouton pour la cohérence.
  };

 const handleContinue = () => {
  if (selected) {
    // On aligne l'assertion sur les types exacts attendus par le store
    setStepData({ 
      propertyType: selected as "maison" | "appartement" | "duplex" | "triplex" | "loft" | "hotel_particulier" 
    });
    onNext();
  }
};

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl font-medium text-slate-700 mb-12 tracking-tight ">
        2 - De quel type de bien s'agit-il ?
      </h2>

      {/* GRILLE DE SÉLECTION */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
        {propertyTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;

          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={`relative flex flex-col items-center justify-center p-8 h-48 border-2 transition-all duration-300 group
                ${isSelected 
                  ? 'border-cyan-700 bg-cyan-50/30' 
                  : 'border-slate-100 hover:border-slate-300 bg-white'
                }`}
            >
              <Icon 
                size={48} 
                strokeWidth={1} 
                className={`mb-6 transition-colors ${isSelected ? 'text-cyan-700' : 'text-slate-400 group-hover:text-slate-600'}`} 
              />
              <span className={`text-xs font-bold tracking-[0.2em] transition-colors ${isSelected ? 'text-cyan-700' : 'text-slate-500'}`}>
                {type.label}
              </span>
              
              {/* Petit indicateur visuel en bas de la carte sélectionnée */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-700" />
              )}
            </button>
          );
        })}
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between items-center pt-8 border-t border-slate-100">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold uppercase tracking-widest text-xs transition-colors"
        >
          <ChevronLeft size={16} />
          Retour
        </button>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`flex items-center gap-3 px-10 py-4  font-bold transition-all shadow-md uppercase tracking-widest text-xs ${
            !selected 
              ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
              : 'bg-zinc-800 hover:bg-black text-white active:scale-95'
          }`}
        >
          Continuer
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StepPropertyType;