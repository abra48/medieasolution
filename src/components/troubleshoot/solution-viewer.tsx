"use client";

import { useEffect, useState, useCallback } from "react";
import { useTroubleshoot } from "@/lib/troubleshoot-context";
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
      className={`text-[10px] font-medium px-2.5 py-1 rounded-md border transition-colors ${
        copied
          ? "bg-accent/10 text-accent border-accent/20"
          : "bg-bg-secondary text-text-tertiary border-border-default hover:text-text-primary"
      }`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ——— Dynamic Shortcut Button ——— */
function DynamicShortcutButton({ label, link }: { label: string; link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-dynamic-shortcut"
    >
      <span className="btn-dynamic-shortcut-label">{label}</span>
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
            <div key={i} className="flex gap-2.5 mb-1.5">
              <span className="text-accent font-mono text-xs mt-0.5 shrink-0 w-4 text-right">
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
        <div className="relative w-full overflow-hidden bg-bg-primary rounded-lg" style={{ aspectRatio: "16/9" }}>
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
function TemplateContent({ data, solution }: { data: string; solution: Solution }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-medium text-secondary uppercase tracking-wider">Template — Ready to copy</p>

      <div className="bg-bg-input border border-border-default rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-bg-secondary/50">
          <span className="text-[10px] text-text-tertiary font-mono">template</span>
          <CopyButton text={data} />
        </div>
        <pre className="p-3 text-sm text-text-primary font-mono leading-relaxed whitespace-pre-wrap break-words max-h-60 overflow-y-auto">{data}</pre>
      </div>

      {solution.button_label && solution.button_link && (
        <DynamicShortcutButton label={solution.button_label} link={solution.button_link} />
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
            <DynamicShortcutButton label={solution.button_label} link={solution.button_link} />
          )}
        </div>
      );
    case "template":
      return <TemplateContent data={solution.content_data} solution={solution} />;
    case "link":
      return (
        <div className="space-y-3">
          <TextContent data={solution.content_data} />
          {solution.button_label && solution.button_link && (
            <DynamicShortcutButton label={solution.button_label} link={solution.button_link} />
          )}
        </div>
      );
    default:
      return (
        <div className="space-y-3">
          <TextContent data={solution.content_data} />
          {solution.button_label && solution.button_link && (
            <DynamicShortcutButton label={solution.button_label} link={solution.button_link} />
          )}
        </div>
      );
  }
}

/* ——— Content Type Badge ——— */
function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    text: "Guide",
    video: "Video",
    template: "Template",
    link: "Link",
  };
  return (
    <span className="text-[9px] font-medium text-text-tertiary uppercase tracking-wider px-1.5 py-0.5 bg-bg-tertiary rounded">
      {labels[type] || "Guide"}
    </span>
  );
}

/* ——— Main: Solution Viewer ——— */
export function SolutionViewer() {
  const { selectedIssue, selectedPlatform, goBack, reset } = useTroubleshoot();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMethod, setActiveMethod] = useState(0);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!selectedIssue || !selectedPlatform) return;

    const fetchSolutions = async () => {
      setLoading(true);
      setExpandedSteps(new Set());
      setActiveMethod(0);
      const supabase = createClient();
      const tableName = getSolutionsTable(selectedPlatform.name);
      const { data, error } = await supabase
        .from(tableName)
        .select("id, issue_id, step_number, content_type, content_data, button_label, button_link, method_group")
        .eq("issue_id", selectedIssue.id)
        .order("method_group")
        .order("step_number");

      if (!error && data) {
        setSolutions(data);
        if (data.length > 0) setExpandedSteps(new Set([data[0].id]));
      }
      setLoading(false);
    };

    fetchSolutions();
  }, [selectedIssue, selectedPlatform]);

  if (!selectedIssue || !selectedPlatform) return null;

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
    <div className="animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={goBack}
            className="w-7 h-7 rounded-md flex items-center justify-center bg-bg-secondary border border-border-default text-text-tertiary hover:text-text-primary transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            <p className="text-xs text-text-tertiary">
              <span className="text-secondary font-medium">{selectedPlatform.name}</span>
              {" / "}
              <span className="text-accent font-medium">{selectedIssue.issue_name}</span>
            </p>
          </div>
        </div>
        <button onClick={reset} className="text-[10px] text-text-tertiary hover:text-danger transition-colors shrink-0">
          Reset
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-skeleton" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && solutions.length === 0 && (
        <div className="card text-center !py-12">
          <p className="text-sm text-text-secondary">No solutions available yet.</p>
          <p className="text-xs text-text-tertiary mt-1">Guides for this issue are being prepared.</p>
        </div>
      )}

      {/* Method Tabs */}
      {!loading && methodGroups.length > 1 && (
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {methodGroups.map((group, i) => (
            <button
              key={group.label}
              onClick={() => {
                setActiveMethod(i);
                if (group.steps.length > 0) setExpandedSteps(new Set([group.steps[0].id]));
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors shrink-0 ${
                activeMethod === i
                  ? "bg-accent text-text-inverse"
                  : "bg-bg-secondary text-text-tertiary hover:text-text-primary"
              }`}
            >
              {group.label}
              <span className="ml-1.5 text-[9px] opacity-70">{group.steps.length}</span>
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
              <div key={solution.id} className={`rounded-lg border transition-colors ${isExpanded ? "border-accent/30 bg-bg-secondary" : "border-border-default bg-bg-secondary"}`}>
                <button
                  onClick={() => toggleStep(solution.id)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3"
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${isExpanded ? "bg-accent text-text-inverse" : "bg-bg-tertiary text-text-tertiary"}`}>
                    {solution.step_number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-tertiary">Step {solution.step_number}</span>
                      <TypeBadge type={solution.content_type} />
                    </div>
                    {!isExpanded && (
                      <p className="text-sm text-text-secondary truncate mt-0.5">
                        {solution.content_data.substring(0, 80)}{solution.content_data.length > 80 ? "..." : ""}
                      </p>
                    )}
                  </div>
                  <svg className={`w-4 h-4 text-text-tertiary shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border-subtle">
                    <div className="pt-3">
                      <ContentRenderer solution={solution} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <p className="text-xs text-text-tertiary pt-2 italic">End of guide.</p>
        </div>
      )}
    </div>
  );
}
