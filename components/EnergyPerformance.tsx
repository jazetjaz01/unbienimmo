import EnergyScale from "./EnergyScale";
import { EnergyClass } from "@/lib/dpe/energy-class";

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
      month: "short",
      year: "numeric",
      timeZone: "Europe/Paris",
    }).format(new Date(date));

  return (
    <section className="mt-10 p-6 border rounded-xl shadow-sm bg-white space-y-2">
      {/* Titre */}
      <h3 className="text-base sm:text-lg md:text-xl font-semibold">
        Diagnostic de performance énergétique
      </h3>

      {/* Montants + date */}
      {(annualCostMin != null || annualCostMax != null || diagnosticDate) && (
        <div className="text-sm space-y-1">
          {(annualCostMin != null || annualCostMax != null) && (
            <p>
              Montant estimé des dépenses annuelles d’énergie pour un usage standard :{" "}
              {annualCostMin != null && <>entre {annualCostMin.toLocaleString("fr-FR")} €</>}
              {annualCostMin != null && annualCostMax != null && <> et </>}
              {annualCostMax != null && <>{annualCostMax.toLocaleString("fr-FR")} €</>} par an
              
            </p>
            
          )}

          {diagnosticDate ? (
            <p>Diagnostic réalisé le {formatDateFR(diagnosticDate)}</p>
          ) : (
            <p className="text-muted-foreground">
              Date du diagnostic non disponible
            </p>
            
          )}
          
        </div>
      )}

      {/* Performances énergétiques + GES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <EnergyScale
          title="Performance énergétique"
          subtitle="Consommation (énergie primaire)"
          value={energyClass}
          numberValue={energyValue ?? null}
          metric="kWh/m².an"
        />

        <EnergyScale
          title="Performance climatique"
          subtitle="(dont émissions de gaz à effet de serre)"
          value={ghgClass}
          numberValue={ghgValue ?? null}
          metric="kgCO₂/m².an"
        />
      </div>
      <div className="text-gray-500 text-sm pt-2 ">Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques : www.georisques.gouv.fr"</div>
    </section>
  );
}
