"use client";

import { useEffect, useState } from "react";
import { useTroubleshoot } from "@/lib/troubleshoot-context";
import { createClient } from "@/lib/supabase/client";

type Issue = {
  id: string;
  platform_id: string;
  issue_name: string;
  description: string | null;
  status: string;
};

export function IssueSelector() {
  const { currentStep, selectedPlatform, selectIssue, goBack } = useTroubleshoot();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentStep !== "issue" || !selectedPlatform) return;

    const fetchIssues = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("issues")
        .select("id, platform_id, issue_name, description, status")
        .eq("platform_id", selectedPlatform.id)
        .eq("status", "active")
        .order("issue_name");

      setIssues(data || []);
      setLoading(false);
    };

    fetchIssues();
  }, [currentStep, selectedPlatform]);

  if (currentStep !== "issue" || !selectedPlatform) return null;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={goBack}
          className="w-7 h-7 rounded-md flex items-center justify-center bg-bg-secondary border border-border-default text-text-tertiary hover:text-text-primary transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="text-xs text-text-tertiary">
            <span className="text-accent font-medium">{selectedPlatform.name}</span> — Select issue
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-skeleton" />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="card text-center !py-10">
          <p className="text-sm text-text-secondary">No issues found for this platform.</p>
          <p className="text-xs text-text-tertiary mt-1">Check back later.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {issues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => selectIssue(issue)}
              className="w-full text-left px-4 py-3 rounded-lg border border-border-default bg-bg-secondary hover:border-accent/40 transition-colors group"
            >
              <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                {issue.issue_name}
              </p>
              {issue.description && (
                <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">
                  {issue.description}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
