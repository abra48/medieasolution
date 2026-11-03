import { createClient } from "@/lib/supabase/server";
import { PortalWelcome } from "./portal-welcome";
import { hasPremiumAccess } from "@/lib/access";

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const hasAccess = user ? await hasPremiumAccess(supabase, user.id) : false;

  return <PortalWelcome hasAccess={hasAccess} />;
}
