import { createClient } from "@/lib/supabase/server";

import ArticleClient from "./ArticleClient";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  return {
    title: post?.meta_title || post?.title,
    description: post?.meta_description || post?.content?.slice(0, 160),
    openGraph: {
      title: post?.meta_title || post?.title,
      description: post?.meta_description,
      images: post?.image_url ? [post.image_url] : [],
    },
  };
}

export default async function Page({ params }: any) {
  const { slug } = await params;

  return <ArticleClient slug={slug} />;
}