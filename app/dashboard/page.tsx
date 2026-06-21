import { createClient } from "@/lib/supabase/server";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { EstimationTable } from "@/components/EstimationTable";

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
      <header className="mb-6 flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Mes estimations</h1>
      </header>

      {estimations && estimations.length > 0 ? (
        <EstimationTable initialData={estimations} />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Vous n'avez pas encore effectué d'estimation.
        </div>
      )}
    </div>
  );
}