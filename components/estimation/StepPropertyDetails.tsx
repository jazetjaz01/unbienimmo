"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronLeft, Minus, Plus, Info } from 'lucide-react';
import { z } from 'zod'; // Import de Zod ajouté
import { useEstimationStore } from "@/store/useEstimationStore";

// 1. Déclaration du schéma local pour cette étape spécifique
// Déclaration du schéma local corrigé pour TypeScript
// 1. Déclaration du schéma local corrigé
// 1. Déclaration du schéma local validé par TypeScript
const stepPropertyDetailsSchema = z.object({
  surface: z.coerce
    .number({ message: "Veuillez entrer un nombre" })
    .min(1, "La surface doit être supérieure à 0"),
    
  // CORRECTION : On utilise simplement .optional() à la fin de l'effet. 
  // Zod comprendra tout seul qu'il doit accepter l'absence de la clé.
  landSurface: z.preprocess(
    (val) => (val === "" || val === 0 || val === null || val === undefined ? undefined : Number(val)),
    z.number().optional()
  ).optional(), // Un seul .optional() suffit ici
  
  rooms: z.coerce.number().min(1),
  bathrooms: z.coerce.number().min(0),
  floor: z.coerce.number().min(0),
  totalFloors: z.coerce.number().min(1),
});

type PropertyDetailsValues = z.infer<typeof stepPropertyDetailsSchema>;

const StepPropertyDetails = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) => {
  const { data, setStepData } = useEstimationStore();
  
  // On vérifie si c'est une maison pour afficher le terrain
  const isHouse = data.propertyType === 'maison' || data.propertyType === 'hotel_particulier';

  // 2. Utilisation du type et du resolver local parfaitement alignés
  // 2. On retire le <PropertyDetailsValues> pour laisser l'inférence magique de React Hook Form opérer
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(stepPropertyDetailsSchema),
    defaultValues: {
      // On s'assure d'avoir des valeurs numériques ou undefined pour coller au store et à Zod
      surface: data.surface ? Number(data.surface) : undefined,
      landSurface: data.landSurface ? Number(data.landSurface) : undefined,
      rooms: data.rooms !== undefined ? Number(data.rooms) : 1,
      bathrooms: data.bathrooms !== undefined ? Number(data.bathrooms) : 1,
      floor: data.floor !== undefined ? Number(data.floor) : 0,
      totalFloors: data.totalFloors !== undefined ? Number(data.totalFloors) : 1,
    },
  });

  const values = watch();

  const updateCount = (field: keyof PropertyDetailsValues, delta: number) => {
    const current = Number(values[field]) || 0;
    const next = Math.max(field === "floor" || field === "bathrooms" ? 0 : 1, current + delta);
    setValue(field, next as any, { shouldValidate: true });
  };

  const onSubmit = (formData: PropertyDetailsValues) => {
    setStepData(formData);
    onNext();
  };

  const CounterRow = ({ label, field, info }: { label: string, field: keyof PropertyDetailsValues, info?: string }) => (
    <div className="flex items-center justify-between py-6 border-b border-slate-50">
      <div className="flex items-center gap-2">
        <span className="text-lg text-slate-600 font-normal">{label}</span>
        {info && <Info size={14} className="text-slate-300 cursor-help" />}
      </div>
      <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
        <button type="button" onClick={() => updateCount(field, -1)} className="p-3 hover:bg-slate-50 text-cyan-700 transition-colors">
          <Minus size={18} />
        </button>
        <span className="w-12 text-center font-medium text-slate-700 text-lg">
          {String(values[field] || 0)}
        </span>
        <button type="button" onClick={() => updateCount(field, 1)} className="p-3 hover:bg-slate-50 text-cyan-700 transition-colors">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
      <style jsx global>{`
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <h2 className="text-3xl font-medium text-slate-700 mb-12 tracking-tight">
        3 - Informations principales du bien
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* SURFACE HABITABLE */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Surface Habitable</label>
            <div className="relative group flex items-end">
              <input
                {...register("surface")}
                type="number"
                placeholder="0"
                className="w-full bg-transparent py-3 pr-12 text-3xl font-medium text-slate-800 outline-none border-b-2 border-slate-100 focus:border-cyan-700 transition-all placeholder:text-slate-100"
              />
              <span className="absolute right-0 bottom-3 text-xl font-bold text-slate-300 group-focus-within:text-cyan-700 transition-colors pointer-events-none">m²</span>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cyan-700 transition-all duration-500 group-focus-within:w-full" />
            </div>
            {errors.surface && (
              <p className="text-red-500 text-xs mt-1">{errors.surface.message}</p>
            )}
          </div>

          {/* SURFACE TERRAIN (Conditionnel) */}
          {isHouse && (
            <div className="flex flex-col gap-3 animate-in slide-in-from-right-4 duration-500">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Surface Terrain</label>
              <div className="relative group flex items-end">
                <input
                  {...register("landSurface")}
                  type="number"
                  placeholder="0"
                  className="w-full bg-transparent py-3 pr-12 text-3xl font-medium text-slate-800 outline-none border-b-2 border-slate-100 focus:border-cyan-700 transition-all placeholder:text-slate-100"
                />
                <span className="absolute right-0 bottom-3 text-xl font-bold text-slate-300 group-focus-within:text-cyan-700 transition-colors pointer-events-none">m²</span>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cyan-700 transition-all duration-500 group-focus-within:w-full" />
              </div>
            </div>
          )}
        </div>

        {/* COMPTEURS */}
        <div className="flex flex-col">
          <CounterRow label="Nombre de pièces" field="rooms" />
          <CounterRow label="Nombre de salles de bain" field="bathrooms" />
          <CounterRow label="Étage de ce bien" field="floor" />
          <CounterRow label="Nombre d'étages total" field="totalFloors" />
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
          <button type="button" onClick={onPrev} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold uppercase tracking-widest text-xs transition-colors">
            <ChevronLeft size={16} /> Retour
          </button>
          <button type="submit" className="flex items-center gap-3 bg-zinc-800 hover:bg-black text-white px-10 py-4 font-bold transition-all shadow-md uppercase tracking-widest text-xs active:scale-95 transition-transform">
            Continuer <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepPropertyDetails;