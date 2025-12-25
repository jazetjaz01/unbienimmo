'use client';

import { EnergyClass } from "@/lib/dpe/energy-class";
import { Info } from "lucide-react";

interface EnergyPerformanceProps {
  energyClass: EnergyClass | null;
  ghgClass: EnergyClass | null;
  energyValue?: number | null;
  ghgValue?: number | null;
  annualCostMin?: number | null;
  annualCostMax?: number | null;
  diagnosticDate?: string | null;
  // Changement ici pour correspondre au nom de la colonne SQL
  energy_reference_year?: string | null; 
}

export default function EnergyPerformance({
  energyClass,
  ghgClass,
  energyValue,
  ghgValue,
  annualCostMin,
  annualCostMax,
  diagnosticDate,
  energy_reference_year, // Utilisation du nom SQL
}: EnergyPerformanceProps) {
  
  const dpeStyles: Record<string, string> = {
    'A': 'bg-[#00a650]',
    'B': 'bg-[#52b145]',
    'C': 'bg-[#c4d400]',
    'D': 'bg-[#fff200]',
    'E': 'bg-[#fbb900]',
    'F': 'bg-[#ee7d00]',
    'G': 'bg-[#e2001a]',
  };

  const formatDateFull = (dateStr: string | null | undefined) => {
    if (!dateStr) return "données non communiquées";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "données non communiquées";
    return `le ${new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)}`;
  };

  const renderSimpleBar = (label: string, currentClass: string | null, value: number | null, unit: string) => {
    const activeColor = currentClass ? dpeStyles[currentClass] : 'bg-gray-200';
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter text-gray-900 leading-none">{currentClass ?? '-'}</span>
              <span className="text-[11px] font-bold text-gray-500 uppercase">{value ?? 'N/C'} {unit}</span>
            </div>
          </div>
        </div>
        <div className="relative h-8 w-full bg-gray-100 overflow-hidden rounded-none">
          <div className={`absolute inset-0 transition-all duration-1000 ${activeColor}`} />
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-12">
      <div className=" ">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-gray-900">
          Diagnostic Performance Énergétique
        </h3>
        <p className="text-[10px] uppercase tracking-widest mt-2 text-gray-500">
          Date de réalisation du diagnostic : {formatDateFull(diagnosticDate)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {renderSimpleBar("Consommation Énergie", energyClass, energyValue ?? null, "kWh/m².an")}
        {renderSimpleBar("Émissions de Gaz", ghgClass, ghgValue ?? null, "kgCO₂/m².an")}
      </div>

      {(annualCostMin != null || annualCostMax != null) && (
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Coût annuel estimé</h4>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.15em] leading-relaxed">
              {/* Utilisation de la variable avec underscore */}
              Prix moyens des énergies indexés au {energy_reference_year || 'données non communiquées'}.
            </p>
          </div>
          <div className="text-base font-bold tracking-tight text-gray-900 bg-gray-50 px-4 py-2 border border-gray-100">
            <span>{annualCostMin?.toLocaleString('fr-FR')} €</span>
            <span className="text-gray-300 mx-3">/</span>
            <span>{annualCostMax?.toLocaleString('fr-FR')} € <span className="text-[10px] font-normal uppercase ml-1">par an</span></span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 opacity-70">
        <Info size={14} className="mt-0.5 text-gray-400 flex-shrink-0" />
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.1em] leading-loose max-w-2xl">
          Logement à consommation énergétique {energyClass && ['F', 'G'].includes(energyClass) ? 'excessive' : 'standard'}. 
          Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : <a href="https://www.georisques.gouv.fr" target="_blank" className="text-gray-900 underline underline-offset-4 font-bold">www.georisques.gouv.fr</a>
        </p>
      </div>
    </section>
  );
}