"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Importation du Textarea
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";

const AddPostForm = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);


const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD") // Supprime les accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w ]+/g, "") // Supprime les caractères spéciaux
    .replace(/ +/g, "-"); // Remplace les espaces par des tirets
};



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = generateSlug(title);
    const category = formData.get("category") as string;
    const author = formData.get("author") as string;
    const content = formData.get("content") as string; // Récupération du contenu
    const meta_title = formData.get("meta_title") as string;
const meta_description = formData.get("meta_description") as string;



    try {
      let imageUrl = "";

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("articles-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("articles-images")
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }

      // Insertion avec le champ 'content'
      const { error: insertError } = await supabase.from("posts").insert([
        {
          title,
          category,
          author_name: author,
          content, 
          slug,
          image_url: imageUrl,
          meta_title,
    meta_description,
        },
      ]);

      if (insertError) throw insertError;

      alert("Annonce publiée avec succès !");
      window.location.reload();

    } catch (error: any) {
      console.error("Erreur détaillée:", error.message || error);
      alert(`Erreur: ${error.message || "Un problème est survenu"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* max-w-3xl pour une fenêtre plus large */
    <Card className="max-w-3xl mx-auto my-10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Publier une nouvelle annonce immobilière</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Titre de l'annonce</label>
            <Input name="title" placeholder="Ex: Maison de ville avec jardin à Perpignan" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Catégorie</label>
              <Input name="category" placeholder="Vente, Location, Colocation..." required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Auteur / Agence</label>
              <Input name="author" placeholder="Votre nom" required />
            </div>
          </div>

          {/* Nouveau champ : Contenu / Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Description détaillée</label>
            <Textarea 
              name="content" 
              placeholder="Décrivez le bien en détail (pièces, exposition, diagnostics...)" 
              className="min-h-[200px] resize-y" // Agrandit la zone de saisie
              required 
            />
          </div>

          <div className="space-y-2">
  <label className="text-sm font-semibold">Meta titre SEO</label>
  <Input
    name="meta_title"
    placeholder="Ex: Prix immobilier Rue de Rivoli Paris en 2026"
  />
</div>

<div className="space-y-2">
  <label className="text-sm font-semibold">Meta description SEO</label>
  <Textarea
    name="meta_description"
    placeholder="Description SEO de 150 à 160 caractères"
    className="min-h-[80px]"
  />
</div>

          <div className="space-y-2 border-2 border-dashed rounded-lg p-4 bg-muted/50">
            <label className="text-sm font-semibold block mb-2">Photo principale du bien</label>
            <div className="flex items-center gap-4">
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer bg-background"
              />
              <Upload className="text-muted-foreground" size={20} />
            </div>
          </div>

          <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              "Mettre l'annonce en ligne"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPostForm;