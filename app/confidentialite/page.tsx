"use client";

import React from "react";
import { 
  Lock, 
  Eye, 
  UserCheck, 
  Database, 
  Share2, 
  HelpCircle
} from "lucide-react";

export default function ConfidentialitePage() {
  
  const sectionStyle = "bg-white p-8 md:p-12 shadow-sm border border-slate-100 mb-8";
  const titleStyle = "text-xl font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-3";
  const textStyle = "text-slate-600 leading-relaxed space-y-6";
  const subTitleStyle = "font-bold text-slate-700 mb-2 block uppercase text-sm tracking-wide";

  return (
    <main className="min-h-screen bg-slate-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Politique de Confidentialité</h1>
        <p className="text-slate-500 mb-12 italic">Votre vie privée est notre priorité chez Unbienimmo.</p>

        {/* --- INTRODUCTION --- */}
        <section className={sectionStyle}>
          <div className={textStyle}>
            <p>
              Chez <strong>Unbienimmo</strong>, nous accordons une importance capitale à la sécurité de vos données personnelles. 
              Cette politique vous informe sur la manière dont nous traitons vos informations lorsque vous naviguez sur 
              notre site <span className="text-teal-700">www.unbienimmo.com</span>.
            </p>
          </div>
        </section>

        {/* --- SECTION 1 : COLLECTE --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Eye className="size-6 text-teal-700" />
            1 – Nature des données collectées
          </h2>
          <div className={textStyle}>
            <p>
              Nous recueillons uniquement les informations nécessaires pour vous offrir un service immobilier de qualité. 
              Cela inclut :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identité :</strong> Nom, prénom et civilité.</li>
              <li><strong>Contact :</strong> Adresse e-mail, numéro de téléphone et adresse postale.</li>
              <li><strong>Projet Immobilier :</strong> Critères de recherche, caractéristiques de vos biens à estimer.</li>
              <li><strong>Données techniques :</strong> Adresse IP et journaux de connexion.</li>
            </ul>
          </div>
        </section>

        {/* --- SECTION 2 : FINALITÉS --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Database className="size-6 text-teal-700" />
            2 – Pourquoi utilisons-nous vos données ?
          </h2>
          <div className={textStyle}>
            <p>Le traitement de vos informations nous permet de :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100">
                <span className={subTitleStyle}>Gestion de projet</span>
                Répondre à vos demandes de contact et affiner vos recherches de biens.
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100">
                <span className={subTitleStyle}>Estimations</span>
                Réaliser des évaluations précises de vos propriétés.
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100">
                <span className={subTitleStyle}>Information</span>
                Vous envoyer des alertes immobilières ou des newsletters (si vous y avez consenti).
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100">
                <span className={subTitleStyle}>Sécurité</span>
                Protéger notre plateforme contre les tentatives de fraude.
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3 : CONSERVATION --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Lock className="size-6 text-teal-700" />
            3 – Conservation et Sécurité
          </h2>
          <div className={textStyle}>
            <p>
              Vos données sont stockées sur des serveurs sécurisés situés au sein de l'<strong>Union Européenne</strong>. 
              Nous appliquons des mesures techniques rigoureuses (chiffrement, accès restreint) pour empêcher toute fuite ou altération.
            </p>
            <p>
              La durée de conservation varie selon la nature de notre relation : 
              les données de prospects sont conservées <strong>3 ans</strong> après le dernier contact, 
              tandis que les documents liés à une transaction sont archivés selon les durées légales en vigueur.
            </p>
          </div>
        </section>

        {/* --- SECTION 4 : VOS DROITS --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <UserCheck className="size-6 text-teal-700" />
            4 – Vos droits (RGPD)
          </h2>
          <div className={textStyle}>
            <p>
              Conformément à la réglementation européenne, vous disposez d'un droit d'<strong>accès</strong>, de 
              <strong> rectification</strong>, d'<strong>opposition</strong> et de <strong>suppression</strong> de vos données.
            </p>
            <p>
              Pour exercer ces droits, il vous suffit de nous écrire à :<br />
              <a href="mailto:contact@unbienimmo.com" className="font-bold text-teal-700 underline">contact@unbienimmo.com</a>
            </p>
          </div>
        </section>

        {/* --- SECTION 5 : TIERS --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Share2 className="size-6 text-teal-700" />
            5 – Partage des données
          </h2>
          <div className={textStyle}>
            <p>
              Unbienimmo ne revend jamais vos données. Elles sont uniquement partagées avec :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Nos prestataires techniques (hébergeur Vercel, outils d'envoi d'emails).</li>
              <li>Les autorités judiciaires si la loi l'exige.</li>
            </ul>
          </div>
        </section>

        {/* --- SECTION CONTACT --- */}
        <section className="bg-slate-800 p-8 md:p-12 text-white shadow-lg mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
            <HelpCircle className="size-6 text-teal-400" />
            Une question ?
          </h2>
          <p className="text-slate-300 mb-6">
            Pour toute demande concernant vos données personnelles, vous pouvez contacter notre responsable de la protection des données :
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Merci Immobilier</strong></p>
            <p><strong>Unbienimmo</strong></p>
            <p>7 Avenue de Banyuls sur Mer, 66100 Perpignan</p>
            <p>Email : contact@unbienimmo.com</p>
          </div>
        </section>

        <div className="text-center text-slate-500 text-sm pb-8">
          Document mis à jour le 01 juillet 2026
        </div>
      </div>
    </main>
  );
}