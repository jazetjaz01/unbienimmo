"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";


import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner"; // Ou ton système de notification

const profileSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().optional(),
});

export function ProfileForm({ user }: { user: any }) {
  const supabase = createClient();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.user_metadata?.full_name || "",
      phone: user.user_metadata?.phone || "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: values.full_name, phone: values.phone }
    });

    if (error) toast.error("Erreur lors de la mise à jour");
    else toast.success("Profil mis à jour !");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField control={form.control} name="full_name" render={({ field }) => (
          <FormItem>
            <FormLabel>Nom complet</FormLabel>
            <FormControl><Input {...field} /></FormControl>
          </FormItem>
        )} />
        <Button type="submit">Enregistrer les modifications</Button>
      </form>
    </Form>
  );
}