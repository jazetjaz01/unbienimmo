"use client";
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, MapPin, AlertCircle, Hash, Building2 } from 'lucide-react';
import { z } from 'zod'; // Import de Zod indispensable ici

import { useEstimationStore } from "@/store/useEstimationStore";

// 1. On déclare le schéma local spécifique à cette étape pour éviter le conflit avec le .refine() global
const stepAddressSchema = z.object({
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  postcode: z.string().length(5, "Le code postal doit contenir 5 chiffres"),
});

type StepAddressValues = z.infer<typeof stepAddressSchema>;

const StepAddress = ({ onNext }: { onNext: () => void }) => {
  const { data, setStepData } = useEstimationStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StepAddressValues>({
    mode: "onChange",
    resolver: zodResolver(stepAddressSchema), // Utilisation du schéma local sécurisé
    defaultValues: {
      address: data.address || "",
      city: data.city || "",
      postcode: data.postcode || "",
    },
  });

  const watchAddress = watch("address");
  const watchCity = watch("city");

  const isAddressInvalid = !watchAddress || watchAddress.trim() === "" || watchAddress.toLowerCase() === watchCity?.toLowerCase();

  useEffect(() => {
    if (data.postcode) setValue("postcode", data.postcode);
    if (data.city) setValue("city", data.city);
    if (data.address) setValue("address", data.address);
  }, [data, setValue]);

  const onSubmit = (values: StepAddressValues) => {
    if (isAddressInvalid) return;
    setStepData(values);
    onNext();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
      <h2 className="text-3xl font-medium text-slate-700 mb-12 tracking-tight">
       1 - Commencez par estimer votre bien
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          
          {/* CODE POSTAL */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Hash size={14} />
              <label className="text-xs font-bold uppercase tracking-widest">Code postal</label>
            </div>
            <div className="relative group">
              <input
                {...register("postcode")}
                type="text"
                maxLength={5}
                placeholder="Ex: 75001"
                className="w-full bg-transparent py-3 text-2xl font-medium text-slate-700 outline-none border-b-2 border-slate-100 focus:border-cyan-700 transition-all placeholder:text-slate-100"
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cyan-700 transition-all duration-500 group-focus-within:w-full" />
            </div>
            {errors.postcode && (
              <p className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.postcode.message}</p>
            )}
          </div>

          {/* VILLE */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Building2 size={14} />
              <label className="text-xs font-bold uppercase tracking-widest">Ville</label>
            </div>
            <div className="relative group">
              <input
                {...register("city")}
                type="text"
                placeholder="Nom de la ville"
                className="w-full bg-transparent py-3 text-2xl font-medium text-slate-700 outline-none border-b-2 border-slate-100 focus:border-cyan-700 transition-all placeholder:text-slate-100"
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cyan-700 transition-all duration-500 group-focus-within:w-full" />
            </div>
            {errors.city && (
              <p className="text-red-500 text-[10px] uppercase font-bold mt-1">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* ADRESSE PRÉCISE */}
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex items-center gap-2 text-cyan-700">
            <MapPin size={18} />
            <label className="text-sm font-bold uppercase tracking-widest">
              Adresse précise du bien
            </label>
          </div>
          
          <div className="relative group">
            <input
              {...register("address")}
              type="text"
              placeholder="Veuillez saisir la rue et le numéro..."
              className={`w-full bg-transparent py-3 text-2xl font-medium outline-none border-b-2 transition-all placeholder:text-slate-100 ${
                isAddressInvalid 
                  ? 'border-red-100 text-slate-400' 
                  : 'border-slate-100 focus:border-cyan-700 text-slate-800'
              }`}
            />
            {!isAddressInvalid && (
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cyan-700 transition-all duration-500 group-focus-within:w-full" />
            )}
          </div>
          
          {isAddressInvalid && watchAddress && (
            <div className="flex items-center gap-2 text-red-400 text-xs font-medium animate-pulse mt-2">
              <AlertCircle size={14} />
              <span>Veuillez préciser le numéro et la rue (différent de la ville)</span>
            </div>
          )}
        </div>

        <div className="pt-8 flex justify-end">
          <button
            type="submit"
            disabled={isAddressInvalid}
            className={`flex items-center gap-3 px-10 py-4 font-bold transition-all shadow-md uppercase tracking-widest text-xs ${
              isAddressInvalid 
                ? 'bg-slate-50 text-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-zinc-800 hover:bg-black text-white active:scale-95 transition-transform'
            }`}
          >
            Continuer
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepAddress;