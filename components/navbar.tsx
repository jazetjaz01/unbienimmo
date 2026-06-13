import { ArrowUpRight } from "lucide-react";
import Link from "next/link"; // Import de Link
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { UserNav } from "./user-nav";
import { createClient } from "@/lib/supabase/server";

const Navbar = async() => {
  const supabase = await createClient();
  // On récupère l'utilisateur côté serveur
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <nav className="h-16 border-b bg-background">
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Le Link enveloppe le Logo et le nom pour les rendre cliquables */}
        <Link href="/" className="flex items-center gap-1 transition-opacity hover:opacity-80">
          <Logo />
          <p className="text-sm md:text-xl font-bold tracking-[0.2em] uppercase font-syncopate">
  unbienimmo
</p>
        </Link>

        <NavMenu className="hidden md:block" />
        
        <div className="flex items-center gap-3">
           <UserNav user={user} />

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;