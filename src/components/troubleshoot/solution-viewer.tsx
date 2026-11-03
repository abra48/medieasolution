"use client";

import { useEffect, useState, useCallback } from "react";
import { useTroubleshoot, getPlatformBrand, localizeIssue } from "@/lib/troubleshoot-context";
import { createClient } from "@/lib/supabase/client";
import { getSolutionsTable } from "@/lib/platform-tables";
import { useI18n } from "@/lib/i18n";

type Solution = {
  id: string;
  issue_id: string;
  step_number: number;
  content_type: string;
  content_data: string;
  content_data_en: string | null;
  button_label: string | null;
  button_link: string | null;
  method_group: string;
};

type MethodGroup = {
  label: string;
  steps: Solution[];
};

/* ——— Button Icon Set (cute icons for up to 3 buttons) ——— */
const BUTTON_ICONS = [
  // Icon 1: Rocket 🚀
  (
    <svg key="rocket" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  // Icon 2: Sparkles ✨
  (
    <svg key="sparkles" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  // Icon 3: Heart 💖
  (
    <svg key="heart" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
];

/* ——— Parse pipe-separated button fields into arrays ——— */
function parseButtons(label: string | null, link: string | null): { label: string; link: string }[] {
  if (!label || !link) return [];
  const labels = label.split("|").map((s) => s.trim()).filter(Boolean);
  const links = link.split("|").map((s) => s.trim()).filter(Boolean);
  const count = Math.min(labels.length, links.length, 3); // max 3
  const buttons: { label: string; link: string }[] = [];
  for (let i = 0; i < count; i++) {
    if (labels[i] && links[i]) {
      buttons.push({ label: labels[i], link: links[i] });
    }
  }
  return buttons;
}

/* ——— Copy Button ——— */
function CopyButton({ text }: { text: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-colors ${
        copied
          ? "bg-accent/10 text-accent border-accent/20"
          : "bg-bg-secondary text-text-tertiary border-border-default hover:text-text-primary"
      }`}
    >
      {copied ? t("troubleshoot.copied") : t("troubleshoot.copy")}
    </button>
  );
}

/* ——— Shortcut Buttons (up to 3, with cute icons) ——— */
function ShortcutButtons({ solution }: { solution: Solution }) {
  const buttons = parseButtons(solution.button_label, solution.button_link);
  if (buttons.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn, i) => (
        <a
          key={i}
          href={btn.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          {BUTTON_ICONS[i % BUTTON_ICONS.length]}
          <span>{btn.label}</span>
          <svg className="w-3 h-3 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </a>
      ))}
    </div>
  );
}

/* ——— Text Content ——— */
function TextContent({ data }: { data: string }) {
  return (
    <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
      {data.split("\n").map((line, i) => {
        const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2 mb-1.5">
              <span className="text-text-tertiary font-mono text-xs mt-0.5 shrink-0 w-5 text-right">
                {numberedMatch[1]}.
              </span>
              <span>{numberedMatch[2]}</span>
            </div>
          );
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={line.trim() === "" ? "h-2" : "mb-1"}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <span key={j} className="font-medium text-text-primary">{part.slice(2, -2)}</span>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

/* ——— Video Content ——— */
function VideoContent({ data }: { data: string }) {
  const { t } = useI18n();

  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return url;
  };

  const isUrl = data.startsWith("http://") || data.startsWith("https://") || data.startsWith("www.");

  if (isUrl) {
    return (
      <div className="space-y-2">
        <div className="relative w-full overflow-hidden bg-bg-primary rounded-lg border border-border-subtle" style={{ aspectRatio: "16/9" }}>
          <iframe src={getEmbedUrl(data)} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Tutorial" />
        </div>
        <a href={data} target="_blank" rel="noopener noreferrer" className="text-xs text-text-tertiary hover:text-accent transition-colors inline-flex items-center gap-1">
          {t("troubleshoot.openNewTab")}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    );
  }

  return <TextContent data={data} />;
}

/* ——— Template Content ——— */
function TemplateContent({ data, solution }: { data: string; solution: Solution }) {
  return (
    <div className="space-y-3">
      <div className="bg-bg-primary border border-border-default rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-bg-secondary/50">
          <span className="text-[10px] text-text-tertiary font-mono">template</span>
          <CopyButton text={data} />
        </div>
        <pre className="p-3 text-sm text-text-primary font-mono leading-relaxed whitespace-pre-wrap break-words max-h-60 overflow-y-auto">{data}</pre>
      </div>

      <ShortcutButtons solution={solution} />
    </div>
  );
}

/* ——— Content Renderer ——— */
function ContentRenderer({ solution }: { solution: Solution }) {
  switch (solution.content_type) {
    case "video":
      return (
        <div className="space-y-3">
          <VideoContent data={solution.content_data} />
          <ShortcutButtons solution={solution} />
        </div>
      );
    case "template":
      return <TemplateContent data={solution.content_data} solution={solution} />;
    default:
      return (
        <div className="space-y-3">
          <TextContent data={solution.content_data} />
          <ShortcutButtons solution={solution} />
        </div>
      );
  }
}

/* ——— Type Badge ——— */
function TypeBadge({ type }: { type: string }) {
  const { t } = useI18n();
  const labelMap: Record<string, string> = {
    text: t("troubleshoot.text"),
    video: t("troubleshoot.video"),
    template: t("troubleshoot.template"),
    link: t("troubleshoot.link"),
  };
  return (
    <span className="text-[10px] font-medium text-text-tertiary px-1.5 py-0.5 rounded bg-bg-tertiary">
      {labelMap[type] || t("troubleshoot.text")}
    </span>
  );
}

/* ——— Main: Solution Viewer ——— */
export function SolutionViewer() {
  const { t, locale } = useI18n();
  const { selectedIssue, selectedPlatform, goBack, reset, setError } = useTroubleshoot();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState(0);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [debugTable, setDebugTable] = useState<string>("");
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    if (!selectedIssue || !selectedPlatform) return;

    const fetchSolutions = async () => {
      setLoading(true);
      setFetchError(null);
      setExpandedSteps(new Set());
      setActiveMethod(0);

      try {
        const supabase = createClient();
        const tableName = getSolutionsTable(selectedPlatform.name);
        setDebugTable(tableName);

        console.log(`[SolutionViewer] Platform: "${selectedPlatform.name}" → Table: "${tableName}" → Issue ID: "${selectedIssue.id}"`);

        const { data, error } = await supabase
          .from(tableName)
          .select("id, issue_id, step_number, content_type, content_data, content_data_en, button_label, button_link, method_group")
          .eq("issue_id", selectedIssue.id)
          .order("method_group")
          .order("step_number");

        if (error) {
          console.error(`[SolutionViewer] Error querying ${tableName}:`, error);
          setFetchError(`${t("troubleshoot.errorLoading")} (${tableName}): ${error.message}`);
          setError(`${t("troubleshoot.errorLoading")} — ${selectedPlatform.name}`);
        } else if (data) {
          console.log(`[SolutionViewer] Loaded ${data.length} solutions from ${tableName}`);
          setSolutions(data);
          if (data.length > 0) setExpandedSteps(new Set([data[0].id]));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : t("troubleshoot.errorLoading");
        setFetchError(msg);
        setError(msg);
      }
      setLoading(false);
    };

    fetchSolutions();
  }, [selectedIssue, selectedPlatform, setError, t]);

  if (!selectedIssue || !selectedPlatform) return null;

  const brand = getPlatformBrand(selectedPlatform.name);

  const methodGroups: MethodGroup[] = [];
  const groupMap = new Map<string, Solution[]>();
  for (const raw of solutions) {
    // Pakai versi Inggris jika tersedia, fallback ke Indonesia
    const s =
      locale === "en" && raw.content_data_en?.trim()
        ? { ...raw, content_data: raw.content_data_en }
        : raw;
    const group = s.method_group || "Metode 1";
    const key = locale === "en" ? group.replace(/^metode\b/i, "Method") : group;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(s);
  }
  for (const [label, steps] of groupMap) {
    methodGroups.push({ label, steps });
  }

  const currentGroup = methodGroups[activeMethod] ?? null;

  const toggleStep = (id: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-start gap-3">
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-subtle text-text-tertiary hover:text-text-primary hover:border-text-tertiary transition-colors shrink-0 mt-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${brand.primary}10`,
                  color: brand.primary,
                }}
              >
                {selectedPlatform.name}
              </span>
              <svg className="w-3 h-3 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-[11px] font-semibold text-text-secondary">
                {localizeIssue(selectedIssue, locale).issue_name}
              </span>
            </div>
            <h2 className="text-lg font-bold text-text-primary">{t("troubleshoot.solution")}</h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              {t("troubleshoot.solutionSubtitle")}
              {debugTable && <span className="font-mono"> ({debugTable})</span>}
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="text-xs text-text-tertiary hover:text-danger transition-colors shrink-0 px-2 py-1 rounded hover:bg-danger/5"
        >
          {t("troubleshoot.reset")}
        </button>
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
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg skeleton-premium" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && solutions.length === 0 && !fetchError && (
        <div className="text-center py-12 rounded-xl border border-dashed border-border-subtle bg-bg-secondary/50">
          <p className="text-sm font-medium text-text-secondary">{t("troubleshoot.noSolution")}</p>
          <p className="text-xs text-text-tertiary mt-1">
            {t("troubleshoot.noSolutionDesc")} — <span className="font-medium" style={{ color: brand.primary }}>{selectedPlatform.name}</span>
          </p>
        </div>
      )}

      {/* Method Tabs */}
      {!loading && methodGroups.length > 1 && (
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {methodGroups.map((group, i) => (
            <button
              key={group.label}
              onClick={() => {
                setActiveMethod(i);
                if (group.steps.length > 0) setExpandedSteps(new Set([group.steps[0].id]));
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors shrink-0 ${
                activeMethod === i
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-tertiary hover:text-text-primary border border-border-subtle"
              }`}
            >
              {group.label}
              <span className="ml-1.5 text-xs opacity-70">{group.steps.length}</span>
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {!loading && currentGroup && currentGroup.steps.length > 0 && (
        <div className="solution-progress">
          <div
            className="solution-progress-fill"
            style={{
              width: `${(expandedSteps.size / currentGroup.steps.length) * 100}%`,
              backgroundColor: brand.primary,
              color: brand.primary,
            }}
          />
        </div>
      )}

      {/* Expand/Collapse All */}
      {!loading && currentGroup && currentGroup.steps.length > 1 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => {
              if (allExpanded) {
                setExpandedSteps(new Set());
                setAllExpanded(false);
              } else {
                setExpandedSteps(new Set(currentGroup.steps.map(s => s.id)));
                setAllExpanded(true);
              }
            }}
            className="text-[11px] font-medium text-text-tertiary hover:text-accent transition-colors px-2 py-1 rounded hover:bg-accent/5"
          >
            {allExpanded ? t("troubleshoot.closeAll") : t("troubleshoot.openAll")}
          </button>
        </div>
      )}

      {/* Steps */}
      {!loading && currentGroup && (
        <div className="space-y-2">
          {currentGroup.steps.map((solution) => {
            const isExpanded = expandedSteps.has(solution.id);
            return (
              <div
                key={solution.id}
                className="rounded-lg border transition-colors duration-200"
                style={{
                  borderColor: isExpanded ? `${brand.primary}25` : 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                <button
                  onClick={() => toggleStep(solution.id)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-200"
                    style={isExpanded ? {
                      backgroundColor: brand.primary,
                      color: '#fff',
                    } : {
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {solution.step_number}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-text-primary">{t("troubleshoot.step")} {solution.step_number}</span>
                      <TypeBadge type={solution.content_type} />
                      {/* Show button count badge if multiple buttons */}
                      {(() => {
                        const btnCount = parseButtons(solution.button_label, solution.button_link).length;
                        return btnCount > 1 ? (
                          <span className="text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                            {btnCount} links
                          </span>
                        ) : null;
                      })()}
                    </div>
                    {!isExpanded && (
                      <p className="text-xs text-text-tertiary truncate mt-0.5">
                        {solution.content_data.substring(0, 80)}{solution.content_data.length > 80 ? "..." : ""}
                      </p>
                    )}
                  </div>

                  <svg
                    className={`w-4 h-4 shrink-0 text-text-tertiary transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border-subtle/50">
                    <div className="pt-3 pl-9">
                      <ContentRenderer solution={solution} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* End indicator */}
          <div className="flex items-center gap-2 pt-3 pb-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${brand.primary}10` }}
            >
              <svg className="w-3.5 h-3.5" style={{ color: brand.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-text-tertiary">{t("troubleshoot.endGuide")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
