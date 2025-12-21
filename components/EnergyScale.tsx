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

  // Couleurs Tailwind
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
      <div>
        <h4 className="font-semibold text-sm uppercase">{title}</h4>
        {subtitle && <p className="text-xs">{subtitle}</p>}
      </div>

      {numberValue !== null && numberValue !== undefined && metric && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
          
          {/* Valeur chiffrée avec bordure colorée */}
          <div
            className={clsx(
              "flex items-center gap-1 mb-2 sm:mb-0 mr-2 px-3 h-12 rounded-lg border-2 bg-white font-bold text-black",
              borderColorMap[value] // couleur de la bordure identique à la barre
            )}
          >
            <span className="text-lg">{numberValue}</span>
            <span className="text-sm">{metric}</span>
          </div>

          {/* Barre DPE */}
          <div className="relative flex-1 max-w-[50%] bg-gray-200 rounded-lg h-12">
            {/* Barre colorée */}
            <div
              className={clsx(
                "h-12 rounded-lg transition-all duration-500",
                bgColorMap[value], // couleur correcte pour le fond
                "w-full"
              )}
            ></div>

            {/* Badge lettre active */}
            <span
              className={clsx(
                "absolute right-0 top-0 h-12 flex items-center justify-center px-4 rounded-lg font-bold text-2xl",
                bgColorMap[value],
                "text-white"
              )}
            >
              {value}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
