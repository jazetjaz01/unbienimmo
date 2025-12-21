// ---------------------------------------
// Types et mapping DPE
// ---------------------------------------

export type EnergyClass = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export const ENERGY_CLASSES: Record<
  EnergyClass,
  { label: EnergyClass; color: string; text: string }
> = {
  A: { label: "A", color: "bg-emerald-600", text: "text-white" },
  B: { label: "B", color: "bg-lime-500", text: "text-black" },
  C: { label: "C", color: "bg-yellow-400", text: "text-black" },
  D: { label: "D", color: "bg-orange-400", text: "text-black" },
  E: { label: "E", color: "bg-orange-600", text: "text-white" },
  F: { label: "F", color: "bg-red-500", text: "text-white" },
  G: { label: "G", color: "bg-red-700", text: "text-white" },
};

// ---------------------------------------
// Calcul de la classe énergétique
// source : DPE post-1er juillet 2021
// unité : kWh/m²/an
// ---------------------------------------
export function getEnergyClass(value: number | null): EnergyClass | null {
  if (value === null || value === undefined) return null;

  if (value <= 70) return "A";
  if (value <= 110) return "B";
  if (value <= 180) return "C";
  if (value <= 250) return "D";
  if (value <= 330) return "E";
  if (value <= 420) return "F";
  return "G";
}

// ---------------------------------------
// Calcul de la classe GES (émissions)
// unité : kgCO₂/m²/an
// ---------------------------------------
export function getGhgClass(value: number | null): EnergyClass | null {
  if (value === null || value === undefined) return null;

  if (value <= 6) return "A";
  if (value <= 11) return "B";
  if (value <= 30) return "C";
  if (value <= 50) return "D";
  if (value <= 70) return "E";
  if (value <= 100) return "F";
  return "G";
}
