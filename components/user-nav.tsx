"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserNavProps {
  user: User | null;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const supabase = createClient();

  // Si pas d'utilisateur, on affiche le bouton de connexion
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

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || "Utilisateur";
  const initials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {/* Lien vers le dashboard */}
      <Link href="/dashboard" className="text-sm font-medium hover:underline">
        Mon espace
      </Link>

      {/* L'avatar est maintenant un simple bouton-lien vers le dashboard */}
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