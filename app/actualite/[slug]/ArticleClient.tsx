"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User2, MapPin, Home } from "lucide-react";

interface Post {
  id: string;
  title: string;
  category: string;
  author_name: string;
  image_url: string;
  created_at: string;
  content: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
}

export default function ArticleClient({ slug }: { slug: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-20 text-center uppercase tracking-widest bg-slate-200 min-h-screen">
        Article introuvable
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-200">
      
      {/* NAV */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button 
          variant="ghost"
          onClick={() => router.back()}
          className="rounded-none hover:bg-slate-300 transition-colors gap-2 uppercase tracking-widest text-xs p-2"
        >
          <ArrowLeft size={16} /> Retour aux articles
        </Button>
      </div>

      {/* HEADER */}
      <header className="max-w-4xl mx-auto px-4 pt-10 pb-16">

        <div className="flex items-center gap-4 mb-6">
          <Badge className="rounded-none bg-primary text-white border-none px-4 py-1 uppercase tracking-tighter">
            {post.category || "Actualité"}
          </Badge>

          <span className="text-slate-500 text-[11px] uppercase tracking-[0.2em]">
            {new Date(post.created_at).toLocaleDateString("fr-FR")}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tighter uppercase leading-[0.9] mb-10 tracking-wide">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-8 border-y border-slate-300 py-6">

          <div className="flex items-center gap-2">
            <User2 size={14} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {post.author_name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Perpignan, France
            </span>
          </div>

        </div>
      </header>

      {/* IMAGE */}
      <div className="w-full max-w-7xl mx-auto px-0 md:px-4">
        <div className="relative aspect-video md:aspect-[21/9] overflow-hidden bg-white shadow-xl">
          
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <Home className="text-slate-300 size-32" />
            </div>
          )}

        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-3xl mx-auto px-4 py-20">
        <div className="prose prose-slate prose-lg max-w-none font-light leading-relaxed text-slate-800 first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left text-justify">
          
          {post.content?.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-6 whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-3xl mx-auto px-4 pb-20 border-t border-slate-300 pt-10">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center">
          Fin de l'article — Unbienimmo
        </p>
      </footer>

    </article>
  );
}