"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  is_published: boolean;
  created_at: string;
};

export function ArticlesGrid() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("articles")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        setArticles(data || []);
      } catch {
        // Table may not exist
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-skeleton" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="card text-center !py-12">
        <p className="text-sm text-text-secondary">No articles published yet.</p>
        <p className="text-xs text-text-tertiary mt-1">Check back soon for updates.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {articles.map((article) => (
        <div key={article.id} className="card">
          {article.category && (
            <span className="text-[9px] font-medium text-accent uppercase tracking-wider">{article.category}</span>
          )}
          <h3 className="text-sm font-semibold text-text-primary mt-1 mb-1">{article.title}</h3>
          <p className="text-xs text-text-tertiary leading-relaxed line-clamp-2">
            {article.excerpt || article.content.substring(0, 120)}
          </p>
          <p className="text-[10px] text-text-tertiary mt-2">
            {new Date(article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      ))}
    </div>
  );
}
