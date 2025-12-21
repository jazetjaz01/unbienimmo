import EnergyScale from "./EnergyScale";
import { EnergyClass } from "@/lib/dpe/energy-class";

interface EnergyPerformanceProps {
  energyClass: EnergyClass | null;
  ghgClass: EnergyClass | null;
  energyValue?: number | null;
  ghgValue?: number | null;
}

export default function EnergyPerformance({
  energyClass,
  ghgClass,
  energyValue,
  ghgValue,
}: EnergyPerformanceProps) {
  if (!energyClass && !ghgClass) return null;

  return (
    <section className="mt-10 p-6 border rounded-xl shadow-sm bg-white space-y-6">
      <h3 className="text-lg font-semibold">
        Diagnostic de performance énergétique
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <EnergyScale
          title="Performance énergétique"
          subtitle="Consommation (énergie primaire)"
          value={energyClass}
          numberValue={energyValue}
          metric="kWh/m².an"
        />

        <EnergyScale
          title="Performance climatique"
          subtitle="(dont emissions de gaz à effet de serre)"
          value={ghgClass}
          numberValue={ghgValue}
          metric="kgCO₂/m².an"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Diagnostic réalisé après le 1er juillet 2021
      </p>
    </section>
  );
}
