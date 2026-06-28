"use client";

import React from "react";
import { 
  ShieldCheck, 
  Scale, 
  Building2, 
  Server
} from "lucide-react";

export default function MentionsLegalesPage() {
  
  const sectionStyle = "bg-white p-8 md:p-12 shadow-sm border border-slate-100 mb-8";
  const titleStyle = "text-xl font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-3";
  const textStyle = "text-slate-600 leading-relaxed space-y-8";
  const subTitleStyle = "font-bold text-slate-700 mb-2 block";

  return (
    <main className="min-h-screen bg-slate-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Mentions Légales</h1>

        {/* --- SECTION 1 : ÉDITEUR --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Building2 className="size-6 text-teal-700" />
            1 – Mentions Légales
          </h2>
          
          <div className={textStyle}>
            <div>
              <strong className={subTitleStyle}>Éditeur du site :</strong>
              Le site <a href="https://unbienimmo.com" className="underline text-teal-700">www.unbienimmo.com</a> est édité par :<br />
              <strong>Merci Immobilier</strong><br />
              Immatriculée au RCS de Perpignan sous le numéro <strong>SIREN 852 226 620</strong><br />
              Siège social : 7 Avenue de Banyuls sur Mer, 66100 Perpignan<br />
              Email : <a href="mailto:contact@unbienimmo.com" className="text-teal-700">contact@unbienimmo.com</a><br />
              Tél. : 06 16 22 46 82
            </div>

            <div>
              <strong className={subTitleStyle}>Hébergeur :</strong>
              <div className="flex items-start gap-2 mt-2">
                <Server className="size-5 text-slate-400 mt-1 shrink-0" />
                <span>
                  <strong>Vercel Inc.</strong><br />
                  440 N Barranca Ave #4133, Covina, CA 91723<br />
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-teal-700">https://vercel.com</a>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2 : CONDITIONS D'UTILISATION --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Scale className="size-6 text-teal-700" />
            2 – Conditions d’utilisation
          </h2>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
            <p className="text-amber-800 text-sm font-medium">
              AVERTISSEMENT : NOUS VOUS INVITONS À LIRE AVEC ATTENTION LES PRÉSENTES CONDITIONS D’UTILISATION.
            </p>
          </div>

          <div className={textStyle}>
            <div>
              <span className={subTitleStyle}>Acceptation des Conditions</span>
              <p>Tout internaute qui souhaite utiliser notre Site Internet est réputé avoir pris connaissance des Conditions d’utilisation et les avoir acceptées. Unbienimmo se réserve le droit de les modifier à tout moment.</p>
            </div>

            <div>
              <span className={subTitleStyle}>Annonces immobilières</span>
              <p>Les informations contenues sur le site sont fournies à titre indicatif.Unbienimmo s’efforce de diffuser des informations exactes mais ne saurait être tenue pour responsable en cas d’erreurs, d’inexactitudes ou de non-conformité des biens présentés.</p>
            </div>

            <div>
              <span className={subTitleStyle}>Propriété intellectuelle</span>
              <p>Tout le contenu du présent site (graphismes, images, textes, logos, icônes) est la propriété exclusive de <strong>Unbienimmo</strong>. Toute reproduction ou distribution, même partielle, est strictement interdite sans accord préalable écrit, conformément aux articles L.335-2 et suivants du Code de la propriété intellectuelle.</p>
            </div>

            <div>
              <span className={subTitleStyle}>Accessibilité</span>
              <p>Le site est normalement accessible 24h/24. Toutefois, Unbienimmo se réserve le droit, sans préavis, de fermer temporairement le site pour maintenance ou mise à jour technique.</p>
            </div>
          </div>
        </section>

        {/* --- SECTION 3 : LITIGES --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <ShieldCheck className="size-6 text-teal-700" />
            3 – Litiges
          </h2>
          <div className={textStyle}>
            <p>
              Les présentes conditions sont régies par le <strong>droit français</strong>. Tout litige relatif à l’utilisation du site sera de la compétence exclusive des tribunaux français.
            </p>
          </div>
        </section>

        <div className="text-center text-slate-500 text-sm pb-8">
          Dernière mise à jour : 01 Juillet 2026
        </div>
      </div>
    </main>
  );
}