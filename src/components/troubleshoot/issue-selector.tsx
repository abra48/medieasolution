"use client";

import { useEffect, useState } from "react";
import { useTroubleshoot, type Issue } from "@/lib/troubleshoot-context";
import { createClient } from "@/lib/supabase/client";

export function IssueSelector() {
  const { selectedPlatform, selectIssue, goBack } = useTroubleshoot();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedPlatform) return;

    const fetchIssues = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("issues")
        .select("id, platform_id, issue_name, description")
        .eq("platform_id", selectedPlatform.id)
        .order("issue_name");

      if (!error && data) {
        setIssues(data);
      }
      setLoading(false);
    };

    fetchIssues();
  }, [selectedPlatform]);

  if (!selectedPlatform) return null;

  return (
    <div className="animate-slide-up">
      {/* Back Button + Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={goBack}
          className="w-10 h-10 flex items-center justify-center bg-bg-secondary border border-border-default
                     text-text-secondary hover:text-accent-green hover:border-accent-green
                     transition-all duration-200"
          style={{
            clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            Pilih Kendala
          </h2>
          <p className="text-sm text-text-secondary">
            <span className="text-accent-gold font-medium">{selectedPlatform.name}</span>
            {" — "}Pilih masalah yang Anda alami
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-bg-secondary border border-border-default animate-pulse"
              style={{
                clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
              }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && issues.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-bg-secondary border border-border-default"
            style={{
              clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
            }}
          >
            <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-text-secondary font-medium">Belum ada kendala untuk platform ini</p>
          <p className="text-sm text-text-tertiary mt-1">Kendala akan segera ditambahkan</p>
        </div>
      )}

      {/* Issues List */}
      {!loading && issues.length > 0 && (
        <div className="space-y-3">
          {issues.map((issue, index) => (
            <button
              key={issue.id}
              onClick={() => selectIssue(issue)}
              className="w-full group relative bg-bg-primary border border-border-default
                         transition-all duration-300 ease-out text-left
                         hover:border-accent-green
                         hover:shadow-[0_0_16px_rgba(57,255,20,0.08)]
                         active:scale-[0.99]"
              style={{
                clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
                animationDelay: `${index * 60}ms`,
              }}
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-border-default group-hover:bg-accent-green transition-colors duration-300" />

              <div className="flex items-center gap-4 px-5 py-4 pl-6">
                {/* Issue Number */}
                <div
                  className="w-10 h-10 shrink-0 flex items-center justify-center bg-bg-secondary
                             border border-border-default text-text-tertiary text-sm font-bold
                             group-hover:bg-accent-green/10 group-hover:border-accent-green/30 group-hover:text-accent-green
                             transition-all duration-300"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Issue Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-accent-green transition-colors duration-300">
                    {issue.issue_name}
                  </p>
                  {issue.description && (
                    <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">
                      {issue.description}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 text-text-tertiary group-hover:text-accent-green group-hover:translate-x-1 transition-all duration-300 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
