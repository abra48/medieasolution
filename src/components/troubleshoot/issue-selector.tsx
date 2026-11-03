"use client";

import { useEffect, useState } from "react";
import { useTroubleshoot, localizeIssue, type Issue } from "@/lib/troubleshoot-context";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { getIssuesTable } from "@/lib/platform-tables";
import { IconSearch } from "@/components/icons";

export function IssueSelector() {
  const { t, locale } = useI18n();
  const { currentStep, selectedPlatform, selectIssue, goBack } = useTroubleshoot();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (currentStep !== "issue" || !selectedPlatform) return;
    let cancelled = false;

    createClient()
      .from(getIssuesTable(selectedPlatform.name))
      .select("id, issue_name, description, issue_name_en, description_en")
      .eq("status", "active")
      .order("issue_name")
      .then(({ data, error }) => {
        if (cancelled) return;
        setFetchError(error ? error.message : null);
        setIssues(data || []);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentStep, selectedPlatform]);

  if (currentStep !== "issue" || !selectedPlatform) return null;

  const query = search.toLowerCase();
  const filtered = issues
    .map((issue) => ({ issue, text: localizeIssue(issue, locale) }))
    .filter(({ text }) =>
      text.issue_name.toLowerCase().includes(query) ||
      (text.description || "").toLowerCase().includes(query)
    );

  return (
    <div className="ts-step-enter">
      <div className="flex items-start gap-4 mb-8">
        <button
          type="button"
          onClick={goBack}
          className="mx-link mt-1 shrink-0"
          aria-label={t("troubleshoot.back")}
        >
          ← {t("troubleshoot.back")}
        </button>
      </div>
      <div className="mb-8">
        <p className="mx-label mb-2">
          {t("troubleshoot.step2of3")} · {selectedPlatform.name}
        </p>
        <h2 className="mx-subtitle">{t("troubleshoot.chooseIssue")}</h2>
        <p className="text-sm mt-1" style={{ color: "var(--p-muted)" }}>{t("troubleshoot.chooseIssueDesc")}</p>
      </div>

      {!loading && issues.length > 3 && (
        <div className="ts-search">
          <IconSearch className="w-4 h-4" />
          <input
            type="text"
            placeholder={t("troubleshoot.searchIssue")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
      )}

      {fetchError && (
        <p className="mx-notice mx-notice-error mb-4">
          {t("troubleshoot.errorLoadingIssues")}: {fetchError}
        </p>
      )}

      {loading ? (
        <div className="mx-list">
          {[0, 1, 2].map((i) => (
            <div key={i} className="mx-row">
              <div className="h-4 w-2/3 skeleton-premium" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 && !fetchError ? (
        <div className="mx-empty">
          <p>{search ? t("troubleshoot.notFound") : t("troubleshoot.noIssue")}</p>
          <p className="text-xs mt-1">{search ? t("troubleshoot.tryOtherKeyword") : t("troubleshoot.noSolutionDesc")}</p>
        </div>
      ) : (
        <div className="mx-list">
          {filtered.map(({ issue, text }, i) => (
            <button key={issue.id} type="button" onClick={() => selectIssue(issue)} className="mx-row">
              <span className="mx-num w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="mx-row-title block break-words">{text.issue_name}</span>
                {text.description && <span className="mx-row-desc block break-words">{text.description}</span>}
              </span>
              <span className="mx-row-arrow" aria-hidden>→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
