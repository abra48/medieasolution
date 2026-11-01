"use client";

import { useI18n } from "@/lib/i18n";

export function SupportHeader() {
  const { t } = useI18n();
  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: "clamp(1.3rem, 3vw, 1.75rem)", fontWeight: 400, fontStyle: "italic", color: "#e8e6e1", marginBottom: 4 }}>
        {t("support.title")}
      </h1>
      <p style={{ fontSize: 14, color: "#7a7a72" }}>{t("support.subtitle")}</p>
    </div>
  );
}

export function ArticlesHeader() {
  const { t } = useI18n();
  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: "clamp(1.3rem, 3vw, 1.75rem)", fontWeight: 400, fontStyle: "italic", color: "#e8e6e1", marginBottom: 4 }}>
        {t("articles.title")}
      </h1>
      <p style={{ fontSize: 14, color: "#7a7a72" }}>{t("articles.subtitle")}</p>
    </div>
  );
}

export function ModulesHeader() {
  const { t } = useI18n();
  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: "clamp(1.3rem, 3vw, 1.75rem)", fontWeight: 400, fontStyle: "italic", color: "#e8e6e1", marginBottom: 4 }}>
        {t("modules.title")}
      </h1>
      <p style={{ fontSize: 14, color: "#7a7a72" }}>{t("modules.subtitle")}</p>
    </div>
  );
}
