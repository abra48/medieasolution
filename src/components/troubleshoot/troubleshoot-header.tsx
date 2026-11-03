"use client";

import { useI18n } from "@/lib/i18n";

export function TroubleshootHeader() {
  const { t } = useI18n();
  return (
    <div className="mb-6">
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "var(--p-text)",
          lineHeight: 1.15,
          marginBottom: 4,
        }}
      >
        {t("troubleshoot.title")}
      </h1>
      <p style={{ fontSize: 14, color: "var(--p-muted)", lineHeight: 1.7 }}>
        {t("troubleshoot.subtitle")}
      </p>
    </div>
  );
}

