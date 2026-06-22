"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

const supabase = createClient();

interface Estimation {
  id: string;
  property_type: string; // 'apartment' ou 'house'
  surface: number;
  address: string;
  created_at: string;
  estimated_price: number;
  market_price_m2?: number;
  coefficient?: number;
  confidence_score?: number;
  nb_transactions_reference?: number;
}

export function EstimationTable({ initialData }: { initialData: Estimation[] }) {
  const [estimations, setEstimations] = useState<Estimation[]>(initialData);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  // Fonction pour rendre le type de bien lisible
  const formatPropertyType = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'apartment': return 'Appartement';
      case 'house': return 'Maison';
      default: return type || "N/A";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette estimation ?")) return;
    
    setDeletingId(id);
    const { error } = await supabase.from("estimations").delete().eq("id", id);
    
    if (error) {
      console.error("Erreur suppression:", error);
      alert("Impossible de supprimer cette estimation.");
      setDeletingId(null);
      return;
    }

    setEstimations((prev) => prev.filter((est) => est.id !== id));
    setDeletingId(null);
    router.refresh();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Réf.</TableHead>
            <TableHead>Typologie</TableHead>
            <TableHead>Surface</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Prix Estimé</TableHead>
            <TableHead>Prix Marché (m²)</TableHead>
            <TableHead>Coeff.</TableHead>
            <TableHead>Fiabilité</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estimations.map((est) => (
            <TableRow key={est.id}>
              <TableCell className="font-mono text-xs text-slate-500">
                #{est.id.slice(0, 8).toUpperCase()}
              </TableCell>
              <TableCell className="font-medium">
                {formatPropertyType(est.property_type)}
              </TableCell>
              <TableCell>{est.surface} m²</TableCell>
              <TableCell className="font-medium">{est.address}</TableCell>
              <TableCell>{new Date(est.created_at).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(est.estimated_price)}
              </TableCell>
              <TableCell>
                {est.market_price_m2 ? `${Math.round(est.market_price_m2)} €/m²` : "N/A"}
              </TableCell>
              <TableCell>
                {est.coefficient ? (
                  <span className={`px-2 py-1 rounded text-xs ${est.coefficient < 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {est.coefficient.toFixed(2)}
                  </span>
                ) : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        (est.confidence_score || 0) > 70 ? 'bg-green-500' : 
                        (est.confidence_score || 0) > 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${est.confidence_score || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold">{est.confidence_score || 0}%</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {est.nb_transactions_reference || 0} transactions
                </p>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(est.id)}
                  disabled={deletingId === est.id}
                >
                  {deletingId === est.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}