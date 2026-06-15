import { MailIcon, MapPinIcon, PhoneIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

const Contact = () => {
  const contactDetails = [
    {
      title: "Email",
      description: "Notre équipe est là pour vous répondre.",
      icon: MailIcon,
      action: "contact@unbienimmo.com",
      href: "mailto:contact@unbienimmo.com"
    },
    {
      title: "Bureau",
      description: "Passez nous voir à Perpignan.",
      icon: MapPinIcon,
      action: "7 avenue de Banyuls sur Mer, 66100 Perpignan",
      href: "https://maps.google.com"
    },
    {
      title: "Téléphone",
      description: "Lundi-Samedi de 8h à 20h.",
      icon: PhoneIcon,
      action: "+33 6 16 22 46 82",
      href: "tel:+33616224682"
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Titre */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 font-syncopate">
            Prenez contact
          </h2>
          <p className=" text-lg max-w-4xl mx-auto">
            Notre équipe d'experts est à votre disposition pour vous accompagner dans vos projets immobiliers.
          </p>
        </div>

        {/* Grille de contact */}
        <div className="grid md:grid-cols-3 gap-12">
          {contactDetails.map((item, index) => (
            <div key={index} className="flex flex-col items-start border-l border-slate-200 pl-8">
              {/* Icône style minimaliste */}
              <div className="mb-8 p-2 border border-slate-200 rounded-lg">
                <item.icon className="w-8 h-8 text-slate-900 stroke-[1]" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {item.description}
              </p>
              
              <Link 
                href={item.href}
                className="inline-flex items-center text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                target={item.title === "Bureau" ? "_blank" : undefined}
              >
                {item.action} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;