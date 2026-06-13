"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Loader2, LogOut, CheckCircle2, FileText, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const firstName = user.user_metadata?.first_name;
          const fullName = user.user_metadata?.full_name;
          
          if (firstName) {
            setUserName(firstName);
          } else if (fullName) {
            setUserName(fullName.split(" ")[0]);
          } else {
            setUserName(user.email ? user.email.split("@")[0] : "utilisateur");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push('/auth/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-left">
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm max-w-md w-full space-y-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-2 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Chargement de votre espace Alamiia...</span>
          </div>
        ) : (
          <>
            {/* Message de Bienvenue et Notification de succès */}
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center justify-center bg-green-50 text-green-600 rounded-full p-2 mb-1">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Bonjour, <span className="text-cyan-700 capitalize">{userName}</span> !
              </h1>
              <p className="text-sm font-semibold text-green-700 bg-green-50/60 border border-green-100 rounded-lg p-2.5 inline-block w-full">
                ✨ Vos données d'estimation ont bien été enregistrées.
              </p>
            </div>

            {/* Explications de ce qui se passe en arrière-plan */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Traitement de votre dossier</h3>
              
              <div className="flex gap-3 items-start text-sm">
                <div className="p-1.5 bg-slate-100 rounded-md text-slate-700 mt-0.5">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Analyse de vos critères</p>
                  <p className="text-xs text-slate-500">Notre algorithme croise la surface, la localisation et les équipements de votre bien avec le marché actuel.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-sm">
                <div className="p-1.5 bg-slate-100 rounded-md text-slate-700 mt-0.5">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Rapport complet à venir</p>
                  <p className="text-xs text-slate-500">Votre tableau de bord Alamiia se mettra à jour automatiquement pour afficher votre prix m² et l'évolution historique.</p>
                </div>
              </div>
            </div>
            
            {/* Séparateur et Pied de page */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-4 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Interface en cours de développement
              </span>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
              </button>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}