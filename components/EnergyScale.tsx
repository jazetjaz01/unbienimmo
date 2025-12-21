
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="font-semibold text-sm uppercase">{title}</h4>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Valeur chiffrée */}
      {numberValue !== null && numberValue !== undefined && metric && (
        <p className="text-sm flex items-baseline gap-1">
          <span className="text-lg font-bold">{numberValue}</span>
          <span className="text-muted-foreground">{metric}</span>
        </p>
      )}

      {/* Barre active avec badge coloré */}
      <div className="mt-2">
        <div
          className={clsx(
            "flex items-center h-7 rounded-sm text-sm font-semibold px-2",
            value === "A" && "bg-emerald-600 text-white",
            value === "B" && "bg-lime-500 text-black",
            value === "C" && "bg-yellow-400 text-black",
            value === "D" && "bg-orange-400 text-black",
            value === "E" && "bg-orange-600 text-white",
            value === "F" && "bg-red-500 text-white",
            value === "G" && "bg-red-700 text-white"
          )}
        >
          <span className="w-4">{value}</span>
          <span
            className={clsx(
              "ml-auto px-2 py-0.5 rounded text-xs font-bold",
              value === "A" && "bg-emerald-600 text-white",
              value === "B" && "bg-lime-500 text-black",
              value === "C" && "bg-yellow-400 text-black",
              value === "D" && "bg-orange-400 text-black",
              value === "E" && "bg-orange-600 text-white",
              value === "F" && "bg-red-500 text-white",
              value === "G" && "bg-red-700 text-white"
            )}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
