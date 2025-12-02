"use client";

import { useState } from "react";
import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import SelectableIcons from "@/components/SelectableIcons";
import SearchBar from "@/components/SearchBar";
import IconSearchBar from "@/components/IconSearchBar";

export default function Home() {
  const [selectedIcon, setSelectedIcon] = useState("Achat"); // ✅ AJOUT

  return (
    <main className="min-h-screen flex flex-col items-center">
      <IconSearchBar />
    </main>
  );
}
