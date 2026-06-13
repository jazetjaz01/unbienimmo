"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { z } from 'zod';
import { useEstimationStore } from "@/store/useEstimationStore";

// 1. Schéma local
const userProjectSchema = z.object({
  userType: z.enum(["particulier", "professionnel"]),
  isOwner: z.boolean(),
  propertyUsage: z.string().min(1, "Ce champ est requis"),
  saleIntent: z.string().min(1, "Ce champ est requis"),
  priorityContact: z.boolean(),
  phoneNumber: z.string().optional().default(""),
}).superRefine((data, ctx) => {
  if (data.priorityContact && (!data.phoneNumber || data.phoneNumber.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Veuillez renseigner votre numéro de téléphone",
      path: ["phoneNumber"],
    });
  }
});

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

const StepUserProject = ({ onNext, onPrev }: StepProps) => {
  const { data, setStepData } = useEstimationStore();

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(userProjectSchema),
    defaultValues: {
      userType: (data.userType as "particulier" | "professionnel") || "particulier",
      isOwner: data.isOwner !== undefined ? data.isOwner : true,
      propertyUsage: data.propertyUsage || "",
      saleIntent: data.saleIntent || "",
      priorityContact: data.priorityContact !== undefined ? data.priorityContact : false,
      phoneNumber: data.phoneNumber || "",
    }
  });

  const userType = watch("userType");
  const isOwner = watch("isOwner");
  const priorityContact = watch("priorityContact");

  const onSubmit = (formData: any) => {
    setStepData(formData);
    onNext();
  };

  const handlePriorityContactChange = (value: boolean) => {
    setValue("priorityContact", value, { shouldValidate: true, shouldDirty: true });
    if (!value) {
      setValue("phoneNumber", "", { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto">
      <h2 className="text-3xl font-medium text-slate-700 mb-8 tracking-tight">
        Ce bien et vous
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        
        {/* MODIFICATION : Nouveau sélecteur Segmented Control pour Particulier / Professionnel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <label className="text-base font-medium text-slate-700">Vous êtes un :</label>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1 shadow-inner h-11 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setValue("userType", "particulier", { shouldDirty: true })}
              className={`flex-1 sm:flex-none px-6 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                userType === "particulier" 
                  ? "bg-cyan-700 text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Particulier
            </button>
            <button
              type="button"
              onClick={() => setValue("userType", "professionnel", { shouldDirty: true })}
              className={`flex-1 sm:flex-none px-6 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                userType === "professionnel" 
                  ? "bg-cyan-700 text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Professionnel
            </button>
          </div>
        </div>

        {/* Question : Êtes-vous propriétaire ? */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="max-w-md">
            <label className="text-base font-medium text-slate-700 block">
              Êtes-vous propriétaire de ce bien ?
            </label>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              En fournissant ces informations, vous pourrez être mis en relation avec nos experts immobiliers ou un professionnel de l'immobilier local afin de mieux vous accompagner dans votre projet.
            </p>
          </div>
          {/* HARMONISATION : Changement de bg-blue-500 vers bg-cyan-700 et arrondi en rounded-lg */}
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm h-11 shrink-0">
            <button
              type="button"
              onClick={() => setValue("isOwner", true, { shouldDirty: true })}
              className={`px-6 text-xs font-bold rounded-md transition-all ${isOwner ? "bg-cyan-700 text-white shadow-md" : "text-slate-600 hover:text-black"}`}
            >
              Oui
            </button>
            <button
              type="button"
              onClick={() => setValue("isOwner", false, { shouldDirty: true })}
              className={`px-6 text-xs font-bold rounded-md transition-all ${!isOwner ? "bg-cyan-700 text-white shadow-md" : "text-slate-600 hover:text-black"}`}
            >
              Non
            </button>
          </div>
        </div>

        {/* Question : Ce bien est... */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <label className="text-base font-medium text-slate-700">Ce bien est</label>
          <div className="w-full md:w-72">
            <select
              {...register("propertyUsage")}
              className={`w-full p-3 bg-white border rounded-md outline-none transition-colors text-sm text-slate-700 cursor-pointer shadow-sm appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236c757d%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_auto] bg-[right_14px_center] bg-no-repeat
                ${errors.propertyUsage ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-cyan-700"}`}
            >
              <option value="">-- Choisir --</option>
              <option value="principale">Votre résidence principale</option>
              <option value="secondaire">Résidence secondaire</option>
              <option value="autre">Autre</option>
            </select>
            {errors.propertyUsage && (
              <p className="text-red-500 text-xs mt-1">{errors.propertyUsage.message as string}</p>
            )}
          </div>
        </div>

        {/* Question : Envisagez-vous de vendre ? */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <label className="text-base font-medium text-slate-700">Envisagez-vous de vendre ce bien ?</label>
          <div className="w-full md:w-72">
            <select
              {...register("saleIntent")}
              className={`w-full p-3 bg-white border rounded-md outline-none transition-colors text-sm text-slate-700 cursor-pointer shadow-sm appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236c757d%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_auto] bg-[right_14px_center] bg-no-repeat
                ${errors.saleIntent ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-cyan-700"}`}
            >
              <option value="">-- Choisir --</option>
              <option value="des_que_possible">Oui, dès que possible</option>
              <option value="vente_commencee">J'ai commencé la vente</option>
              <option value="sous_3_mois">Oui, d'ici 3 mois</option>
              <option value="sous_6_mois">Oui, d'ici 6 mois</option>
              <option value="pas_de_projet">Je n'ai pas de projet de vente</option>
              <option value="vient_de_vendre">Non, je viens de le vendre</option>
            </select>
            {errors.saleIntent && (
              <p className="text-red-500 text-xs mt-1">{errors.saleIntent.message as string}</p>
            )}
          </div>
        </div>

        {/* Question : Contact en priorité */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <label className="text-base font-medium text-slate-700 max-w-sm">
            Souhaitez-vous être contacté <span className="font-bold">en priorité</span> par nos experts immobiliers ?
          </label>
          {/* HARMONISATION : Changement de bg-blue-500 vers bg-cyan-700 et arrondi en rounded-lg */}
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm h-11 shrink-0">
            <button
              type="button"
              onClick={() => handlePriorityContactChange(true)}
              className={`px-6 text-xs font-bold rounded-md transition-all ${priorityContact ? "bg-cyan-700 text-white shadow-md" : "text-slate-600 hover:text-black"}`}
            >
              Oui
            </button>
            <button
              type="button"
              onClick={() => handlePriorityContactChange(false)}
              className={`px-6 text-xs font-bold rounded-md transition-all ${!priorityContact ? "bg-cyan-700 text-white shadow-md" : "text-slate-600 hover:text-black"}`}
            >
              Non
            </button>
          </div>
        </div>

        {/* Bloc Téléphone Conditionnel */}
        {priorityContact && (
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 bg-slate-50 border border-slate-100 rounded-lg shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex gap-3 max-w-sm">
              <Info size={20} className="text-cyan-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Veuillez confirmer votre numéro de téléphone.</p>
                <p className="text-slate-500 text-xs mt-1 font-bold">Ce service est gratuit et sans engagement.</p>
              </div>
            </div>
            <div className="w-full md:w-72">
              <input
                type="tel"
                placeholder="Votre téléphone"
                {...register("phoneNumber")}
                className={`w-full p-3 bg-white border rounded-md outline-none transition-colors text-sm text-slate-700 shadow-sm focus:border-cyan-700
                  ${errors.phoneNumber ? "border-red-500" : "border-slate-300"}`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message as string}</p>
              )}
            </div>
          </div>
        )}

        {/* Barre de navigation basse */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onPrev} 
            className="text-slate-400 hover:text-slate-700 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors"
          >
            <ChevronLeft size={14} /> Retour
          </button>
          <button 
            type="submit" 
            className="flex items-center gap-3 bg-zinc-800 hover:bg-black text-white px-10 py-4  font-bold transition-all shadow-md uppercase tracking-widest text-xs active:scale-95 transition-transform"
          >
            Continuer <ChevronRight size={16} />
          </button>
        </div>

      </form>
    </div>
  );
};

export default StepUserProject;