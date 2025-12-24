"use client";

import { EnergyClass } from "@/lib/dpe/energy-class";
import { cn } from "@/lib/utils";

interface EnergyScaleProps {
  value: EnergyClass | null;
  title?: string; // Optionnel pour corriger l'erreur TS
  subtitle?: string;
  metric?: string;
  numberValue?: number | null;
}

const CLASSES: EnergyClass[] = ["A", "B", "C", "D", "E", "F", "G"];

// Couleurs officielles DPE version Flat
const bgColorMap: Record<EnergyClass, string> = {
  A: "bg-[#009640]",
  B: "bg-[#52B145]",
  C: "bg-[#C4D42D]",
  D: "bg-[#F3E500]",
  E: "bg-[#F9A11B]",
  F: "bg-[#EB690B]",
  G: "bg-[#D4002B]",
};

export default function EnergyScale({
  value,
  title,
  subtitle,
  metric,
  numberValue,
}: EnergyScaleProps) {
  if (!value) return null;

  return (
    <div className="space-y-6 w-full max-w-md">
      {/* HEADER FACULTATIF */}
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">{title}</h4>}
          {subtitle && <p className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">{subtitle}</p>}
        </div>
      )}

      {/* ÉCHELLE GRAPHIQUE */}
      <div className="flex flex-col gap-1.5">
        {CLASSES.map((cls) => {
          const isActive = value === cls;

          return (
            <div key={cls} className="flex items-center gap-4">
              {/* Barre de l'échelle */}
              <div
                className={cn(
                  "h-8 flex items-center justify-between px-3 transition-all duration-700 ease-in-out",
                  bgColorMap[cls],
                  isActive 
                    ? "w-full ring-1 ring-gray-900 ring-offset-2" 
                    : "w-[40%] opacity-20 grayscale-[0.3]"
                )}
                style={{ 
                  width: isActive ? "100%" : `${30 + CLASSES.indexOf(cls) * 10}%` 
                }}
              >
                <span className="text-white text-[11px] font-bold tracking-widest">
                  {cls}
                </span>

                {isActive && numberValue && (
                  <div className="text-white text-[10px] font-bold tracking-tighter animate-in fade-in duration-1000">
                    {numberValue} {metric}
                  </div>
                )}
              </div>

              {/* Curseur textuel discret */}
              {isActive && (
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-900 italic whitespace-nowrap hidden sm:block">
                  Logement
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}