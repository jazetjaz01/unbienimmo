"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { z } from 'zod'; // Importation de Zod
import { useEstimationStore } from "@/store/useEstimationStore";

// 1. Schéma local spécifique pour isoler cette étape du schéma global
const stepPropertyDetailsRefinedSchema = z.object({
  constructionPeriod: z.string().optional().default(""),
  propertyState: z.enum(["refurbished", "standard", "refreshment", "renovation"]).default("standard"),
  propertyQuality: z.enum(["inferior", "comparable", "superior"]).default("comparable"),
});

const StepPropertyDetailsRefined = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) => {
  const { data, setStepData } = useEstimationStore();

  // 2. Utilisation du resolver local sans forcer de type d'entrée strict
  // 2. Initialisation avec le resolver local et un typage strict pour les valeurs par défaut
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(stepPropertyDetailsRefinedSchema),
    defaultValues: {
      constructionPeriod: data.constructionPeriod || "",
      
      // Utilisation d'un cast "as" pour valider le type strict de l'enum auprès de TS
      propertyState: (data.propertyState || "standard") as "refurbished" | "standard" | "refreshment" | "renovation",
      propertyQuality: (data.propertyQuality || "comparable") as "inferior" | "comparable" | "superior",
    },
  });

  const propertyQuality = watch("propertyQuality");

  const onSubmit = (formData: any) => {
    setStepData(formData);
    onNext();
  };

  // Génération des périodes de construction
  const periods = ["Avant 1900"];
  for (let year = 1900; year <= 2020; year += 10) {
    periods.push(`${year} - ${year + 10}`);
  }
  periods.push("Après 2020");

  const states = [
    { value: "refurbished", label: "Refait à neuf" },
    { value: "standard", label: "Standard" },
    { value: "refreshment", label: "Rafraîchissement nécessaire" },
    { value: "renovation", label: "Travaux à prévoir" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-medium text-slate-700 tracking-tight">
          Précisions concernant votre bien
        </h2>
        <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest font-bold">
          (Facultatif)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Période de construction */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Période de construction</label>
          <div className="relative">
            <select 
              {...register("constructionPeriod")}
              className="w-full p-4 bg-white border border-slate-200 rounded-md outline-none focus:border-cyan-700 transition-colors text-slate-600 appearance-none cursor-pointer shadow-sm pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236c757d%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_auto] bg-[right_16px_center] bg-no-repeat"
            >
              <option value="">-- Choisir --</option>
              {periods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          {errors.constructionPeriod && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.constructionPeriod.message as string}</p>}
        </div>

        {/* État du bien */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">État du bien</label>
          <div className="relative">
            <select 
              {...register("propertyState")}
              className="w-full p-4 bg-white border border-slate-200 rounded-md outline-none focus:border-cyan-700 transition-colors text-slate-600 appearance-none cursor-pointer shadow-sm pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236c757d%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_auto] bg-[right_16px_center] bg-no-repeat"
            >
              {states.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Qualité de l'appartement (Segmented Control) */}
        <div className="space-y-3">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700">Qualité de l'appartement</label>
            <span className="text-[10px] text-slate-400 italic">Par rapport aux autres appartements de l'immeuble</span>
          </div>
          
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100 shadow-inner">
            {[
              { value: "inferior", label: "Inférieure" },
              { value: "comparable", label: "Comparable" },
              { value: "superior", label: "Supérieure" }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("propertyQuality", option.value as any, { shouldDirty: true })}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                  propertyQuality === option.value 
                  ? "bg-cyan-700 text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-10 border-t border-slate-100 mt-8">
          <button type="button" onClick={onPrev} className="text-slate-400 hover:text-slate-700 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors">
            <ChevronLeft size={14} /> Retour
          </button>
          <button type="submit" className="flex items-center gap-3 bg-zinc-800 hover:bg-black text-white px-10 py-4 rounded-md font-bold transition-all shadow-md uppercase tracking-widest text-xs active:scale-95 transition-transform">
            Continuer <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepPropertyDetailsRefined;