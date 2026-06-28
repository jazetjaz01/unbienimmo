"use client";

import { useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  prix: { label: "Prix m²", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export function EvolutionChart({ dataAppt, dataMaison }: { dataAppt: any[], dataMaison: any[] }) {
  const [type, setType] = useState<'appt' | 'maison'>('appt');
  const data = type === 'appt' ? dataAppt : dataMaison;

  // Calcul des variations
  const stats = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const latest = data[data.length - 1].prix_m2;
    const currentYear = data[data.length - 1].annee;

    const getVariation = (yearsAgo: number) => {
      const targetYear = currentYear - yearsAgo;
      const targetData = data.find(d => d.annee === targetYear);
      if (!targetData) return null;
      
      const variation = ((latest - targetData.prix_m2) / targetData.prix_m2) * 100;
      return variation > 0 ? `+${variation.toFixed(1)}%` : `${variation.toFixed(1)}%`;
    };

    return [
      { label: "1 an", value: getVariation(1) },
      { label: "2 ans", value: getVariation(2) },
      { label: "5 ans", value: getVariation(5) },
      { label: "10 ans", value: getVariation(10) },
    ].filter(s => s.value !== null);
  }, [data]);

  return (
    <div className="w-full space-y-4">
      {/* Sélecteur d'onglet */}
      <div className="flex bg-gray-100 p-1 rounded-md w-fit">
        <Button size="sm" variant={type === 'appt' ? 'default' : 'ghost'} onClick={() => setType('appt')}>Appartement</Button>
        <Button size="sm" variant={type === 'maison' ? 'default' : 'ghost'} onClick={() => setType('maison')}>Maison</Button>
      </div>

      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <AreaChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis 
            dataKey="annee" 
            type="number" 
            domain={['dataMin', 'dataMax']} 
            tickFormatter={(v) => v.toString()} 
          />
          <YAxis domain={['auto', 'auto']} hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area 
            type="monotone" 
            dataKey="prix_m2" 
            stroke="teal" 
            fill="teal" 
            fillOpacity={0.2} 
          />
        </AreaChart>
      </ChartContainer>

      {/* Grille des statistiques avec couleur conditionnelle */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t">
        {stats.map((stat) => {
          const isNegative = stat.value?.startsWith('-');
          return (
            <div key={stat.label} className="text-center">
              <p className="text-[10px] text-gray-500 uppercase">{stat.label}</p>
              <p className={`text-sm font-bold ${isNegative ? 'text-red-600' : 'text-teal-700'}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}