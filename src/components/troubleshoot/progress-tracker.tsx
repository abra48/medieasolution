"use client";

import { useTroubleshoot, localizeIssue } from "@/lib/troubleshoot-context";
import { useI18n } from "@/lib/i18n";

export function ProgressTracker() {
  const { t, locale } = useI18n();
  const { currentStep, selectedPlatform, selectedIssue } = useTroubleshoot();

  const steps = [
    { key: "platform", label: t("troubleshoot.platform"), value: selectedPlatform?.name },
    { key: "issue", label: t("troubleshoot.issue"), value: selectedIssue ? localizeIssue(selectedIssue, locale).issue_name : undefined },
    { key: "solution", label: t("troubleshoot.solutionShort"), value: undefined },
  ] as const;
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <ol className="grid grid-cols-3" style={{ borderTop: "1px solid var(--p-border)" }} aria-label="Progress">
      {steps.map((s, i) => {
        const reached = i <= currentIndex;
        return (
          <li
            key={s.key}
            className="relative pt-3 pr-3 min-w-0"
            aria-current={i === currentIndex ? "step" : undefined}
          >
            <span
              className="absolute left-0 right-0 -top-px h-px transition-colors duration-300"
              style={{ background: reached ? "var(--p-text)" : "transparent" }}
            />
            <p className="mx-num">{String(i + 1).padStart(2, "0")}</p>
            <p className="mx-label mt-1" style={{ color: reached ? "var(--p-text)" : undefined }}>
              {s.label}
            </p>
            {s.value && (
              <p className="text-xs mt-1 break-words" style={{ color: "var(--p-muted)" }}>
                {s.value}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
