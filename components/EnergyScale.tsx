import { EnergyClass } from "@/lib/dpe/energy-class";
import clsx from "clsx";

interface EnergyScaleProps {
  value: EnergyClass | null;
  title: string;
  subtitle?: string;
  metric?: string;
  numberValue?: number | null;
  annualCostMin?: number | null;
  annualCostMax?: number | null;
  diagnosticDate?: string | null;
}

export default function EnergyScale({
  value,
  title,
  subtitle,
  metric,
  numberValue,
  annualCostMin,
  annualCostMax,
  diagnosticDate,
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

  // Formatage date
  const formatDateFR = (date: string) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Europe/Paris",
    }).format(new Date(date));

  return (
    <div className="space-y-2">
      {/* Titre et sous-titre */}
      <div>
        <h4 className="font-semibold text-sm uppercase">{title}</h4>
        {subtitle && <p className="text-xs">{subtitle}</p>}
      </div>

      {/* Valeur chiffrée + barre DPE */}
      {numberValue != null && metric && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
          <div
            className={clsx(
              "flex items-center gap-1 mb-2 sm:mb-0 mr-2 px-3 h-12 rounded-lg border-2 bg-white font-bold text-black",
              borderColorMap[value]
            )}
          >
            <span className="text-lg">{numberValue}</span>
            <span className="text-sm">{metric}</span>
          </div>

          <div className="relative flex-1 max-w-[75%] bg-gray-200 rounded-lg h-12">
            <div
              className={clsx(
                "h-12 rounded-lg transition-all duration-500",
                bgColorMap[value],
                "w-full"
              )}
            ></div>

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

      {/* Montants annuels et date du diagnostic */}
      {(annualCostMin != null || annualCostMax != null || diagnosticDate) && (
        <div className="mt-2 text-sm space-y-1">
          {(annualCostMin != null || annualCostMax != null) && (
            <p>
              Montant estimé des dépenses annuelles d’énergie pour un usage
              standard :{" "}
              {annualCostMin != null && <>entre {annualCostMin.toLocaleString("fr-FR")} €</>}
              {annualCostMin != null && annualCostMax != null && <> et </>}
              {annualCostMax != null && <>{annualCostMax.toLocaleString("fr-FR")} €</>} par an
            </p>
          )}

          {diagnosticDate ? (
            <p>Diagnostic réalisé le {formatDateFR(diagnosticDate)}</p>
          ) : (
            <p className="text-muted-foreground">Date du diagnostic non disponible</p>
          )}
        </div>
      )}
    </div>
  );
}
