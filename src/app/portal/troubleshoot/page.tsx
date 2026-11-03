import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { hasPremiumAccess } from "@/lib/access";
import { TroubleshootFlow } from "@/components/troubleshoot/troubleshoot-flow";
import { TroubleshootHeader } from "@/components/troubleshoot/troubleshoot-header";

export default async function TroubleshootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (!(await hasPremiumAccess(supabase, user.id))) {
    redirect("/portal");
  }

  const { data: platforms } = await supabase
    .from("platforms")
    .select("id, name, icon_url, status")
    .eq("status", "active")
    .order("name");

  return (
    <div className="max-w-3xl mx-auto py-4 min-h-[80vh]">
      <TroubleshootHeader />
      <TroubleshootFlow platforms={platforms || []} />
    </div>
  );
}
