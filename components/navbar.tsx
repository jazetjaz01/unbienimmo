import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";

const Navbar = () => {
  return (
    <nav className="h-16 border-b bg-background">
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 ">
          <Logo />
         < p className="text-lg font-bold tracking-wide font-syncopate ">
            unbienimmo
            </p>

          {/* Desktop Menu */}
         
        </div>
 <NavMenu className="hidden md:block" />
        <div className="flex items-center gap-3">
          
          <Button>
           Se connecter <ArrowUpRight />
          </Button>

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
