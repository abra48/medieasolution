import { ArticlesGrid } from "@/components/articles-grid";
import { ArticlesHeader } from "@/components/portal-headers";

export default function ArticlesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <ArticlesHeader />
      <ArticlesGrid />
    </div>
  );
}
