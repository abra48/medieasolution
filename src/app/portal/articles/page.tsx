import { ArticlesGrid } from "@/components/articles-grid";

export default function ArticlesPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Pusat <span className="text-gradient-green">Informasi</span>
        </h1>
        <p className="text-text-secondary">
          Artikel, panduan, dan layanan terkait pemulihan akun media sosial.
        </p>
      </div>

      {/* Articles & Services Grid */}
      <ArticlesGrid />

      {/* Empty state fallback */}
      <div id="articles-empty-fallback">
        <noscript>
          <p className="text-sm text-text-tertiary text-center py-8">
            Konten memerlukan JavaScript untuk dimuat.
          </p>
        </noscript>
      </div>
    </div>
  );
}
