"use client";

import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js"; // Import du type
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// ATTENTION : Tu dois ajouter { children, user } ici
export default function LayoutWrapper({ 
  children, 
  user 
}: { 
  children: React.ReactNode, 
  user: User | null 
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      {/* Et tu le passes ici */}
      {!isDashboard && <Navbar user={user} />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}