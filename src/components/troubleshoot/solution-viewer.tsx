"use client";

import { useEffect, useState, useCallback } from "react";
import { useTroubleshoot, getPlatformBrand } from "@/lib/troubleshoot-context";
import { createClient } from "@/lib/supabase/client";
import { getSolutionsTable } from "@/lib/platform-tables";

type Solution = {
  id: string;
  issue_id: string;
  step_number: number;
  content_type: string;
  content_data: string;
  button_label: string | null;
  button_link: string | null;
  method_group: string;
};

type MethodGroup = {
  label: string;
  steps: Solution[];
};

/* ——— Copy Button ——— */
function CopyButton({ text }: { text: string }) {
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
      className={`text-[10px] font-medium px-2.5 py-1 rounded-md border transition-all duration-300 ${
        copied
          ? "bg-accent/10 text-accent border-accent/20 scale-105"
          : "bg-bg-secondary text-text-tertiary border-border-default hover:text-text-primary hover:border-text-tertiary"
      }`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

/* ——— Dynamic Shortcut Button ——— */
function DynamicShortcutButton({ label, link, brandColor }: { label: string; link: string; brandColor?: string }) {
  const color = brandColor || "#10b981";
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
      style={{
        backgroundColor: `${color}10`,
        border: `1px solid ${color}25`,
        color,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = color;
        el.style.color = '#ffffff';
        el.style.boxShadow = `0 4px 20px ${color}35`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = `${color}10`;
        el.style.color = color;
        el.style.boxShadow = 'none';
      }}
    >
      <span>{label}</span>
      <svg className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
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
            <div key={i} className="flex gap-2.5 mb-2">
              <span className="text-accent font-mono text-xs mt-0.5 shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
                {numberedMatch[1]}
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
  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return url;
  };

  const isUrl = data.startsWith("http://") || data.startsWith("https://") || data.startsWith("www.");

  if (isUrl) {
    return (
      <div className="space-y-2">
        <div className="relative w-full overflow-hidden bg-bg-primary rounded-xl border border-border-subtle" style={{ aspectRatio: "16/9" }}>
          <iframe src={getEmbedUrl(data)} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Tutorial" />
        </div>
        <a href={data} target="_blank" rel="noopener noreferrer" className="text-xs text-text-tertiary hover:text-accent transition-colors inline-flex items-center gap-1">
          Open in new tab
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
function TemplateContent({ data, solution, brandColor }: { data: string; solution: Solution; brandColor?: string }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        Template — Ready to copy
      </p>

      <div className="bg-bg-input border border-border-default rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-subtle bg-bg-secondary/50">
          <span className="text-[10px] text-text-tertiary font-mono">template</span>
          <CopyButton text={data} />
        </div>
        <pre className="p-4 text-sm text-text-primary font-mono leading-relaxed whitespace-pre-wrap break-words max-h-60 overflow-y-auto">{data}</pre>
      </div>

      {solution.button_label && solution.button_link && (
        <DynamicShortcutButton label={solution.button_label} link={solution.button_link} brandColor={brandColor} />
      )}
    </div>
  );
}

/* ——— Content Renderer ——— */
function ContentRenderer({ solution, brandColor }: { solution: Solution; brandColor?: string }) {
  switch (solution.content_type) {
    case "video":
      return (
        <div className="space-y-3">
          <VideoContent data={solution.content_data} />
          {solution.button_label && solution.button_link && (
            <DynamicShortcutButton label={solution.button_label} link={solution.button_link} brandColor={brandColor} />
          )}
        </div>
      );
    case "template":
      return <TemplateContent data={solution.content_data} solution={solution} brandColor={brandColor} />;
    case "link":
      return (
        <div className="space-y-3">
          <TextContent data={solution.content_data} />
          {solution.button_label && solution.button_link && (
            <DynamicShortcutButton label={solution.button_label} link={solution.button_link} brandColor={brandColor} />
          )}
        </div>
      );
    default:
      return (
        <div className="space-y-3">
          <TextContent data={solution.content_data} />
          {solution.button_label && solution.button_link && (
            <DynamicShortcutButton label={solution.button_label} link={solution.button_link} brandColor={brandColor} />
          )}
        </div>
      );
  }
}

/* ——— Content Type Badge ——— */
function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; color: string }> = {
    text: { label: "Guide", color: "#10b981" },
    video: { label: "Video", color: "#8b5cf6" },
    template: { label: "Template", color: "#f59e0b" },
    link: { label: "Link", color: "#3b82f6" },
  };
  const { label, color } = config[type] || config.text;

  return (
    <span
      className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${color}15`, color }}
    >
      {label}
    </span>
  );
}

/* ——— Main: Solution Viewer ——— */
export function SolutionViewer() {
  const { selectedIssue, selectedPlatform, goBack, reset, setError } = useTroubleshoot();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState(0);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

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
        const { data, error } = await supabase
          .from(tableName)
          .select("id, issue_id, step_number, content_type, content_data, button_label, button_link, method_group")
          .eq("issue_id", selectedIssue.id)
          .order("method_group")
          .order("step_number");

        if (error) {
          setFetchError(`Gagal memuat solusi: ${error.message}`);
          setError(`Gagal memuat solusi untuk ${selectedPlatform.name}`);
        } else if (data) {
          setSolutions(data);
          if (data.length > 0) setExpandedSteps(new Set([data[0].id]));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
        setFetchError(msg);
        setError(msg);
      }
      setLoading(false);
    };

    fetchSolutions();
  }, [selectedIssue, selectedPlatform, setError]);

  if (!selectedIssue || !selectedPlatform) return null;

  const brand = getPlatformBrand(selectedPlatform.name);

  const methodGroups: MethodGroup[] = [];
  const groupMap = new Map<string, Solution[]>();
  for (const s of solutions) {
    const key = s.method_group || "Method 1";
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
      {/* Hero-style header with prominent platform identity */}
      <div className="relative mb-8 solution-header-enter">
        {/* Background decoration */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${brand.primary}06, transparent 50%, ${brand.primary}03)`,
            }}
          />
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl"
            style={{ backgroundColor: `${brand.primary}08` }}
          />
        </div>

        <div
          className="relative p-6 rounded-2xl bg-bg-secondary/50 backdrop-blur-sm"
          style={{ border: `1px solid ${brand.primary}20` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={goBack}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-primary border border-border-default text-text-tertiary hover:text-text-primary hover:border-text-tertiary transition-all duration-300 shrink-0 group mt-0.5"
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                {/* Platform + Issue breadcrumb — very prominent */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                    style={{
                      backgroundColor: `${brand.primary}15`,
                      color: brand.primary,
                      border: `1px solid ${brand.primary}25`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: brand.primary }}
                    />
                    {selectedPlatform.name}
                  </span>
                  <svg className="w-3 h-3 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <span className="text-[11px] font-semibold text-accent px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20">
                    {selectedIssue.issue_name}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-text-primary">Panduan Solusi</h2>
                <p className="text-sm text-text-tertiary mt-0.5">Ikuti langkah-langkah berikut untuk menyelesaikan masalah Anda</p>
              </div>
            </div>
            <button
              onClick={reset}
              className="text-xs text-text-tertiary hover:text-danger transition-all duration-300 shrink-0 px-3 py-1.5 rounded-lg hover:bg-danger/10 border border-transparent hover:border-danger/20"
            >
              Reset
            </button>
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
              <p className="text-sm font-medium text-danger">Gagal Memuat Solusi</p>
              <p className="text-xs text-text-tertiary mt-0.5">{fetchError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl animate-pulse"
              style={{
                animationDelay: `${i * 150}ms`,
                background: `linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))`,
              }}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && solutions.length === 0 && !fetchError && (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border-subtle bg-bg-secondary/50">
          <div className="w-16 h-16 rounded-2xl bg-bg-tertiary flex items-center justify-center mx-auto mb-4 portal-float">
            <svg className="w-7 h-7 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p className="text-base font-semibold text-text-secondary">Belum ada solusi tersedia</p>
          <p className="text-sm text-text-tertiary mt-1">
            Panduan untuk masalah ini di <span className="font-medium" style={{ color: brand.primary }}>{selectedPlatform.name}</span> sedang disiapkan.
          </p>
        </div>
      )}

      {/* Method Tabs */}
      {!loading && methodGroups.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 solution-header-enter" style={{ animationDelay: "0.1s" }}>
          {methodGroups.map((group, i) => (
            <button
              key={group.label}
              onClick={() => {
                setActiveMethod(i);
                if (group.steps.length > 0) setExpandedSteps(new Set([group.steps[0].id]));
              }}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 shrink-0 ${
                activeMethod === i
                  ? "text-white"
                  : "bg-bg-secondary text-text-tertiary hover:text-text-primary border border-border-subtle hover:border-text-tertiary"
              }`}
              style={activeMethod === i ? {
                backgroundColor: brand.primary,
                boxShadow: `0 4px 16px ${brand.primary}35`,
              } : {}}
            >
              {group.label}
              <span className="ml-2 text-xs opacity-70">{group.steps.length} langkah</span>
            </button>
          ))}
        </div>
      )}

      {/* Steps — Timeline Design */}
      {!loading && currentGroup && (
        <div className="space-y-3">
          {currentGroup.steps.map((solution, i) => {
            const isExpanded = expandedSteps.has(solution.id);
            return (
              <div
                key={solution.id}
                className="solution-card-enter rounded-xl border transition-all duration-300"
                style={{
                  animationDelay: `${(i + 1) * 100}ms`,
                  borderColor: isExpanded ? `${brand.primary}30` : 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-secondary)',
                  boxShadow: isExpanded ? `0 4px 24px ${brand.primary}08` : 'none',
                }}
              >
                <button
                  onClick={() => toggleStep(solution.id)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                >
                  {/* Step number circle */}
                  <div className="relative">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300"
                      style={isExpanded ? {
                        backgroundColor: brand.primary,
                        color: '#ffffff',
                        boxShadow: `0 0 12px ${brand.primary}40`,
                      } : {
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {solution.step_number}
                    </span>
                    {/* Connecting line */}
                    {i < currentGroup.steps.length - 1 && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-3"
                        style={{ backgroundColor: 'var(--border-subtle)' }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-text-primary">Langkah {solution.step_number}</span>
                      <TypeBadge type={solution.content_type} />
                    </div>
                    {!isExpanded && (
                      <p className="text-sm text-text-tertiary truncate">
                        {solution.content_data.substring(0, 100)}{solution.content_data.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </div>

                  <svg
                    className={`w-5 h-5 shrink-0 transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    style={{ color: isExpanded ? brand.primary : 'var(--text-tertiary)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-border-subtle/50 animate-slide-up">
                    <div className="pt-4 ml-12">
                      <ContentRenderer solution={solution} brandColor={brand.primary} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Completion indicator */}
          <div className="flex items-center gap-3 pt-4 pb-2 solution-card-enter" style={{ animationDelay: `${(currentGroup.steps.length + 1) * 100}ms` }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${brand.primary}15` }}
            >
              <svg className="w-4 h-4" style={{ color: brand.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-text-tertiary italic">Akhir panduan — Semoga berhasil!</p>
          </div>
        </div>
      )}
    </div>
  );
}
