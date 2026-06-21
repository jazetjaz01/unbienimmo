"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck, Heart, Eye, EyeOff, Loader2, Home } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";
import { useEstimationStore } from "@/store/useEstimationStore";

const supabase = createClient();

interface StepProps {
  onSuccess: () => void;
  onPrev: () => void;
}

const StepFinalRegister = ({ onSuccess, onPrev }: StepProps) => {
  const router = useRouter();
  const { data: estimationData } = useEstimationStore();
  const isProcessing = useRef(false);

  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);

  const [civility, setCivility] = useState<'madame' | 'monsieur'>('madame');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(estimationData.phoneNumber || '');
  const [email, setEmail] = useState(estimationData.email || '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (estimationData.phoneNumber) setPhoneNumber(estimationData.phoneNumber);
    if (estimationData.email) setEmail(estimationData.email);
  }, [estimationData]);

  const handleProcessAllData = async (user: any) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams({
        lat: estimationData.lat?.toString() || "0",
        lon: estimationData.lon?.toString() || "0",
        postcode: estimationData.postcode || "",
        surface: estimationData.surface?.toString() || "0",
      });

      const response = await fetch(`/api/estimation?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Erreur lors du calcul de l'estimation");
     

      const result = await response.json();
      const calculatedPrice = result.estimation;

      const payload = {
        user_id: user.id,
        estimated_price: calculatedPrice,
        market_price_m2: result.prixM2, 
  coefficient: result.coefficientApplique, 
        address: estimationData.address || "",
        city: estimationData.city || "",
        postcode: estimationData.postcode || "",
        lat: estimationData.lat,
        lon: estimationData.lon,
        property_type: estimationData.propertyType || "appartement",
        surface: Number(estimationData.surface) || 0,
        land_surface: estimationData.landSurface ? Number(estimationData.landSurface) : null,
        rooms: Number(estimationData.rooms) || 1,
        bathrooms: Number(estimationData.bathrooms) || 1,
        floor: Number(estimationData.floor) || 0,
        total_floors: Number(estimationData.totalFloors) || 1,
        has_elevator: !!estimationData.hasElevator,
        has_balcony: !!estimationData.hasBalcony,
        balcony_surface: Number(estimationData.balconySurface) || 0,
        has_terrace: !!estimationData.hasTerrace,
        terrace_surface: Number(estimationData.terraceSurface) || 0,
        has_cellar: !!estimationData.hasCellar,
        cellar_count: Number(estimationData.cellarCount) || 0,
        has_parking: !!estimationData.hasParking,
        parking_count: Number(estimationData.parkingCount) || 0,
        has_service_room: !!estimationData.hasServiceRoom,
        service_room_count: Number(estimationData.serviceRoomCount) || 0,
        has_great_view: !!estimationData.hasGreatView,
        renovated_common_areas: !!estimationData.renovatedCommonAreas,
        recent_facading: !!estimationData.recentFacading,
        construction_period: estimationData.constructionPeriod || null,
        property_state: estimationData.propertyState || "standard",
        property_quality: estimationData.propertyQuality || "comparable",
        
        user_type: estimationData.userType || "particulier",
        is_owner: estimationData.isOwner !== undefined ? estimationData.isOwner : true,
        property_usage: estimationData.propertyUsage || null,
        sale_intent: estimationData.saleIntent || null,
        priority_contact: !!estimationData.priorityContact,
        phone_number: phoneNumber || user.user_metadata?.phone_number || ""
      };

      // Utilisation de upsert pour gérer l'unicité via l'index SQL
      const { error: insertError } = await supabase
        .from('estimations')
        .upsert([payload], { onConflict: 'user_id, address' });

      if (insertError) throw insertError;

      onSuccess();
      // Navigation forcée pour éviter les conflits RSC de Next.js
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error("Erreur critique:", error);
      setAuthError("Erreur lors de la sauvegarde : " + error.message);
      setLoading(false);
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkUserAndProcess = async () => {
      if (typeof window !== 'undefined' && window.location.pathname === '/dashboard') return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user && isMounted) {
        setIsGoogleAuthenticated(true);
        await handleProcessAllData(user);
      }
    };
    
    checkUserAndProcess();
    return () => { isMounted = false; };
  }, []);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email || !password) return setAuthError("Champs obligatoires.");
    
    setLoading(true);
    try {
      let activeUser = null;
      if (isLoginMode) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        activeUser = data.user;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { first_name: firstName, last_name: lastName, phone_number: phoneNumber, civility } }
        });
        if (error) throw error;
        activeUser = data.user;
      }

      if (activeUser) await handleProcessAllData(activeUser);
    } catch (error: any) {
      setAuthError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto pb-12 font-sans text-left">
      
      {/* En-tête de réassurance */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          Votre estimation est prête !
        </h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed px-2">
          La création de votre compte est nécessaire pour consulter votre estimation. Vous pourrez également y suivre l'évolution du prix des biens estimés.
        </p>
      </div>

      {/* Badges Reassurance */}
      <div className="grid grid-cols-3 gap-2 py-4 mb-8 text-center text-[11px] font-medium text-slate-600 sm:text-xs">
        <div className="flex flex-col items-center">
          <Heart size={20} className="text-slate-800 mb-1.5" />
          <span>Gratuit et sans engagement</span>
        </div>
        <div className="flex flex-col items-center border-x border-slate-200 px-1">
          <ShieldCheck size={20} className="text-slate-800 mb-1.5" />
          <span>Vos données sont protégées</span>
        </div>
        <div className="flex flex-col items-center">
          <Home size={20} className="text-slate-800 mb-1.5" />
          <span>Au service de votre projet immobilier</span>
        </div>
      </div>

      {authError && (
        <div className="p-3 mb-6 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
          {authError}
        </div>
      )}

      {/* Box Principale Card */}
      <div className="bg-white border border-slate-150 p-6 sm:p-8 rounded-xl shadow-sm space-y-6">
        
        {!isGoogleAuthenticated ? (
          <>
            {/* PARTIE 1 : CRÉATION DE COMPTE */}
            {!isLoginMode ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">Créez votre compte</h3>
                  <p className="text-sm text-slate-600">
                    Vous avez déjà un compte ?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setIsLoginMode(true); setAuthError(null); }} 
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Connectez-vous
                    </button>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="flex items-center justify-center gap-2.5 w-full py-3 border border-slate-250 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.58z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.46l4.11-3.22z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.64l4.11 3.22c.94-2.84 3.57-4.95 6.68-4.95z"/>
                  </svg>
                  S'inscrire avec Google
                </button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <span className="relative bg-white px-3 text-xs uppercase font-semibold text-slate-400">ou</span>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="flex items-center gap-6 text-sm text-slate-700 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="civility" 
                        checked={civility === 'madame'} 
                        onChange={() => setCivility('madame')}
                        className="w-4 h-4 text-slate-800 border-slate-300 accent-slate-800" 
                      />
                      Madame
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="civility" 
                        checked={civility === 'monsieur'} 
                        onChange={() => setCivility('monsieur')}
                        className="w-4 h-4 text-slate-800 border-slate-300 accent-slate-800" 
                      />
                      Monsieur
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-slate-700">Nom</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-sm focus:border-slate-500" 
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-slate-700">Prénom</label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-sm focus:border-slate-500" 
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Numéro de téléphone</label>
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-sm focus:border-slate-500" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-sm focus:border-slate-500" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 relative">
                    <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-sm focus:border-slate-500 pr-10" 
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      <p className="font-semibold">Pour être valide votre mot de passe doit contenir :</p>
                      <ul className="list-disc pl-4 mt-0.5">
                        <li className={password.length >= 8 ? "text-green-600 font-medium" : "text-slate-500"}>
                          Au moins 8 caractères
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white p-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Créer mon compte"}
                  </button>
                </form>
              </div>
            ) : (
              
              /* PARTIE 2 : J'AI DÉJÀ UN COMPTE (CONNEXION EXPURGÉE) */
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">Connexion</h3>
                  <p className="text-sm text-slate-600">
                    Pas encore de compte ?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setIsLoginMode(false); setAuthError(null); }} 
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Créez votre compte
                    </button>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="flex items-center justify-center gap-2.5 w-full py-3 border border-slate-250 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.58z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.46l4.11-3.22z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.64l4.11 3.22c.94-2.84 3.57-4.95 6.68-4.95z"/>
                  </svg>
                  Se connecter avec Google
                </button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <span className="relative bg-white px-3 text-xs uppercase font-semibold text-slate-400">ou</span>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-slate-700">Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-sm focus:border-slate-500" 
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1 relative">
                    <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-sm focus:border-slate-500 pr-10" 
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white p-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Se connecter"}
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-slate-800">
            <Loader2 size={40} className="animate-spin text-slate-700" />
            <span className="text-sm font-semibold text-slate-700">Génération de votre rapport en cours...</span>
          </div>
        )}
      </div>

      {/* Bouton Retour */}
      <div className="flex justify-start items-center pt-6">
        <button 
          type="button" 
          disabled={loading}
          onClick={onPrev} 
          className="text-slate-400 hover:text-slate-700 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft size={14} /> Retour
        </button>
      </div>

    </div>
  );
};

export default StepFinalRegister;