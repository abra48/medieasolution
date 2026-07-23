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

/* Issue type icons */
const ISSUE_ICONS: Record<string, React.ReactNode> = {
  diblokir: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  diretas: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  terkunci: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  lupa: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
};

function getIssueIcon(name: string): React.ReactNode {
  const lower = name.toLowerCase();
  if (lower.includes("blokir") || lower.includes("block") || lower.includes("banned")) return ISSUE_ICONS.diblokir;
  if (lower.includes("retas") || lower.includes("hack") || lower.includes("phish")) return ISSUE_ICONS.diretas;
  if (lower.includes("kunci") || lower.includes("lock")) return ISSUE_ICONS.terkunci;
  if (lower.includes("lupa") || lower.includes("forgot")) return ISSUE_ICONS.lupa;

  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function getIssueColor(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("blokir") || lower.includes("block") || lower.includes("banned")) return "#ef4444";
  if (lower.includes("retas") || lower.includes("hack") || lower.includes("phish")) return "#f59e0b";
  if (lower.includes("kunci") || lower.includes("lock")) return "#3b82f6";
  if (lower.includes("lupa") || lower.includes("forgot")) return "#8b5cf6";
  return "#10b981";
}

export function IssueSelector() {
  const { currentStep, selectedPlatform, selectIssue, goBack, setError } = useTroubleshoot();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (currentStep !== "issue" || !selectedPlatform) return;

    const fetchIssues = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const supabase = createClient();
        const tableName = getIssuesTable(selectedPlatform.name);
        const { data, error } = await supabase
          .from(tableName)
          .select("id, issue_name, description")
          .eq("status", "active")
          .order("issue_name");

        if (error) {
          setFetchError(`Gagal memuat data: ${error.message}`);
          setError(`Gagal memuat kendala untuk ${selectedPlatform.name}`);
        } else {
          setIssues(data || []);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
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
      {/* Header with prominent platform indicator */}
      <div className="relative mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-secondary border border-border-default text-text-tertiary hover:text-text-primary hover:border-text-tertiary transition-all duration-300 group shrink-0"
          >
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: brand.primary }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: brand.primary }}>
                Langkah 2 dari 3
              </span>
            </div>
            <h2 className="text-xl font-bold text-text-primary">Pilih Masalah Anda</h2>
            <div className="flex items-center gap-2 mt-1.5">
              {/* Platform badge — very prominent */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold"
                style={{
                  backgroundColor: `${brand.primary}15`,
                  color: brand.primary,
                  border: `1px solid ${brand.primary}30`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: brand.primary }}
                />
                {selectedPlatform.name}
              </span>
              <span className="text-xs text-text-tertiary">— Pilih kendala yang Anda alami</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="mb-6 p-4 rounded-xl border border-danger/20 bg-danger/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-danger">Terjadi Kesalahan</p>
              <p className="text-xs text-text-tertiary mt-0.5">{fetchError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl animate-pulse"
              style={{
                animationDelay: `${i * 100}ms`,
                background: `linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))`,
              }}
            />
          ))}
        </div>
      ) : issues.length === 0 && !fetchError ? (
        /* Empty state */
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border-subtle bg-bg-secondary/50">
          <div className="w-16 h-16 rounded-2xl bg-bg-tertiary flex items-center justify-center mx-auto mb-4 portal-float">
            <svg className="w-7 h-7 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-text-secondary">Belum ada masalah tersedia</p>
          <p className="text-sm text-text-tertiary mt-1">
            Panduan untuk <span className="font-medium" style={{ color: brand.primary }}>{selectedPlatform.name}</span> sedang disiapkan.
          </p>
        </div>
      ) : (
        /* Issue cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {issues.map((issue, i) => {
            const icon = getIssueIcon(issue.issue_name);
            const color = getIssueColor(issue.issue_name);
            const isHovered = hoveredId === issue.id;

            return (
              <button
                key={issue.id}
                onClick={() => selectIssue(issue)}
                onMouseEnter={() => setHoveredId(issue.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="issue-card ts-card-stagger group relative text-left rounded-2xl border bg-bg-secondary/80 backdrop-blur-sm overflow-hidden transition-all duration-300"
                style={{
                  animationDelay: `${i * 80}ms`,
                  borderColor: isHovered ? `${color}40` : 'var(--border-subtle)',
                  boxShadow: isHovered ? `0 8px 32px ${color}10, 0 0 0 1px ${color}08` : 'none',
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                />

                {/* Background gradient on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${color}06, transparent 60%)` }}
                />

                <div className="relative z-10 p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: `${color}12`,
                        color,
                        boxShadow: isHovered ? `0 4px 16px ${color}15` : 'none',
                      }}
                    >
                      {icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary group-hover:text-text-primary transition-colors duration-300">
                        {issue.issue_name}
                      </p>
                      {issue.description && (
                        <p className="text-xs text-text-tertiary mt-1 line-clamp-2 leading-relaxed">
                          {issue.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom action */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-subtle/40">
                    <span className="text-[10px] text-text-tertiary font-medium group-hover:text-text-secondary transition-colors">
                      Klik untuk melihat solusi
                    </span>
                    <div
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                      style={{ color }}
                    >
                      <span className="text-[10px] font-semibold">Pilih</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
