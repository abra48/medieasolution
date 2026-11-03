"use client";

import { useEffect, useState, useCallback } from "react";
import { useTroubleshoot, localizeIssue } from "@/lib/troubleshoot-context";
import { createClient } from "@/lib/supabase/client";
import { getSolutionsTable } from "@/lib/platform-tables";
import { parseButtons } from "@/lib/solution-buttons";
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

/* ——— Thin arrow used on every outbound link ——— */
function ArrowUpRight() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden>
      <path d="M4.5 11.5l7-7M6 4.5h5.5V10" strokeLinecap="square" />
    </svg>
  );
}

/* ——— Copy Button ——— */
function CopyButton({ text }: { text: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button type="button" onClick={handleCopy} className="mx-link">
      {copied ? t("troubleshoot.copied") : t("troubleshoot.copy")}
    </button>
  );
}

/* ——— Link buttons (max 3) ——— */
function LinkButtons({ solution }: { solution: Solution }) {
  const buttons = parseButtons(solution.button_label, solution.button_link);
  if (buttons.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {buttons.map((btn, i) => (
        <a key={i} href={btn.link} target="_blank" rel="noopener noreferrer" className="mx-btn">
          <span>{btn.label}</span>
          <ArrowUpRight />
        </a>
      ))}
    </div>
  );
}

/* ——— Text Content ——— */
function TextContent({ data }: { data: string }) {
  return (
    <div className="text-sm leading-7" style={{ color: "var(--p-soft)" }}>
      {data.split("\n").map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-3" />;

        const numbered = line.match(/^\s*(\d+)[.)]\s+(.+)/);
        const bullet = line.match(/^\s*[-•*]\s+(.+)/);
        const body = numbered ? numbered[2] : bullet ? bullet[1] : line;
        const parts = body.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="font-medium" style={{ color: "var(--p-text)" }}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        );

        if (numbered || bullet) {
          return (
            <div key={i} className="flex gap-3">
              <span className="mx-num w-5 shrink-0 text-right leading-7">{numbered ? `${numbered[1]}.` : "—"}</span>
              <span className="min-w-0 break-words">{parts}</span>
            </div>
          );
        }
        return <p key={i} className="break-words">{parts}</p>;
      })}
    </div>
  );
}

/* ——— Video Content ——— */
function VideoContent({ data }: { data: string }) {
  const { t } = useI18n();
  const isUrl = /^(https?:\/\/|www\.)/.test(data);
  if (!isUrl) return <TextContent data={data} />;

  const yt = data.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const embedUrl = yt ? `https://www.youtube.com/embed/${yt[1]}` : data;

  return (
    <div className="space-y-3">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", background: "var(--p-surface)" }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Tutorial"
        />
      </div>
      <a href={data} target="_blank" rel="noopener noreferrer" className="mx-link inline-flex items-center gap-1.5">
        {t("troubleshoot.openNewTab")}
        <ArrowUpRight />
      </a>
    </div>
  );
}

/* ——— Template Content ——— */
function TemplateContent({ data }: { data: string }) {
  const { t } = useI18n();
  return (
    <div style={{ border: "1px solid var(--p-border-strong)" }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid var(--p-border)" }}>
        <span className="mx-label">{t("troubleshoot.template")}</span>
        <CopyButton text={data} />
      </div>
      <pre
        className="px-4 py-3 text-[13px] font-mono leading-relaxed whitespace-pre-wrap break-words max-h-80 overflow-y-auto"
        style={{ color: "var(--p-text)" }}
      >
        {data}
      </pre>
    </div>
  );
}

function ContentRenderer({ solution }: { solution: Solution }) {
  return (
    <div className="space-y-5">
      {solution.content_type === "video" ? (
        <VideoContent data={solution.content_data} />
      ) : solution.content_type === "template" ? (
        <TemplateContent data={solution.content_data} />
      ) : (
        <TextContent data={solution.content_data} />
      )}
      <LinkButtons solution={solution} />
    </div>
  );
}

/* ——— Main: Solution Viewer ——— */
export function SolutionViewer() {
  const { t, locale } = useI18n();
  const { selectedIssue, selectedPlatform, goBack, reset } = useTroubleshoot();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState(0);

  useEffect(() => {
    if (!selectedIssue || !selectedPlatform) return;
    let cancelled = false;

    createClient()
      .from(getSolutionsTable(selectedPlatform.name))
      .select("id, issue_id, step_number, content_type, content_data, content_data_en, button_label, button_link, method_group")
      .eq("issue_id", selectedIssue.id)
      .order("method_group")
      .order("step_number")
      .then(({ data, error }) => {
        if (cancelled) return;
        setFetchError(error ? error.message : null);
        setSolutions(data || []);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIssue, selectedPlatform]);

  if (!selectedIssue || !selectedPlatform) return null;

  const groupMap = new Map<string, Solution[]>();
  for (const raw of solutions) {
    // Pakai versi Inggris jika tersedia, fallback ke Indonesia
    const s =
      locale === "en" && raw.content_data_en?.trim()
        ? { ...raw, content_data: raw.content_data_en }
        : raw;
    const group = s.method_group || "Cara 1";
    const key = locale === "en" ? group.replace(/^(metode|cara)\b/i, "Method") : group;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(s);
  }
  const methodGroups: MethodGroup[] = [...groupMap].map(([label, steps]) => ({ label, steps }));
  const currentGroup = methodGroups[Math.min(activeMethod, methodGroups.length - 1)] ?? null;
  const issueText = localizeIssue(selectedIssue, locale);

  return (
    <div className="ts-step-enter">
      <div className="flex items-center justify-between gap-4 mb-8">
        <button type="button" onClick={goBack} className="mx-link">← {t("troubleshoot.back")}</button>
        <button type="button" onClick={reset} className="mx-link mx-link-danger">{t("troubleshoot.reset")}</button>
      </div>

      <div className="mb-10">
        <p className="mx-label mb-2">
          {t("troubleshoot.step3of3")} · {selectedPlatform.name}
        </p>
        <h2 className="mx-title text-2xl sm:text-3xl break-words">{issueText.issue_name}</h2>
        {issueText.description && (
          <p className="text-sm mt-2 max-w-xl" style={{ color: "var(--p-muted)" }}>{issueText.description}</p>
        )}
      </div>

      {loading && (
        <div className="space-y-6">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 skeleton-premium" />
              <div className="h-16 w-full skeleton-premium" />
            </div>
          ))}
        </div>
      )}

      {fetchError && !loading && (
        <p className="mx-notice mx-notice-error">{t("troubleshoot.errorLoading")}: {fetchError}</p>
      )}

      {!loading && !fetchError && solutions.length === 0 && (
        <div className="mx-empty">
          <p>{t("troubleshoot.noSolution")}</p>
          <p className="text-xs mt-1">{t("troubleshoot.noSolutionDesc")}</p>
        </div>
      )}

      {!loading && methodGroups.length > 1 && (
        <div className="mx-tabs mb-10" role="tablist">
          {methodGroups.map((g, i) => (
            <button
              key={g.label}
              type="button"
              role="tab"
              aria-selected={currentGroup === g}
              onClick={() => setActiveMethod(i)}
              className={`mx-tab ${currentGroup === g ? "mx-tab-active" : ""}`}
            >
              {g.label}
              <span className="mx-num ml-2">{g.steps.length}</span>
            </button>
          ))}
        </div>
      )}

      {!loading && currentGroup && (
        <ol className="mx-list">
          {currentGroup.steps.map((solution, i) => (
            <li
              key={solution.id}
              className="grid grid-cols-[40px_1fr] sm:grid-cols-[72px_1fr] gap-x-4 py-8"
              style={{ borderBottom: "1px solid var(--p-border)" }}
            >
              <span className="mx-title text-2xl sm:text-3xl leading-none" style={{ color: "var(--p-faint)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="mx-label mb-4">
                  {t("troubleshoot.step")} {solution.step_number}
                </p>
                <ContentRenderer solution={solution} />
              </div>
            </li>
          ))}
        </ol>
      )}

      {!loading && solutions.length > 0 && (
        <p className="mx-label mt-8 text-center">{t("troubleshoot.endGuide")}</p>
      )}
    </div>
  );
}
