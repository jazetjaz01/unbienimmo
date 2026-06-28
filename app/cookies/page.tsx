"use client";

import React from "react";
import { Cookie, Settings, ShieldCheck, HelpCircle, AlertCircle } from "lucide-react";

export default function CookiesPage() {
  
  const sectionStyle = "bg-white p-8 md:p-12 shadow-sm border border-slate-100 mb-8";
  const titleStyle = "text-xl font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-3";
  const textStyle = "text-slate-600 leading-relaxed space-y-6";
  const subTitleStyle = "font-bold text-slate-700 mb-2 block uppercase text-sm tracking-wide";

  return (
    <main className="min-h-screen bg-slate-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Politique d'utilisation des Cookies</h1>

        {/* --- 1. INTRODUCTION --- */}
        <section className={sectionStyle}>
          <div className={textStyle}>
            <p>
              Pour assurer le bon fonctionnement de <strong>unbienimmo.com</strong> et améliorer votre expérience utilisateur, 
              nous utilisons des cookies. Cette page vous explique ce que sont ces fichiers, comment nous les utilisons 
              et comment vous pouvez les paramétrer.
            </p>
          </div>
        </section>

        {/* --- 2. TYPES DE COOKIES --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Cookie className="size-6 text-teal-700" />
            1 – Les types de cookies utilisés
          </h2>
          <div className={textStyle}>
            <div>
              <span className={subTitleStyle}>Cookies strictement nécessaires</span>
              <p>
                Ces cookies sont indispensables à la navigation sur notre site. Ils permettent par exemple de 
                mémoriser vos préférences d'affichage ou de sécuriser votre connexion. <strong>Ils ne peuvent pas être désactivés.</strong>
              </p>
            </div>
            <div>
              <span className={subTitleStyle}>Cookies de mesure d'audience</span>
              <p>
                Ces cookies nous permettent d'établir des statistiques anonymes de fréquentation (nombre de visites, 
                pages consultées). Ils nous aident à améliorer la pertinence de nos contenus.
              </p>
            </div>
            <div>
              <span className={subTitleStyle}>Cookies tiers (Cartographie)</span>
              <p>
                Nous utilisons le service <strong>Mapbox</strong> pour afficher les cartes immobilières. Ce service 
                peut déposer des cookies techniques nécessaires à l'affichage dynamique des cartes et à la performance 
                du service.
              </p>
            </div>
          </div>
        </section>

        {/* --- 3. PARAMÉTRAGE --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Settings className="size-6 text-teal-700" />
            2 – Comment gérer vos cookies ?
          </h2>
          <div className={textStyle}>
            <p>
              Vous avez plusieurs options pour gérer le dépôt de cookies sur votre appareil :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Via votre navigateur :</strong> Vous pouvez à tout moment configurer votre navigateur pour accepter, refuser ou supprimer les cookies. (Consultez les menus "Aide" de Chrome, Safari, Firefox ou Edge).</li>
              
            </ul>
          </div>
        </section>

        {/* --- 4. CONTACT --- */}
        <section className="bg-slate-800 p-8 md:p-12 text-white shadow-lg mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
            <HelpCircle className="size-6 text-teal-400" />
            Une question ?
          </h2>
          <p className="text-slate-300 mb-6">
            Pour toute question concernant cette politique des cookies, vous pouvez contacter notre responsable :
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Merci Immobilier</strong></p>
            <p>7 Avenue de Banyuls sur Mer, 66100 Perpignan</p>
            <p>Email : contact@unbienimmo.com</p>
          </div>
        </section>

        <div className="text-center text-slate-500 text-sm pb-8">
          Document mis à jour le 28 juin 2026
        </div>
      </div>
    </main>
  );
}