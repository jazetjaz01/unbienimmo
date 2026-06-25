"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User as UserIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  // 1. État de chargement : On affiche un squelette ou un spinner pour éviter le "saut"
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  // 2. Si pas d'utilisateur, on affiche le bouton de connexion
  if (!user) {
    return (
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/auth/login">
          <UserIcon className="size-4" />
          Se connecter
        </Link>
      </Button>
    );
  }

  // 3. Utilisateur connecté
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || "Utilisateur";
  const initials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Link href="/dashboard" className="text-sm font-medium hover:underline hidden md:block">
        Mon espace
      </Link>

      <Button variant="ghost" asChild className="relative h-10 w-10 rounded-full">
        <Link href="/dashboard">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Link>
      </Button>
    </div>
  );
}