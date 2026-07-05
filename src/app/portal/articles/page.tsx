import { ArticlesGrid } from "@/components/articles-grid";

export default function ArticlesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary mb-1">Information Center</h1>
        <p className="text-sm text-text-tertiary">Articles, guides, and services for social media account recovery.</p>
      </div>

      <ArticlesGrid />
    </div>
  );
}
