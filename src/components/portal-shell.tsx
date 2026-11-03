"use client";

import Link from "next/link";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { GlobalLanguageSwitcher } from "@/components/global-language-switcher";
import { GlobalThemeToggle } from "@/components/global-theme-toggle";

type NavLink = { labelKey: string; href: string };

function PortalShellInner({
  userEmail,
  isAffiliate,
  navLinks,
  logoutAction,
  children,
}: {
  userEmail: string;
  isAffiliate: boolean;
  navLinks: NavLink[];
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen" style={{ background: 'var(--p-bg)', color: 'var(--p-text)' }}>
      <nav className="sticky top-0 z-50" style={{ background: 'var(--p-nav-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--p-border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {/* Top bar */}
          <div className="h-14 flex items-center justify-between gap-3">
            <Link href="/portal" className="flex items-center gap-0 shrink-0" style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '-0.02em' }}>
              <span className="text-sm" style={{ color: 'var(--p-text)' }}>mediea</span>
              <span className="text-sm" style={{ color: 'var(--p-muted)' }}>/</span>
              <span className="text-sm italic" style={{ color: 'var(--p-soft)' }}>solution</span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs hidden md:block truncate max-w-[160px]" style={{ color: 'var(--p-muted)' }}>
                {userEmail}
              </span>
              {isAffiliate && (
                <span className="text-[9px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full hidden sm:inline-flex" style={{ color: 'var(--p-soft)', border: '1px solid var(--p-border-strong)' }}>
                  Affiliate
                </span>
              )}
              <div className="flex items-center gap-1.5">
                <GlobalLanguageSwitcher />
                <GlobalThemeToggle />
              </div>
              <form action={logoutAction}>
                <button type="submit" className="text-xs transition-colors whitespace-nowrap" style={{ color: 'var(--p-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '10px' }}>
                  {t("portal.nav.signout")}
                </button>
              </form>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="flex gap-0 -mb-px overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 text-[11px] font-medium transition-colors shrink-0 whitespace-nowrap"
                style={{ color: 'var(--p-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: '24px' }}
              >
                <span style={{ color: 'var(--p-faint)', marginRight: '6px', fontSize: '9px' }}>0{i + 1}</span>
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="portal-page-enter">{children}</div>
      </main>
    </div>
  );
}

export function PortalShell(props: {
  userEmail: string;
  isAffiliate: boolean;
  navLinks: NavLink[];
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <PortalShellInner {...props} />
    </I18nProvider>
  );
}

