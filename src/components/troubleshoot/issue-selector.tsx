"use client";

import React, { useEffect, useState } from "react";
import { useTroubleshoot, getPlatformBrand } from "@/lib/troubleshoot-context";
import { createClient } from "@/lib/supabase/client";
import { getIssuesTable } from "@/lib/platform-tables";

type Issue = {
  id: string;
  issue_name: string;
  description: string | null;
};

function getIssueIcon(name: string): React.ReactNode {
  const lower = name.toLowerCase();

  if (lower.includes("blokir") || lower.includes("block") || lower.includes("banned") || lower.includes("suspend")) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    );
  }
  if (lower.includes("retas") || lower.includes("hack") || lower.includes("phish")) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    );
  }
  if (lower.includes("kunci") || lower.includes("lock")) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    );
  }
  if (lower.includes("lupa") || lower.includes("forgot") || lower.includes("2fa")) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    );
  }

  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

export function IssueSelector() {
  const { currentStep, selectedPlatform, selectIssue, goBack, setError } = useTroubleshoot();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [debugTable, setDebugTable] = useState<string>("");

  useEffect(() => {
    if (currentStep !== "issue" || !selectedPlatform) return;

    const fetchIssues = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const supabase = createClient();
        const tableName = getIssuesTable(selectedPlatform.name);
        setDebugTable(tableName);

        // Debug: log tabel yang di-query
        console.log(`[IssueSelector] Platform: "${selectedPlatform.name}" → Table: "${tableName}"`);

        const { data, error } = await supabase
          .from(tableName)
          .select("id, issue_name, description")
          .eq("status", "active")
          .order("issue_name");

        if (error) {
          console.error(`[IssueSelector] Error querying ${tableName}:`, error);
          setFetchError(`Gagal memuat data dari ${tableName}: ${error.message}`);
          setError(`Gagal memuat kendala untuk ${selectedPlatform.name}`);
        } else {
          console.log(`[IssueSelector] Loaded ${data?.length || 0} issues from ${tableName}`);
          setIssues(data || []);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
        setFetchError(msg);
        setError(msg);
      }
      setLoading(false);
    };

    fetchIssues();
  }, [currentStep, selectedPlatform, setError]);

  if (currentStep !== "issue" || !selectedPlatform) return null;

  const brand = getPlatformBrand(selectedPlatform.name);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={goBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-subtle text-text-tertiary hover:text-text-primary hover:border-text-tertiary transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="text-xs text-text-tertiary mb-0.5">Langkah 2 dari 3</p>
          <h2 className="text-lg font-bold text-text-primary">Pilih Masalah</h2>
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

      {/* Error */}
      {fetchError && (
        <div className="mb-4 p-3 rounded-lg border border-danger/15 bg-danger/5 flex items-center gap-2">
          <svg className="w-4 h-4 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-danger">{fetchError}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-bg-secondary animate-pulse" />
          ))}
        </div>
      ) : issues.length === 0 && !fetchError ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-border-subtle bg-bg-secondary/50">
          <p className="text-sm font-medium text-text-secondary">Belum ada masalah tersedia</p>
          <p className="text-xs text-text-tertiary mt-1">
            Panduan untuk <span className="font-medium" style={{ color: brand.primary }}>{selectedPlatform.name}</span> sedang disiapkan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {issues.map((issue) => {
            const icon = getIssueIcon(issue.issue_name);
            return (
              <button
                key={issue.id}
                onClick={() => selectIssue(issue)}
                className="group text-left rounded-xl border border-border-subtle bg-bg-secondary hover:border-border-default transition-colors duration-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-text-tertiary"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      {issue.issue_name}
                    </p>
                    {issue.description && (
                      <p className="text-xs text-text-tertiary mt-0.5 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
