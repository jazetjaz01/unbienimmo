import type { Metadata } from "next";
import React from "react";
import {
  Scale,
  ShieldCheck,
  FileText,
  Gavel,
  Database,
  HelpCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Consultez les conditions générales d'utilisation du site Unbienimmo.com.",
  alternates: { canonical: "/cgu" },
  robots: { index: true, follow: true },
};

export default function CguPage() {
  
  const sectionStyle = "bg-white p-8 md:p-12 shadow-sm border border-slate-100 mb-8";
  const titleStyle = "text-xl font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-3";
  const textStyle = "text-slate-600 leading-relaxed space-y-6";
  const subTitleStyle = "font-bold text-slate-700 mb-2 block uppercase text-sm tracking-wide";

  return (
    <main className="min-h-screen bg-slate-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Conditions Générales d'Utilisation</h1>

        {/* --- 1. LÉGAL --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <FileText className="size-6 text-teal-700" />
            1 – Informations Légales
          </h2>
          <div className={textStyle}>
            <p>
              Le site <strong>unbienimmo.com</strong> est édité par la société <strong>Merci Immobilier</strong>, 
              SAS immatriculée au RCS de Perpignan sous le numéro <strong>SIREN 852 226 620</strong>.
            </p>
            <p>
              <strong>Siège social :</strong> 7 Avenue de Banyuls sur Mer, 66100 Perpignan.<br />
              <strong>Contact :</strong> contact@unbienimmo.com | 06 16 22 46 82<br />
              <strong>Hébergement :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
            </p>
          </div>
        </section>

        {/* --- 2. ACCEPTATION --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Scale className="size-6 text-teal-700" />
            2 – Acceptation et Objet
          </h2>
          <div className={textStyle}>
            <p>
              L’accès au site implique l’acceptation sans réserve des présentes CGU. 
              Le site a pour vocation de fournir des informations et des outils d’estimation immobilière. 
              Ces services sont fournis à titre indicatif et ne constituent pas un engagement contractuel.
            </p>
          </div>
        </section>

        {/* --- 3. PROPRIÉTÉ INTELLECTUELLE --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Database className="size-6 text-teal-700" />
            3 – Propriété Intellectuelle
          </h2>
          <div className={textStyle}>
            <p>
              L’ensemble des contenus (textes, images, logos, bases de données) est la propriété exclusive de <strong>Merci Immobilier</strong>. 
              Toute reproduction ou distribution, même partielle, est strictement interdite sans accord préalable écrit, 
              conformément au Code de la propriété intellectuelle.
            </p>
          </div>
        </section>

        {/* --- 4. RESPONSABILITÉ --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <ShieldCheck className="size-6 text-teal-700" />
            4 – Responsabilité
          </h2>
          <div className={textStyle}>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Exactitude :</strong> Nous nous efforçons de maintenir les informations à jour, mais ne saurions être tenus responsables d'erreurs ou d'omissions.</li>
              <li><strong>Accessibilité :</strong> Le site est accessible 24h/24, 7j/7, sauf cas de force majeure ou maintenance technique.</li>
              <li><strong>Liens tiers :</strong> Nous déclinons toute responsabilité concernant le contenu des sites tiers vers lesquels nous renvoyons.</li>
            </ul>
          </div>
        </section>

        {/* --- 5. LITIGES --- */}
        <section className={sectionStyle}>
          <h2 className={titleStyle}>
            <Gavel className="size-6 text-teal-700" />
            5 – Droit applicable et Litiges
          </h2>
          <div className={textStyle}>
            <p>
              Les présentes CGU sont régies par le droit français. En cas de litige n’ayant pas trouvé de résolution amiable, 
              compétence exclusive est attribuée aux tribunaux compétents dans le ressort du siège social de <strong>Merci Immobilier</strong> (Perpignan).
            </p>
          </div>
        </section>

        {/* --- SECTION CONTACT --- */}
        <section className="bg-slate-800 p-8 md:p-12 text-white shadow-lg mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
            <HelpCircle className="size-6 text-teal-400" />
            Une question sur les CGU ?
          </h2>
          <p className="text-slate-300">
            Pour toute question relative à nos conditions d'utilisation, n'hésitez pas à nous contacter :
          </p>
          <div className="mt-4 text-sm">
            <p><strong>Merci Immobilier</strong></p>
            <p>7 Avenue de Banyuls sur Mer, 66100 Perpignan</p>
            <p>Email : contact@unbienimmo.com</p>
          </div>
        </section>

        <div className="text-center text-slate-500 text-sm pb-8">
          Dernière mise à jour : 28 juin 2026
        </div>
      </div>
    </main>
  );
}