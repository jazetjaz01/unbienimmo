"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronLeft, Minus, Plus } from 'lucide-react';
import { z } from 'zod'; // Importation de Zod
import { useEstimationStore } from "@/store/useEstimationStore";

// 1. Schéma local tolérant pour éviter le blocage sur les champs masqués
const stepPropertyFeaturesSchema = z.object({
  hasElevator: z.boolean().optional().default(false),
  hasBalcony: z.boolean().optional().default(false),
  balconySurface: z.coerce.number().optional().default(0),
  hasTerrace: z.boolean().optional().default(false),
  terraceSurface: z.coerce.number().optional().default(0),
  hasCellar: z.boolean().optional().default(false),
  cellarCount: z.coerce.number().optional().default(0),
  hasParking: z.boolean().optional().default(false),
  parkingCount: z.coerce.number().optional().default(0),
  hasServiceRoom: z.boolean().optional().default(false),
  serviceRoomCount: z.coerce.number().optional().default(0),
  hasGreatView: z.boolean().optional().default(false),
  renovatedCommonAreas: z.boolean().optional().default(false),
  recentFacading: z.boolean().optional().default(false),
});

const StepPropertyFeatures = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) => {
  const { data, setStepData } = useEstimationStore();

  // 2. Initialisation avec le resolver local et sans type rigide à l'entrée
  const { register, handleSubmit, watch, setValue, getValues } = useForm({
    resolver: zodResolver(stepPropertyFeaturesSchema),
    defaultValues: {
      hasElevator: data.hasElevator || false,
      hasBalcony: data.hasBalcony || false,
      balconySurface: data.balconySurface || 0,
      hasTerrace: data.hasTerrace || false,
      terraceSurface: data.terraceSurface || 0,
      hasCellar: data.hasCellar || false,
      cellarCount: data.cellarCount || 0,
      hasParking: data.hasParking || false,
      parkingCount: data.parkingCount || 0,
      hasServiceRoom: data.hasServiceRoom || false,
      serviceRoomCount: data.serviceRoomCount || 0,
      hasGreatView: data.hasGreatView || false,
      renovatedCommonAreas: data.renovatedCommonAreas || false,
      recentFacading: data.recentFacading || false,
    },
    mode: "onSubmit"
  });

  const hasBalcony = watch("hasBalcony");
  const hasTerrace = watch("hasTerrace");
  const hasCellar = watch("hasCellar");
  const hasParking = watch("hasParking");
  const hasServiceRoom = watch("hasServiceRoom");

  const updateValue = (field: string, delta: number) => {
    const currentValues = getValues();
    const current = Number(currentValues[field as keyof typeof currentValues]) || 0;
    const next = Math.max(0, current + delta);
    
    setValue(field as any, next, { 
      shouldDirty: true, 
      shouldTouch: false, 
      shouldValidate: false 
    });
  };

  const onSubmit = (formData: any) => {
    setStepData(formData);
    onNext();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div className="mb-10">
        <h2 className="text-3xl font-medium text-slate-700 tracking-tight">Caractéristiques du bien</h2>
        <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest font-bold">(Facultatif)</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        
        <SimpleFeature label="Ascenseur" id="hasElevator" register={register} />
        
        <NumericFeature 
          label="Balcon" 
          id="hasBalcony" 
          isActive={hasBalcony} 
          field="balconySurface" 
          unit="m²"
          register={register} 
          onUpdate={updateValue} 
        />

        <NumericFeature 
          label="Terrasse" 
          id="hasTerrace" 
          isActive={hasTerrace} 
          field="terraceSurface" 
          unit="m²"
          register={register} 
          onUpdate={updateValue} 
        />

        <NumericFeature 
          label="Cave" 
          id="hasCellar" 
          isActive={hasCellar} 
          field="cellarCount" 
          register={register} 
          onUpdate={updateValue} 
        />

        <NumericFeature 
          label="Garage ou parking" 
          id="hasParking" 
          isActive={hasParking} 
          field="parkingCount" 
          register={register} 
          onUpdate={updateValue} 
        />

        <NumericFeature 
          label="Chambre de service" 
          id="hasServiceRoom" 
          isActive={hasServiceRoom} 
          field="serviceRoomCount" 
          register={register} 
          onUpdate={updateValue} 
        />

        <SimpleFeature label="Vue exceptionnelle" id="hasGreatView" sublabel="(Ex : vue sur le Canigou, mer...)" register={register} />
        <SimpleFeature label="Parties communes rénovées" id="renovatedCommonAreas" sublabel="(- de 3 ans)" register={register} />
        <SimpleFeature label="Ravalement récent" id="recentFacading" sublabel="(- de 3 ans)" register={register} />

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

const SimpleFeature = ({ label, id, sublabel, register }: any) => (
  <div className="py-4 border-b border-slate-50 flex items-center justify-between">
    <label className="flex items-center gap-4 cursor-pointer group">
      <CheckboxInput id={id} register={register} />
      <div className="flex flex-col">
        <span className="text-slate-700 font-medium group-hover:text-cyan-700 transition-colors">{label}</span>
        {sublabel && <span className="text-[10px] text-slate-400 italic font-normal">{sublabel}</span>}
      </div>
    </label>
  </div>
);

const NumericFeature = ({ label, id, isActive, field, unit, register, onUpdate }: any) => (
  <div className="py-4 border-b border-slate-50 flex items-center justify-between">
    <label className="flex items-center gap-4 cursor-pointer group">
      <CheckboxInput id={id} register={register} />
      <span className="text-slate-700 font-medium group-hover:text-cyan-700 transition-colors">{label}</span>
    </label>

    {isActive && (
      <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm h-9 animate-in fade-in zoom-in duration-200">
        <button type="button" onClick={() => onUpdate(field, -1)} className="px-2 h-full hover:bg-slate-50 text-cyan-700 border-r border-slate-100 transition-colors">
          <Minus size={14}/>
        </button>
        <div className="relative flex items-center w-14">
          <input 
            type="number" 
            {...register(field)} 
            className="w-full text-center outline-none text-slate-700 font-bold bg-transparent text-sm" 
          />
          {unit && <span className="absolute right-0.5 bottom-0.5 text-[7px] font-bold text-slate-300 pointer-events-none">{unit}</span>}
        </div>
        <button type="button" onClick={() => onUpdate(field, 1)} className="px-2 h-full hover:bg-slate-50 text-cyan-700 border-l border-slate-100 transition-colors">
          <Plus size={14}/>
        </button>
      </div>
    )}
  </div>
);

const CheckboxInput = ({ id, register }: any) => (
  <div className="relative flex items-center justify-center">
    <input 
      type="checkbox" 
      {...register(id)}
      className="peer h-6 w-6 appearance-none rounded border-2 border-slate-200 checked:border-cyan-700 checked:bg-cyan-700 transition-all cursor-pointer"
    />
    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

export default StepPropertyFeatures;