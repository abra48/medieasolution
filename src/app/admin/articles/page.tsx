import { createClient } from "@/lib/supabase/server";
import { ArticleEditor } from "./article-editor";

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, excerpt, content, category, is_published, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const allArticles = articles || [];
  const publishedCount = allArticles.filter((a) => a.is_published).length;
  const draftCount = allArticles.length - publishedCount;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Manajemen <span className="text-gradient-green">Artikel</span>
        </h1>
        <p className="text-sm text-text-secondary">
          Buat dan kelola artikel untuk information center di portal pengguna.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Artikel", value: allArticles.length, color: "text-text-primary", bg: "bg-bg-secondary" },
          { label: "Published", value: publishedCount, color: "text-accent", bg: "bg-accent/5" },
          { label: "Draft", value: draftCount, color: "text-text-tertiary", bg: "bg-bg-secondary" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border border-border-default px-4 py-3`}
            style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
          >
            <p className={`text-2xl font-bold ${stat.color} font-mono`}>{stat.value}</p>
            <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <ArticleEditor articles={allArticles} />
    </div>
  );
}
