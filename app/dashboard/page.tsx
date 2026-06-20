// app/dashboard/page.tsx
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <SidebarTrigger /> {/* Permet de toggle la sidebar */}
      </header>
      
      {/* Ton contenu de dashboard ici */}
      <h1 className="text-2xl font-bold">Bienvenue dans votre espace</h1>
    </div>
  );
}