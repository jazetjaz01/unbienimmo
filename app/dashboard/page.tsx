import { createClient } from "@/lib/supabase/server";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { EstimationTable } from "@/components/EstimationTable";
import { Button } from "@/components/ui/button"; // Assure-toi d'avoir ce composant
import Link from "next/link";
import { Plus } from "lucide-react"; // Optionnel : pour une icône

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: estimations } = await supabase
    .from("estimations")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Mes estimations</h1>
        </div>
        
        {/* Lien vers la page d'estimation */}
        <Button asChild>
          <Link href="/estimation-immobiliere">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle estimation
          </Link>
        </Button>
      </header>

      {estimations && estimations.length > 0 ? (
        <EstimationTable initialData={estimations} />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p className="mb-4">Vous n'avez pas encore effectué d'estimation.</p>
          <Button variant="outline" asChild>
            <Link href="/estimation-immobiliere">Créer ma première estimation</Link>
          </Button>
        </div>
      )}
    </div>
  );
}