"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, MapPin, AlertCircle, Hash, Building2, Loader2 } from 'lucide-react';
import { z } from 'zod';

import { useEstimationStore } from "@/store/useEstimationStore";

const stepAddressSchema = z.object({
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  postcode: z.string().length(5, "Le code postal doit contenir 5 chiffres"),
});

type StepAddressValues = z.infer<typeof stepAddressSchema>;

// Fonction utilitaire de géocodage
const getCoordinates = async (address: string, postcode: string) => {
  try {
    const query = encodeURIComponent(`${address} ${postcode}`);
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=1`);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      return { lat, lon };
    }
  } catch (error) {
    console.error("Erreur de géocodage:", error);
  }
  return { lat: null, lon: null };
};

const StepAddress = ({ onNext }: { onNext: () => void }) => {
  const { data, setStepData } = useEstimationStore();
  const [isGeocoding, setIsGeocoding] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StepAddressValues>({
    mode: "onChange",
    resolver: zodResolver(stepAddressSchema),
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

  const onSubmit = async (values: StepAddressValues) => {
    if (isAddressInvalid) return;
    
    setIsGeocoding(true);
    // Récupération des coordonnées lat/lon
    const { lat, lon } = await getCoordinates(values.address, values.postcode);
    
    // Sauvegarde de l'adresse ET des coordonnées dans le store
    setStepData({
      ...values,
      lat,
      lon
    });
    
    setIsGeocoding(false);
    onNext();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
      <h2 className="text-3xl font-medium text-slate-700 mb-12 tracking-tight">
       1 - Commencez par estimer votre bien
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Hash size={14} />
              <label className="text-xs font-bold uppercase tracking-widest">Code postal</label>
            </div>
            <input
              {...register("postcode")}
              type="text"
              maxLength={5}
              placeholder="Ex: 75001"
              className="w-full bg-transparent py-3 text-2xl font-medium text-slate-700 outline-none border-b-2 border-slate-100 focus:border-cyan-700 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Building2 size={14} />
              <label className="text-xs font-bold uppercase tracking-widest">Ville</label>
            </div>
            <input
              {...register("city")}
              type="text"
              placeholder="Nom de la ville"
              className="w-full bg-transparent py-3 text-2xl font-medium text-slate-700 outline-none border-b-2 border-slate-100 focus:border-cyan-700 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <div className="flex items-center gap-2 text-cyan-700">
            <MapPin size={18} />
            <label className="text-sm font-bold uppercase tracking-widest">Adresse précise du bien</label>
          </div>
          <input
            {...register("address")}
            type="text"
            placeholder="Veuillez saisir la rue et le numéro..."
            className="w-full bg-transparent py-3 text-2xl font-medium text-slate-800 outline-none border-b-2 border-slate-100 focus:border-cyan-700 transition-all"
          />
        </div>

        <div className="pt-8 flex justify-end">
          <button
            type="submit"
            disabled={isAddressInvalid || isGeocoding}
            className="flex items-center gap-3 px-10 py-4 font-bold bg-zinc-800 hover:bg-black text-white active:scale-95 transition-all shadow-md uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {isGeocoding ? <Loader2 className="animate-spin h-4 w-4" /> : "Continuer"}
            {!isGeocoding && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepAddress;