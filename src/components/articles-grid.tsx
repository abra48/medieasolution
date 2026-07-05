import { createClient } from "@/lib/supabase/server";

type Asset = {
  id: string;
  asset_type: string;
  title: string | null;
  description: string | null;
  content: string;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
};

export async function ArticlesGrid() {
  const supabase = await createClient();

  const { data: assets } = await supabase
    .from("assets")
    .select("id, asset_type, title, description, content, image_url, link_url, is_active, created_at")
    .in("asset_type", ["article", "service"])
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(12);

  const articles = (assets || []).filter((a: Asset) => a.asset_type === "article");
  const services = (assets || []).filter((a: Asset) => a.asset_type === "service");

  if (articles.length === 0 && services.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center bg-accent-green/15 text-accent-green"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Pusat Informasi</h3>
          <p className="text-sm text-text-secondary">
            Artikel, panduan, dan layanan terkait pemulihan akun.
          </p>
        </div>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-1.5 h-1.5 bg-accent-green"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            />
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Artikel
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article: Asset) => (
              <AssetCard key={article.id} asset={article} accent="green" />
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      {services.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-1.5 h-1.5 bg-accent-gold"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            />
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              Layanan
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service: Asset) => (
              <AssetCard key={service.id} asset={service} accent="gold" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ——— Asset Card ——— */
function AssetCard({ asset, accent }: { asset: Asset; accent: "green" | "gold" }) {
  const accentColor = accent === "green" ? "var(--accent-green)" : "var(--accent-gold)";
  const accentClass = accent === "green" ? "accent-green" : "accent-gold";

  const Wrapper = asset.link_url ? "a" : "div";
  const linkProps = asset.link_url
    ? { href: asset.link_url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...linkProps}
      className="group relative bg-bg-primary border border-border-default
                 transition-all duration-300
                 hover:shadow-[0_0_20px_rgba(57,255,20,0.06),0_4px_16px_rgba(0,0,0,0.25)]
                 active:scale-[0.98]"
      style={{
        clipPath: "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ background: accentColor }}
      />

      {/* 3D inset */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.02)",
        }}
      />

      {/* Image placeholder */}
      {asset.image_url && (
        <div
          className="w-full h-32 bg-bg-secondary overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
          }}
        >
          <img
            src={asset.image_url}
            alt={asset.title || ""}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      )}

      <div className="p-4 space-y-2">
        {/* Type badge */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider
            bg-${accentClass}/10 text-${accentClass}`}
          style={{
            clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)",
          }}
        >
          {asset.asset_type === "article" ? "Artikel" : "Layanan"}
        </div>

        {/* Title */}
        <h5
          className={`text-sm font-semibold text-text-primary group-hover:text-${accentClass} transition-colors duration-300 line-clamp-2`}
        >
          {asset.title || "Untitled"}
        </h5>

        {/* Description */}
        {(asset.description || asset.content) && (
          <p className="text-xs text-text-tertiary line-clamp-3 leading-relaxed">
            {asset.description || asset.content.substring(0, 120)}
          </p>
        )}

        {/* Date */}
        <p className="text-[10px] text-text-tertiary/60 font-mono">
          {new Date(asset.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Link indicator */}
      {asset.link_url && (
        <div
          className="absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center
                     text-text-tertiary group-hover:text-accent-green transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      )}
    </Wrapper>
  );
}
