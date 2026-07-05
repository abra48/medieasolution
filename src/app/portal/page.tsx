import { createClient } from "@/lib/supabase/server";
import { AccessCodeRedeemer } from "./access-code-redeemer";
import { TroubleshootFlow } from "@/components/troubleshoot/troubleshoot-flow";

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasAccess = false;
  if (user) {
    const { data: activeCode } = await supabase
      .from("access_codes")
      .select("id, code")
      .eq("used_by", user.id)
      .eq("is_used", true)
      .single();
    hasAccess = !!activeCode;
  }

  const { data: platforms } = await supabase
    .from("platforms")
    .select("id, name, icon_url, status")
    .eq("status", "active")
    .order("name");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary mb-1">Recovery Portal</h1>
        <p className="text-sm text-text-tertiary">
          {hasAccess
            ? "Premium access active. Follow the steps below to recover your account."
            : "Enter your access code to unlock premium recovery guides."}
        </p>
      </div>

      {!hasAccess && <AccessCodeRedeemer />}

      {hasAccess && (
        <div className="flex items-center gap-2 px-3 py-2 bg-accent/5 border border-accent/15 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-xs font-medium text-accent">Premium Access Active</span>
        </div>
      )}

      {hasAccess && <TroubleshootFlow platforms={platforms || []} />}

      {!hasAccess && (
        <div className="relative">
          <div className="absolute inset-0 bg-bg-primary/70 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm">
            <div className="text-center">
              <svg className="w-8 h-8 text-text-tertiary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs font-medium text-text-secondary">Enter access code to unlock</p>
            </div>
          </div>
          <div className="opacity-20 pointer-events-none">
            <TroubleshootFlow platforms={platforms || []} />
          </div>
        </div>
      )}
    </div>
  );
}
