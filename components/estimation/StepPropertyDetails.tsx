"use client";
import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronLeft, Minus, Plus } from 'lucide-react';
import { z } from 'zod';
import { useEstimationStore } from "@/store/useEstimationStore";

// 1. Schéma de validation
const stepPropertyDetailsSchema = z.object({
  surface: z.coerce.number().min(1),
  landSurface: z.coerce.number().optional(),
  rooms: z.coerce.number().min(1),
  bathrooms: z.coerce.number().min(0),
  floor: z.coerce.number().min(0),
  totalFloors: z.coerce.number().min(1),
});

type PropertyDetailsValues = z.infer<typeof stepPropertyDetailsSchema>;

const StepPropertyDetails = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) => {
  const { data, setStepData } = useEstimationStore();
  const isHouse = data.propertyType === 'house' || data.propertyType === 'hotel_particulier';

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<PropertyDetailsValues>({
    // "as any" corrige l'incompatibilité interne entre ZodResolver et RHF
    resolver: zodResolver(stepPropertyDetailsSchema) as any, 
    defaultValues: {
      surface: Number(data.surface) || 0,
      landSurface: Number(data.landSurface) || 0,
      rooms: Number(data.rooms) || 1,
      bathrooms: Number(data.bathrooms) || 1,
      floor: Number(data.floor) || 0,
      totalFloors: Number(data.totalFloors) || 1,
    },
  });

  const values = watch();

  const updateCount = (field: keyof PropertyDetailsValues, delta: number) => {
    const current = Number(values[field]) || 0;
    const next = Math.max(field === "rooms" || field === "totalFloors" ? 1 : 0, current + delta);
    setValue(field, next, { shouldValidate: true });
  };

  const handleFormSubmit: SubmitHandler<PropertyDetailsValues> = (formData) => {
    setStepData({
      ...formData,
      landSurface: isHouse ? formData.landSurface : undefined
    });
    onNext();
  };

  const CounterRow = ({ label, field }: { label: string, field: keyof PropertyDetailsValues }) => (
    <div className="flex items-center justify-between py-6 border-b border-slate-50">
      <span className="text-lg text-slate-600 font-normal">{label}</span>
      <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
        <button type="button" onClick={() => updateCount(field, -1)} className="p-3 hover:bg-slate-50 text-cyan-700">
          <Minus size={18} />
        </button>
        <span className="w-12 text-center font-medium text-slate-700 text-lg">
          {Number(values[field] || 0)}
        </span>
        <button type="button" onClick={() => updateCount(field, 1)} className="p-3 hover:bg-slate-50 text-cyan-700">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
      <h2 className="text-3xl font-medium text-slate-700 mb-12">3 - Informations principales du bien</h2>
      
      {/* Utilisation d'une fonction fléchée pour le handleSubmit */}
      <form onSubmit={handleSubmit((d) => handleFormSubmit(d))} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Surface Habitable</label>
            <input {...register("surface")} type="number" className="w-full bg-transparent py-3 border-b-2 border-slate-100 text-3xl outline-none focus:border-cyan-700" />
            {errors.surface && <p className="text-red-500 text-xs">{errors.surface.message}</p>}
          </div>

          {isHouse && (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Surface Terrain</label>
              <input {...register("landSurface")} type="number" className="w-full bg-transparent py-3 border-b-2 border-slate-100 text-3xl outline-none focus:border-cyan-700" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <CounterRow label="Nombre de pièces" field="rooms" />
          <CounterRow label="Nombre de salles de bain" field="bathrooms" />
          <CounterRow label="Étage de ce bien" field="floor" />
          <CounterRow label="Nombre d'étages total" field="totalFloors" />
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
          <button type="button" onClick={onPrev} className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
            <ChevronLeft size={16} /> Retour
          </button>
          <button type="submit" className="bg-zinc-800 text-white px-10 py-4 font-bold text-xs uppercase flex items-center gap-3">
            Continuer <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepPropertyDetails;