import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

const Contact = () => (
  <div className="flex min-h-screen items-center justify-center py-16">
    <div className="text-center">
      <b className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
        Contactez-nous
      </b>
      <h2 className="mt-3 font-medium text-4xl tracking-tight">Prenez contact</h2>
      <p className="mt-3 text-lg text-muted-foreground md:text-xl">
        Notre équipe est toujours là pour discuter
      </p>
      <div className="mx-auto grid max-w-(--breakpoint-xl) gap-16 px-6 py-24 md:grid-cols-2 md:gap-10 md:px-0 lg:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-primary/5 text-primary shadow-xl/2 dark:bg-primary/10">
            <MailIcon />
          </div>
          <h3 className="mt-6 font-medium text-xl">Email</h3>
          <p className="mt-2 text-muted-foreground">
            Notre équipe est là !
          </p>
          <Link
            className="mt-4 font-medium text-primary"
            href="mailto:contact@unbienimmo.com"
          >
            contact@unbienimmo.com
          </Link>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-primary/5 text-primary shadow-xl/2 dark:bg-primary/10">
            <MapPinIcon />
          </div>
          <h3 className="mt-6 font-medium text-xl">Bureau</h3>
          <p className="mt-2 text-muted-foreground">
            Passez nous voir à Perpignan !
          </p>
          <Link
            className="mt-4 font-medium text-primary"
            href="https://map.google.com"
            target="_blank"
          >
            7 avenue de Banyuls sur Mer <br /> 66100 Perpignan
          </Link>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-primary/5 text-primary shadow-xl/2 dark:bg-primary/10">
            <PhoneIcon />
          </div>
          <h3 className="mt-6 font-medium text-xl">Téléphone</h3>
          <p className="mt-2 text-muted-foreground">Lundi-Samedi de 8h à 20h.</p>
          <Link
            className="mt-4 font-medium text-primary"
            href="tel:contact@unbienimmo.com"
          >
            +0616224682
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;