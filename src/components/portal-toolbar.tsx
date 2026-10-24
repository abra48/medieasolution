"use client";

import { GlobalThemeToggle } from "@/components/global-theme-toggle";
import { GlobalLanguageSwitcher } from "@/components/global-language-switcher";
import { I18nProvider } from "@/lib/i18n";

/**
 * Client-side toolbar with theme toggle + language switcher.
 * Meant to be embedded in server-component layouts.
 */
export function PortalToolbar() {
  return (
    <I18nProvider>
      <div className="flex items-center gap-1.5">
        <GlobalLanguageSwitcher />
        <GlobalThemeToggle />
      </div>
    </I18nProvider>
  );
}
