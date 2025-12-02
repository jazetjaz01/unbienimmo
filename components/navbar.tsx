import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { SunIcon } from "lucide-react";
import { Suspense } from "react";
import { AuthButton } from "./auth-button";


const Navbar = () => {
  return (
    <nav className="h-16 bg-background ">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <p className="text-lg font-semibold tracking-wider">unbienimmo</p>

          {/* Desktop Menu */}
         
        </div>
        <div>
        <div>
 
</div>


        </div>

        <div className="flex items-center gap-3">
           <NavMenu className="hidden md:block" />
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
