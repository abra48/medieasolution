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
      className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-colors ${
        copied
          ? "bg-accent/10 text-accent border-accent/20"
          : "bg-bg-secondary text-text-tertiary border-border-default hover:text-text-primary"
      }`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ——— Shortcut Button ——— */
function ShortcutButton({ label, link }: { label: string; link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white transition-colors duration-200"
    >
      <span>{label}</span>
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          Buka di tab baru
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

      {solution.button_label && solution.button_link && (
        <ShortcutButton label={solution.button_label} link={solution.button_link} />
      )}
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
          {solution.button_label && solution.button_link && (
            <ShortcutButton label={solution.button_label} link={solution.button_link} />
          )}
        </div>
      );
    case "template":
      return <TemplateContent data={solution.content_data} solution={solution} />;
    default:
      return (
        <div className="space-y-3">
          <TextContent data={solution.content_data} />
          {solution.button_label && solution.button_link && (
            <ShortcutButton label={solution.button_label} link={solution.button_link} />
          )}
        </div>
      );
  }
}

/* ——— Type Badge ——— */
function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    text: "Teks",
    video: "Video",
    template: "Template",
    link: "Link",
  };
  return (
    <span className="text-[10px] font-medium text-text-tertiary px-1.5 py-0.5 rounded bg-bg-tertiary">
      {labels[type] || "Teks"}
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
  const [debugTable, setDebugTable] = useState<string>("");

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

        // Debug: log tabel yang di-query
        console.log(`[SolutionViewer] Platform: "${selectedPlatform.name}" → Table: "${tableName}" → Issue ID: "${selectedIssue.id}"`);

        const { data, error } = await supabase
          .from(tableName)
          .select("id, issue_id, step_number, content_type, content_data, button_label, button_link, method_group")
          .eq("issue_id", selectedIssue.id)
          .order("method_group")
          .order("step_number");

        if (error) {
          console.error(`[SolutionViewer] Error querying ${tableName}:`, error);
          setFetchError(`Gagal memuat solusi dari ${tableName}: ${error.message}`);
          setError(`Gagal memuat solusi untuk ${selectedPlatform.name}`);
        } else if (data) {
          console.log(`[SolutionViewer] Loaded ${data.length} solutions from ${tableName}`);
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
    const key = s.method_group || "Metode 1";
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
                {selectedIssue.issue_name}
              </span>
            </div>
            <h2 className="text-lg font-bold text-text-primary">Panduan Solusi</h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              Ikuti langkah berikut untuk menyelesaikan masalah Anda
              {debugTable && <span className="font-mono"> ({debugTable})</span>}
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="text-xs text-text-tertiary hover:text-danger transition-colors shrink-0 px-2 py-1 rounded hover:bg-danger/5"
        >
          Reset
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
            <div key={i} className="h-16 rounded-lg bg-bg-secondary animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && solutions.length === 0 && !fetchError && (
        <div className="text-center py-12 rounded-xl border border-dashed border-border-subtle bg-bg-secondary/50">
          <p className="text-sm font-medium text-text-secondary">Belum ada solusi tersedia</p>
          <p className="text-xs text-text-tertiary mt-1">
            Panduan untuk masalah ini di <span className="font-medium" style={{ color: brand.primary }}>{selectedPlatform.name}</span> sedang disiapkan.
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
                      <span className="text-sm font-medium text-text-primary">Langkah {solution.step_number}</span>
                      <TypeBadge type={solution.content_type} />
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
            <p className="text-xs text-text-tertiary">Akhir panduan</p>
          </div>
        </div>
      )}
    </div>
  );
}
