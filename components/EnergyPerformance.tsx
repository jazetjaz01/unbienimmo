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

  return (
    <section className="mt-10 p-6 border rounded-xl shadow-sm bg-white space-y-6">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold">
        Diagnostic de performance énergétique
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <EnergyScale
          title="Performance énergétique"
          subtitle="Consommation (énergie primaire)"
          value={energyClass}
          numberValue={energyValue ?? null}
          metric="kWh/m².an"
          annualCostMin={annualCostMin ?? null}
          annualCostMax={annualCostMax ?? null}
          diagnosticDate={diagnosticDate ?? null}
        />

        <EnergyScale
          title="Performance climatique"
          subtitle="(dont émissions de gaz à effet de serre)"
          value={ghgClass}
          numberValue={ghgValue ?? null}
          metric="kgCO₂/m².an"
        />
      </div>
    </section>
  );
}
