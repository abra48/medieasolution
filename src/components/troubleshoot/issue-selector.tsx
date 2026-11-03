"use client";

import React, { useEffect, useState } from "react";
import { useTroubleshoot, getPlatformBrand, localizeIssue, type Issue } from "@/lib/troubleshoot-context";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { getIssuesTable } from "@/lib/platform-tables";
import {
  IconSearch,
  IconAlertCircle,
  IconLock,
  IconKey,
  IconChevronRight,
} from "@/components/icons";


/* ——— Issue-specific icons (clean, geometric SVGs) ——— */
function IconBlocked({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="5.7" y1="5.7" x2="18.3" y2="18.3" />
    </svg>
  );
}

function IconHacked({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0z" />
    </svg>
  );
}

function IconQuestion({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function getIssueIcon(name: string): React.ReactNode {
  const lower = name.toLowerCase();

  if (lower.includes("blokir") || lower.includes("block") || lower.includes("banned") || lower.includes("suspend")) {
    return <IconBlocked />;
  }
  if (lower.includes("retas") || lower.includes("hack") || lower.includes("phish")) {
    return <IconHacked />;
  }
  if (lower.includes("kunci") || lower.includes("lock")) {
    return <IconLock className="w-4 h-4" />;
  }
  if (lower.includes("lupa") || lower.includes("forgot") || lower.includes("2fa")) {
    return <IconKey className="w-4 h-4" />;
  }

  return <IconQuestion />;
}

/* ——— Back Arrow Icon ——— */
function IconBack({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function IssueSelector() {
  const { t, locale } = useI18n();
  const { currentStep, selectedPlatform, selectIssue, goBack, setError } = useTroubleshoot();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [debugTable, setDebugTable] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (currentStep !== "issue" || !selectedPlatform) return;

    const fetchIssues = async () => {
      setLoading(true);
      setFetchError(null);
      setSearch("");
      try {
        const supabase = createClient();
        const tableName = getIssuesTable(selectedPlatform.name);
        setDebugTable(tableName);

        // Debug: log tabel yang di-query
        console.log(`[IssueSelector] Platform: "${selectedPlatform.name}" → Table: "${tableName}"`);

        const { data, error } = await supabase
          .from(tableName)
          .select("id, issue_name, description, issue_name_en, description_en")
          .eq("status", "active")
          .order("issue_name");

        if (error) {
          console.error(`[IssueSelector] Error querying ${tableName}:`, error);
          setFetchError(`${t("troubleshoot.errorLoading")} (${tableName}): ${error.message}`);
          setError(`${t("troubleshoot.errorLoading")} — ${selectedPlatform.name}`);
        } else {
          console.log(`[IssueSelector] Loaded ${data?.length || 0} issues from ${tableName}`);
          setIssues(data || []);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : t("troubleshoot.errorLoading");
        setFetchError(msg);
        setError(msg);
      }
      setLoading(false);
    };

    fetchIssues();
  }, [currentStep, selectedPlatform, setError, t]);

  if (currentStep !== "issue" || !selectedPlatform) return null;

  const brand = getPlatformBrand(selectedPlatform.name);

  const query = search.toLowerCase();
  const filtered = issues
    .map((issue) => ({ issue, text: localizeIssue(issue, locale) }))
    .filter(({ text }) =>
      text.issue_name.toLowerCase().includes(query) ||
      (text.description || "").toLowerCase().includes(query)
    );

  return (
    <div className="ts-step-enter">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={goBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-subtle text-text-tertiary hover:text-text-primary hover:border-text-tertiary transition-colors shrink-0"
        >
          <IconBack />
        </button>
        <div>
          <p className="text-xs text-text-tertiary mb-0.5">{t("troubleshoot.step2of3")}</p>
          <h2 className="text-lg font-bold text-text-primary">{t("troubleshoot.chooseIssue")}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
              style={{
                backgroundColor: `${brand.primary}10`,
                color: brand.primary,
              }}
            >
              {selectedPlatform.name}
            </span>
            {debugTable && (
              <span className="text-[10px] text-text-tertiary font-mono">
                ({debugTable})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
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

      {/* Error */}
      {fetchError && (
        <div className="mb-4 p-3 rounded-lg border border-danger/15 bg-danger/5 flex items-center gap-2">
          <IconAlertCircle className="w-4 h-4 text-danger shrink-0" />
          <p className="text-sm text-danger">{fetchError}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl skeleton-premium" />
          ))}
        </div>
      ) : filtered.length === 0 && !fetchError ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-border-subtle bg-bg-secondary/50">
          <p className="text-sm font-medium text-text-secondary">
            {search ? t("troubleshoot.notFound") : t("troubleshoot.noIssue")}
          </p>
          <p className="text-xs text-text-tertiary mt-1">
            {search ? t("troubleshoot.tryOtherKeyword") : (
              <>{t("troubleshoot.noSolutionDesc")} — <span className="font-medium" style={{ color: brand.primary }}>{selectedPlatform.name}</span></>
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {filtered.map(({ issue, text }, i) => {
            const icon = getIssueIcon(issue.issue_name);
            return (
              <button
                key={issue.id}
                onClick={() => selectIssue(issue)}
                className={`issue-card-premium group text-left rounded-xl border border-border-subtle bg-bg-secondary hover:border-border-default transition-all duration-200 p-3 sm:p-4 ts-card-stagger stagger-${i + 1}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      {text.issue_name}
                    </p>
                    {text.description && (
                      <p className="text-xs text-text-tertiary mt-0.5 line-clamp-2 leading-relaxed">
                        {text.description}
                      </p>
                    )}
                  </div>
                  <IconChevronRight className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
