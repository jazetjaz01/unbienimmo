"use client";
import React, { useState } from 'react';
import StepAddress from '@/components/estimation/StepAddress';
import StepPropertyType from '@/components/estimation/StepPropertyType';
import StepPropertyDetails from '@/components/estimation/StepPropertyDetails';
import StepPropertyFeatures from '@/components/estimation/StepPropertyFeautures';
import StepPropertyDetailsRefined from '@/components/estimation/StepPropertyDetailsRefined';
import StepUserProject from '@/components/estimation/StepUserProject'; 
import StepFinalRegister from '@/components/estimation/StepFinalRegister'; // Nouvelle étape d'inscription Supabase
import { useEstimationStore } from '@/store/useEstimationStore';

export default function EstimationPage() {
  const [step, setStep] = useState(1);
  const { reset } = useEstimationStore();

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // Ce callback sera déclenché quand l'inscription classique ou via Google aura réussi
  const handleAuthSuccess = () => {
    // Redirection vers ta page de succès ou dashboard
    window.location.href = '/dashboard';
  };

  // Nous avons 7 étapes au total
  const totalSteps = 7; 

  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Barre de progression */}
        <div className="mb-12">
          <div className="flex justify-between mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <span>Étape {step} / {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-700 transition-all duration-700 ease-in-out" 
              style={{ width: `${(step / totalSteps) * 100}%` }} 
            />
          </div>
        </div>

        <div className="bg-white">
          {/* ÉTAPE 1 : ADRESSE */}
          {step === 1 && <StepAddress onNext={nextStep} />}

          {/* ÉTAPE 2 : TYPE DE BIEN */}
          {step === 2 && <StepPropertyType onNext={nextStep} onPrev={prevStep} />}

          {/* ÉTAPE 3 : SURFACES & PIÈCES */}
          {step === 3 && <StepPropertyDetails onNext={nextStep} onPrev={prevStep} />}

          {/* ÉTAPE 4 : CARACTÉRISTIQUES (Ascenseur, Balcon, etc.) */}
          {step === 4 && <StepPropertyFeatures onNext={nextStep} onPrev={prevStep} />}

          {/* ÉTAPE 5 : PRÉCISIONS (Période, État, Qualité) */}
          {step === 5 && <StepPropertyDetailsRefined onNext={nextStep} onPrev={prevStep} />}

          {/* ÉTAPE 6 : CE BIEN ET VOUS */}
          {step === 6 && <StepUserProject onNext={nextStep} onPrev={prevStep} />}

          {/* ÉTAPE 7 : CRÉATION DE COMPTE SUPABASE & FIN */}
          {step === 7 && (
            <StepFinalRegister 
              onSuccess={handleAuthSuccess} 
              onPrev={prevStep} 
            />
          )}
        </div>

        {/* BOUTON ANNULER */}
        <button 
          onClick={() => { 
            if(confirm("Voulez-vous vraiment annuler l'estimation ?")) {
              reset(); 
              window.location.href = "/"; 
            }
          }}
          className="mt-16 w-full text-center text-[10px] font-bold text-slate-300 hover:text-red-400 uppercase tracking-[0.2em] transition-colors"
        >
          Annuler l'estimation
        </button>
      </div>
    </main>
  );
}