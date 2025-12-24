"use client";

import EnergyScale from "./EnergyScale";
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
}

export default function EnergyPerformance({
  energyClass,
  ghgClass,
  energyValue,
  ghgValue,
  annualCostMin,
  annualCostMax,
  diagnosticDate,
}: EnergyPerformanceProps) {
  if (!energyClass && !ghgClass) return null;

  const formatDateFR = (date: string) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Paris",
    }).format(new Date(date));

  return (
    <section className="mt-16 space-y-16">
      {/* HEADER SECTION */}
      <div className="border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-900">
            DPE & GES
          </h3>
          <p className="text-3xl font-light tracking-tighter text-gray-900 italic">
            Performance du bâtiment
          </p>
        </div>
        
        {diagnosticDate && (
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            Établi le {formatDateFR(diagnosticDate)}
          </span>
        )}
      </div>

      {/* GRILLE DES ÉCHELLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32">
        {/* Énergie */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gray-900" />
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900">
              Consommation énergétique
            </h4>
          </div>
          <EnergyScale
            value={energyClass}
            numberValue={energyValue ?? null}
            metric="kWh/m².an"
          />
        </div>

        {/* GES */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gray-900" />
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900">
              Émissions de gaz
            </h4>
          </div>
          <EnergyScale
            value={ghgClass}
            numberValue={ghgValue ?? null}
            metric="kgCO₂/m².an"
          />
        </div>
      </div>

      {/* FOOTER TECHNIQUE */}
      <div className="pt-12 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Estimation des coûts */}
        {(annualCostMin != null || annualCostMax != null) && (
          <div className="space-y-4 bg-gray-50/50 p-10 border border-gray-100">
            <h5 className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 italic">
              Dépenses annuelles estimées
            </h5>
            <p className="text-2xl font-light tracking-tighter text-gray-900 italic">
              {annualCostMin?.toLocaleString("fr-FR")} € — {annualCostMax?.toLocaleString("fr-FR")} €
            </p>
            <p className="text-[9px] text-gray-400 leading-relaxed uppercase tracking-widest">
              Prix indexés au 01/01/2021.
            </p>
          </div>
        )}

        {/* Mentions Légales */}
        <div className="flex flex-col justify-end">
          <div className="flex items-start gap-4">
            <Info className="h-4 w-4 text-gray-300 mt-1 flex-shrink-0" />
            <p className="text-[9px] text-gray-400 leading-loose uppercase tracking-[0.2em]">
              Informations Géorisques disponibles sur : 
              <a 
                href="https://www.georisques.gouv.fr" 
                target="_blank" 
                className="text-gray-900 hover:italic block underline underline-offset-4 mt-2"
              >
                www.georisques.gouv.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}