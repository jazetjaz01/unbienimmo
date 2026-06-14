"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose, // Import nécessaire pour fermer le menu
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { foods, travelMenuItems } from "@/config/navbar";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      
      <SheetContent className="px-6 py-3">
        <Logo />

        <div className="mt-12 space-y-4 text-base">
          {/* Lien Accueil */}
          <SheetClose asChild>
            <Link className="inline-block font-bold" href="/">
              Accueil
            </Link>
          </SheetClose>

          {/* Section Services (Food remplacé par votre thématique) */}
          <div>
            <div className="font-bold">Nos Services</div>
            <ul className="mt-2 ml-1 space-y-3 border-l pl-4">
              {foods.map((foodItem) => (
                <li key={foodItem.title}>
                  <SheetClose asChild>
                    {/* Assurez-vous que foodItem possède un href dans votre config */}
                    <Link className="flex items-center gap-2" href={foodItem.href}>
                      <foodItem.icon className="mr-2 h-5 w-5 text-muted-foreground" />
                      {foodItem.title}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Voyage (Travel) */}
          <div>
            <div className="font-bold">Découverte</div>
            <ul className="mt-2 ml-1 space-y-3 border-l pl-4">
              {travelMenuItems.map((item) => (
                <li key={item.title}>
                  <SheetClose asChild>
                    {/* Assurez-vous que item possède un href dans votre config */}
                    <Link className="flex items-center gap-2" href={item.href}>
                      <item.icon className="mr-2 h-5 w-5 text-muted-foreground" />
                      {item.title}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};