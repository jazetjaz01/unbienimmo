import Link from "next/link";
import { User } from "@supabase/supabase-js"; // Import du type User
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { UserNav } from "./user-nav";

interface NavbarProps {
  user: User | null; // La Navbar reçoit désormais l'utilisateur en prop
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="h-16 border-b bg-background">
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Logo />
          <p className="text-sm md:text-lg tracking-wide font-bold font-syncopate">
            unbienimmo
          </p>
        </Link>

        <NavMenu className="hidden md:block" />
        
        <div className="flex items-center gap-3">
           {/* On passe l'utilisateur reçu en prop à UserNav */}
           <UserNav user={user} />

          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;