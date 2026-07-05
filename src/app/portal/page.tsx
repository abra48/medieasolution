import { createClient } from "@/lib/supabase/server";
import { AccessCodeRedeemer } from "./access-code-redeemer";
import { TroubleshootFlow } from "@/components/troubleshoot/troubleshoot-flow";

export default async function PortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user has redeemed a code
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

  // Get active platforms
  const { data: platforms } = await supabase
    .from("platforms")
    .select("id, name, icon_url, status")
    .eq("status", "active")
    .order("name");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Recovery <span className="text-gradient-green">Portal</span>
        </h1>
        <p className="text-text-secondary">
          {hasAccess
            ? "Premium access active. Ikuti langkah di bawah untuk memulihkan akun Anda."
            : "Masukkan kode akses untuk membuka panduan pemulihan premium."}
        </p>
      </div>

      {/* Access Code Section — show if no access */}
      {!hasAccess && <AccessCodeRedeemer />}

      {/* Premium Status Badge */}
      {hasAccess && (
        <div className="flex items-center gap-3 px-4 py-3 bg-accent-green/10 border border-accent-green/20"
          style={{
            clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
          }}
        >
          <svg
            className="w-5 h-5 text-accent-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="text-sm font-medium text-accent-green">
            Premium Access Active
          </span>
        </div>
      )}

      {/* Troubleshoot Flow — only for users with access */}
      {hasAccess && <TroubleshootFlow platforms={platforms || []} />}

      {/* Locked Overlay — show platforms greyed out if no access */}
      {!hasAccess && (
        <div className="relative">
          <div className="absolute inset-0 bg-bg-primary/60 z-10 flex items-center justify-center backdrop-blur-[2px]"
            style={{
              clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
            }}
          >
            <div className="text-center">
              <svg
                className="w-10 h-10 text-text-tertiary mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-sm font-semibold text-text-secondary">
                Masukkan kode akses untuk membuka
              </p>
            </div>
          </div>
          {/* Greyed out platforms preview */}
          <div className="opacity-30 pointer-events-none">
            <TroubleshootFlow platforms={platforms || []} />
          </div>
        </div>
      )}
    </div>
  );
}
