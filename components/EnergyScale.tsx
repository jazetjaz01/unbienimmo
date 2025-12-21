import { EnergyClass } from "@/lib/dpe/energy-class";
import clsx from "clsx";

interface EnergyScaleProps {
  value: EnergyClass | null;
  title: string;
  subtitle?: string;
  metric?: string;
  numberValue?: number | null;
}

export default function EnergyScale({
  value,
  title,
  subtitle,
  metric,
  numberValue,
}: EnergyScaleProps) {
  if (!value) return null;

  const borderColorMap: Record<EnergyClass, string> = {
    A: "border-emerald-600",
    B: "border-lime-500",
    C: "border-yellow-400",
    D: "border-orange-400",
    E: "border-orange-600",
    F: "border-red-500",
    G: "border-red-700",
  };

  const bgColorMap: Record<EnergyClass, string> = {
    A: "bg-emerald-600",
    B: "bg-lime-500",
    C: "bg-yellow-400",
    D: "bg-orange-400",
    E: "bg-orange-600",
    F: "bg-red-500",
    G: "bg-red-700",
  };

  return (
    <div className="space-y-2">
      {/* Titre */}
      <div>
        <h4 className="font-semibold text-sm ">{title}</h4>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Ligne valeur + bande */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
        {/* Valeur chiffrée */}
        {numberValue != null && metric && (
          <div
            className={clsx(
              "flex items-center gap-1 px-3 h-12 rounded-lg border-2 bg-white font-bold text-black w-fit",
              borderColorMap[value]
            )}
          >
            <span className="text-lg">{numberValue}</span>
            <span className="text-sm">{metric}</span>
          </div>
        )}

        {/* Bande DPE */}
        <div className="relative flex-1 h-12 mt-2 sm:mt-0  rounded-lg overflow-hidden">
          {/* Bande colorée (75%) avec padding gauche */}
          <div
            className={clsx(
              "h-full pl-12 transition-all duration-500",
              bgColorMap[value],
              "w-1/2 rounded-lg"
            )}
          />

          {/* Lettre intégrée */}
          <span
            className={clsx(
              "absolute left-2 top-0 h-full w-10 flex items-center justify-center font-bold text-2xl text-white",
              bgColorMap[value]
            )}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
