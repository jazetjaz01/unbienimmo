"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";


const supabase = createClient();

// Définir une interface pour plus de robustesse
interface Estimation {
  id: string;
  property_type: string;
  surface: number;
  address: string;
  created_at: string;
  estimated_price: number;
  market_price_m2?: number;
  coefficient?: number;
}

export function EstimationTable({ initialData }: { initialData: Estimation[] }) {
  const [estimations, setEstimations] = useState<Estimation[]>(initialData);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette estimation ?")) return;
    
    // Ajout de la gestion d'erreur
    const { error } = await supabase.from("estimations").delete().eq("id", id);
    
    if (error) {
      console.error("Erreur suppression:", error);
      alert("Impossible de supprimer cette estimation.");
      return;
    }

    setEstimations((prev) => prev.filter((est) => est.id !== id));
    router.refresh();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Réf.</TableHead>
            <TableHead>Bien</TableHead>
            <TableHead>Surface</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Prix Estimé</TableHead>
            <TableHead>Prix Marché (m²)</TableHead>
            <TableHead>Coeff.</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estimations.map((est) => (
            <TableRow key={est.id}>
              <TableCell className="font-mono text-xs text-slate-500">
                #{est.id.slice(0, 8).toUpperCase()}
              </TableCell>
              <TableCell className="capitalize">{est.property_type || "N/A"}</TableCell>
              <TableCell>{est.surface} m²</TableCell>
              <TableCell className="font-medium">{est.address}</TableCell>
              <TableCell>{new Date(est.created_at).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(est.estimated_price)}
              </TableCell>
              <TableCell>{est.market_price_m2 ? `${est.market_price_m2} €/m²` : "N/A"}</TableCell>
              <TableCell>
                {est.coefficient ? (
                  <span className={`px-2 py-1 rounded text-xs ${est.coefficient < 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {est.coefficient}
                  </span>
                ) : "-"}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleDelete(est.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}