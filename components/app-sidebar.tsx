"use client";
import Link from "next/link"; // Assure-toi d'importer Link
import * as React from "react";
import { 
  LayoutDashboard, 
  Home, 
  TrendingUp, 
  Settings, 
  User, 
  MapPin, 
  Calculator,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        {/* On utilise un Link pour rendre tout le bloc cliquable vers la racine "/" */}
        <Link href="/" className="flex items-center gap-2 px-1 hover:opacity-80 transition-opacity">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cyan-700 text-white">
            <Home className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">Unbienimmo</span>
            <span className="text-[10px] text-muted-foreground uppercase">Espace Propriétaire</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Mon Espace */}
        <SidebarGroup>
          <SidebarGroupLabel>Mon Espace</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard/profile"><User /> Mon Profil</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
              {/*<SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard/settings"><Settings /> Paramètres</a>
              </SidebarMenuButton>
            </SidebarMenuItem>*/}
          </SidebarMenu>
        </SidebarGroup>

        {/* Gestion */}
        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard"><LayoutDashboard /> Tableau de bord</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*<SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard/estimations"><Home /> Mes Estimations</a>
              </SidebarMenuButton>
            </SidebarMenuItem>*/}
            {/*<SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard/simulateur"><Calculator /> Simulateur</a>
              </SidebarMenuButton>
           </SidebarMenuItem>*/}
          </SidebarMenu>
        </SidebarGroup>

        {/* 
        <SidebarGroup>
          <SidebarGroupLabel>Marché Local</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/marche/tendance">
                  <TrendingUp className="text-emerald-500" /> 
                  Tendance : <span className="font-bold">+1.2%</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/marche/secteur"><MapPin /> Mon secteur</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        Marché Local */}
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/">
                <ArrowLeft className="size-4" />
                Retour au site
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="size-4" />
              Se déconnecter
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}