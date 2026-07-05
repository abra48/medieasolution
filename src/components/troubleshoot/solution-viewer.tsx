"use client";

import { useEffect, useState, useCallback } from "react";
import { useTroubleshoot } from "@/lib/troubleshoot-context";
import { createClient } from "@/lib/supabase/client";

/* ——— Types ——— */
type Solution = {
  id: string;
  issue_id: string;
  step_number: number;
  content_type: string;
  content_data: string;
  shortcut_url: string | null;
  method_group: string;
};

type MethodGroup = {
  label: string;
  steps: Solution[];
};

/* ——————————————————————————————————————
   COPY BUTTON (reusable)
   —————————————————————————————————————— */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
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
      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider
        transition-all duration-300 ${
          copied
            ? "bg-accent-green/15 text-accent-green border-accent-green/30"
            : "bg-bg-secondary text-text-secondary border-border-default hover:text-accent-green hover:border-accent-green/50"
        } border`}
      style={{
        clipPath:
          "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
      }}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Tersalin!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Salin Teks
        </>
      )}
    </button>
  );
}

/* ——————————————————————————————————————
   SHORTCUT BUTTON
   —————————————————————————————————————— */
function ShortcutButton({ url, label }: { url: string; label?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 w-full sm:w-auto
                 bg-gradient-to-r from-[#FFD700] to-[#DAA520]
                 text-[#1e252b] font-bold text-sm
                 px-6 py-3.5
                 transition-all duration-300
                 hover:shadow-[0_0_28px_rgba(255,215,0,0.35),0_4px_16px_rgba(0,0,0,0.3)]
                 hover:scale-[1.02]
                 active:scale-[0.98]"
      style={{
        clipPath:
          "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)",
      }}
    >
      <svg
        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      <span>{label || "Tombol Shortcut — Buka Link"}</span>
      <svg
        className="w-4 h-4 ml-auto sm:ml-2 opacity-60 group-hover:opacity-100 transition-opacity"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

/* ——————————————————————————————————————
   TEXT CONTENT RENDERER
   —————————————————————————————————————— */
function TextContent({ data }: { data: string }) {
  return (
    <div className="text-sm text-text-secondary leading-[1.8] whitespace-pre-wrap font-normal">
      {data.split("\n").map((line, i) => {
        // Detect numbered lines (e.g., "1. ...", "2. ...")
        const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-3 mb-2">
              <span className="text-accent-green font-mono font-bold text-xs mt-0.5 shrink-0 w-5 text-right">
                {numberedMatch[1]}.
              </span>
              <span>{numberedMatch[2]}</span>
            </div>
          );
        }
        // Detect bold markers **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={line.trim() === "" ? "h-3" : "mb-1"}>
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <span key={j} className="font-semibold text-text-primary">
                    {part.slice(2, -2)}
                  </span>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

/* ——————————————————————————————————————
   LINK CONTENT RENDERER
   —————————————————————————————————————— */
function LinkContent({ data, shortcutUrl }: { data: string; shortcutUrl: string | null }) {
  return (
    <div className="space-y-4">
      <TextContent data={data} />
      {shortcutUrl && (
        <div className="pt-2">
          <ShortcutButton url={shortcutUrl} />
        </div>
      )}
    </div>
  );
}

/* ——————————————————————————————————————
   VIDEO CONTENT RENDERER
   —————————————————————————————————————— */
function VideoContent({ data }: { data: string }) {
  // Detect YouTube/embed URLs
  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return url;
  };

  const isUrl =
    data.startsWith("http://") || data.startsWith("https://") || data.startsWith("www.");

  if (isUrl) {
    return (
      <div className="space-y-3">
        <div
          className="relative w-full overflow-hidden bg-black"
          style={{
            aspectRatio: "16/9",
            clipPath:
              "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
          }}
        >
          <iframe
            src={getEmbedUrl(data)}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video Tutorial"
          />
        </div>
        <a
          href={data}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-accent-green transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Buka di tab baru
        </a>
      </div>
    );
  }

  // Fallback: treat as description text
  return <TextContent data={data} />;
}

/* ——————————————————————————————————————
   TEMPLATE CONTENT RENDERER
   —————————————————————————————————————— */
function TemplateContent({
  data,
  shortcutUrl,
}: {
  data: string;
  shortcutUrl: string | null;
}) {
  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-center gap-2 text-xs font-semibold text-accent-gold uppercase tracking-wider">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Template / Bahan — Siap Salin
      </div>

      {/* Template Box */}
      <div
        className="relative bg-bg-input border border-border-default"
        style={{
          clipPath:
            "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-bg-secondary/50">
          <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
            Copywriting / Form Data
          </span>
          <CopyButton text={data} />
        </div>

        {/* Content */}
        <div className="p-4 max-h-64 overflow-y-auto">
          <pre className="text-sm text-text-primary font-mono leading-relaxed whitespace-pre-wrap break-words">
            {data}
          </pre>
        </div>
      </div>

      {/* Shortcut Button */}
      {shortcutUrl && (
        <ShortcutButton
          url={shortcutUrl}
          label="Kirim Template — Buka Form"
        />
      )}
    </div>
  );
}

/* ——————————————————————————————————————
   CONTENT TYPE ICON + LABEL
   —————————————————————————————————————— */
function ContentTypeBadge({ type, active }: { type: string; active: boolean }) {
  const config: Record<string, { icon: React.ReactNode; label: string }> = {
    text: {
      label: "Panduan",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
    },
    video: {
      label: "Video",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    template: {
      label: "Template",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    link: {
      label: "Link",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
  };

  const c = config[type] ?? config.text;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300
        ${active ? "bg-accent-green/10 text-accent-green" : "bg-bg-secondary text-text-tertiary"}`}
      style={{
        clipPath:
          "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
      }}
    >
      {c.icon}
      {c.label}
    </div>
  );
}

/* ——————————————————————————————————————
   CONTENT RENDERER (dispatcher)
   —————————————————————————————————————— */
function ContentRenderer({ solution }: { solution: Solution }) {
  switch (solution.content_type) {
    case "video":
      return <VideoContent data={solution.content_data} />;
    case "template":
      return (
        <TemplateContent
          data={solution.content_data}
          shortcutUrl={solution.shortcut_url}
        />
      );
    case "link":
      return (
        <LinkContent
          data={solution.content_data}
          shortcutUrl={solution.shortcut_url}
        />
      );
    default:
      return (
        <div className="space-y-4">
          <TextContent data={solution.content_data} />
          {solution.shortcut_url && (
            <ShortcutButton url={solution.shortcut_url} />
          )}
        </div>
      );
  }
}

/* ===================================================
   MAIN: SOLUTION VIEWER
   =================================================== */
export function SolutionViewer() {
  const { selectedIssue, selectedPlatform, goBack, reset } = useTroubleshoot();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMethod, setActiveMethod] = useState(0);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!selectedIssue) return;

    const fetchSolutions = async () => {
      setLoading(true);
      setExpandedSteps(new Set());
      setActiveMethod(0);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("solutions")
        .select(
          "id, issue_id, step_number, content_type, content_data, shortcut_url, method_group"
        )
        .eq("issue_id", selectedIssue.id)
        .order("method_group")
        .order("step_number");

      if (!error && data) {
        setSolutions(data);
        // Auto-expand first step
        if (data.length > 0) {
          setExpandedSteps(new Set([data[0].id]));
        }
      }
      setLoading(false);
    };

    fetchSolutions();
  }, [selectedIssue]);

  if (!selectedIssue || !selectedPlatform) return null;

  // Group solutions by method_group
  const methodGroups: MethodGroup[] = [];
  const groupMap = new Map<string, Solution[]>();
  for (const s of solutions) {
    const key = s.method_group || "Cara 1";
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

  const expandAll = () => {
    if (currentGroup) {
      setExpandedSteps(new Set(currentGroup.steps.map((s) => s.id)));
    }
  };

  return (
    <div className="animate-slide-up">
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={goBack}
            className="w-10 h-10 shrink-0 flex items-center justify-center bg-bg-secondary border border-border-default
                       text-text-secondary hover:text-accent-green hover:border-accent-green
                       transition-all duration-200"
            style={{
              clipPath:
                "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-text-primary truncate">
              Solusi & Panduan
            </h2>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary flex-wrap">
              <span className="text-accent-gold font-medium">{selectedPlatform.name}</span>
              <svg className="w-3 h-3 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-accent-green font-medium truncate">{selectedIssue.issue_name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {currentGroup && currentGroup.steps.length > 1 && (
            <button
              onClick={expandAll}
              className="text-[10px] font-semibold text-text-tertiary hover:text-accent-green uppercase tracking-wider
                         border border-border-default px-3 py-1.5 transition-colors"
              style={{
                clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
              }}
            >
              Buka Semua
            </button>
          )}
          <button
            onClick={reset}
            className="text-[10px] font-semibold text-text-tertiary hover:text-danger uppercase tracking-wider
                       border border-border-default px-3 py-1.5 transition-colors"
            style={{
              clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
            }}
          >
            Mulai Ulang
          </button>
        </div>
      </div>

      {/* ═══════════ LOADING ═══════════ */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-bg-secondary border border-border-default animate-pulse"
              style={{
                height: `${80 + i * 20}px`,
                clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
              }}
            />
          ))}
        </div>
      )}

      {/* ═══════════ EMPTY STATE ═══════════ */}
      {!loading && solutions.length === 0 && (
        <div
          className="text-center py-16 bg-bg-secondary/30 border border-border-default"
          style={{
            clipPath: "polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
          }}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-bg-secondary border border-border-default"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <svg className="w-7 h-7 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-text-secondary font-semibold">Solusi belum tersedia</p>
          <p className="text-sm text-text-tertiary mt-1">Panduan untuk kendala ini sedang disiapkan</p>
        </div>
      )}

      {/* ═══════════ METHOD TABS ═══════════ */}
      {!loading && methodGroups.length > 1 && (
        <div className="flex gap-0 mb-6 overflow-x-auto">
          {methodGroups.map((group, index) => (
            <button
              key={group.label}
              onClick={() => {
                setActiveMethod(index);
                // Auto-expand first step of new method
                if (group.steps.length > 0) {
                  setExpandedSteps(new Set([group.steps[0].id]));
                }
              }}
              className={`relative px-5 sm:px-6 py-3 text-sm font-semibold transition-all duration-300 shrink-0
                ${
                  activeMethod === index
                    ? "bg-bg-primary text-accent-green border-t-2 border-t-accent-green border-x border-x-border-default border-b-0"
                    : "bg-bg-secondary text-text-tertiary border border-border-default hover:text-text-secondary"
                }`}
              style={{
                clipPath:
                  activeMethod === index
                    ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                    : "polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)",
                marginRight: index < methodGroups.length - 1 ? "-1px" : "0",
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold
                    ${activeMethod === index ? "bg-accent-green text-text-inverse" : "bg-bg-tertiary text-text-tertiary"}`}
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                >
                  {index + 1}
                </span>
                {group.label}
              </span>
              {/* Step count */}
              <span
                className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5
                  ${activeMethod === index ? "bg-accent-green/10 text-accent-green" : "bg-bg-tertiary text-text-tertiary"}`}
                style={{
                  clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)",
                }}
              >
                {group.steps.length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ═══════════ SINGLE METHOD LABEL ═══════════ */}
      {!loading && methodGroups.length === 1 && (
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 flex items-center justify-center bg-accent-green/15 text-accent-green text-xs font-bold"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            {methodGroups[0].steps.length}
          </div>
          <span className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{methodGroups[0].steps.length} langkah</span> untuk menyelesaikan kendala ini
          </span>
        </div>
      )}

      {/* ═══════════ SOLUTION STEPS ═══════════ */}
      {!loading && currentGroup && (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-border-default z-0" />

          <div className="space-y-4 relative z-10">
            {currentGroup.steps.map((solution, index) => {
              const isExpanded = expandedSteps.has(solution.id);
              const isLast = index === currentGroup.steps.length - 1;

              return (
                <div key={solution.id} className="relative pl-12 sm:pl-14">
                  {/* ——— Timeline Node ——— */}
                  <div
                    className={`absolute left-2.5 sm:left-3 top-4 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center
                      text-[9px] sm:text-[10px] font-bold z-20 transition-all duration-300
                      ${
                        isExpanded
                          ? "bg-accent-green text-text-inverse shadow-[0_0_12px_rgba(57,255,20,0.3)]"
                          : "bg-bg-secondary text-text-tertiary border border-border-default"
                      }`}
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    {solution.step_number}
                  </div>

                  {/* ——— Step Card ——— */}
                  <div
                    className={`relative bg-bg-primary border transition-all duration-300
                      ${
                        isExpanded
                          ? "border-accent-green/40 shadow-[0_0_24px_rgba(57,255,20,0.06),0_4px_20px_rgba(0,0,0,0.25)]"
                          : "border-border-default hover:border-border-focus/30"
                      }`}
                    style={{
                      clipPath:
                        "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)",
                    }}
                  >
                    {/* Left accent */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-300 ${
                        isExpanded ? "bg-accent-green" : "bg-border-default"
                      }`}
                    />

                    {/* 3D depth shadow (bottom-right inset) */}
                    <div className="absolute inset-0 pointer-events-none opacity-30"
                      style={{
                        boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.02)",
                      }}
                    />

                    {/* ——— Step Header (clickable) ——— */}
                    <button
                      onClick={() => toggleStep(solution.id)}
                      className="w-full text-left px-4 sm:px-5 py-3.5 pl-5 sm:pl-6 flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">
                          Langkah {solution.step_number}
                          {isLast && (
                            <span className="ml-2 text-accent-gold">— Terakhir</span>
                          )}
                        </p>
                        {/* Preview of content (collapsed) */}
                        {!isExpanded && (
                          <p className="text-sm text-text-secondary truncate">
                            {solution.content_data.substring(0, 80)}
                            {solution.content_data.length > 80 ? "..." : ""}
                          </p>
                        )}
                      </div>

                      {/* Content type badge */}
                      <ContentTypeBadge type={solution.content_type} active={isExpanded} />

                      {/* Expand/collapse chevron */}
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-text-tertiary shrink-0 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* ——— Step Content (expanded) ——— */}
                    <div
                      className={`overflow-hidden transition-all duration-400 ease-out ${
                        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-4 sm:px-5 pb-5 pl-5 sm:pl-6 pt-0 border-t border-border-subtle">
                        <div className="pt-4">
                          <ContentRenderer solution={solution} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline end marker */}
          <div className="relative pl-12 sm:pl-14 mt-4">
            <div
              className="absolute left-3.5 sm:left-4 top-0 w-3 h-3 bg-accent-gold"
              style={{
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            />
            <p className="text-xs text-text-tertiary italic pt-0.5">
              Akhir panduan — selamat mencoba!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
