import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { SunIcon } from "lucide-react";
import Link from "next/link";
import { AuthButton } from "./auth-button";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar"; 

const Navbar = () => {
  return (
    <nav className="h-auto p-4 bg-gradient-to-t from-gray-50 to-white">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
       
        {/* Colonne 1 : Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo />
            <span className="text-lg font-semibold">unbienimmo</span>
        </Link>
        
        {/* Colonne 2 : Barre de Recherche (Nouveau composant centré) */}
        <div className="hidden md:flex flex-grow justify-center">
            <SearchBar />
        </div>

        {/* Colonne 3 : Boutons de droite */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Suspense>
            <AuthButton />
          </Suspense>

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
