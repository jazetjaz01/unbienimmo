import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      <div className="bg-card p-6 rounded-lg border">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}