import { createClient } from "@/lib/supabase/server";

export default async function ModulesPage() {
  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("id, title, description, content, sort_order, is_published")
    .eq("is_published", true)
    .order("sort_order");

  const publishedModules = modules || [];
  const hasModules = publishedModules.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary mb-1">Learning Modules</h1>
        <p className="text-sm text-text-tertiary">Educational materials for digital account security.</p>
      </div>

      {!hasModules && (
        <div className="card text-center !py-10">
          <p className="text-xs font-medium text-secondary uppercase tracking-widest mb-2">Coming Soon</p>
          <h2 className="text-base font-bold text-text-primary mb-2">Modules are in development</h2>
          <p className="text-xs text-text-tertiary max-w-md mx-auto">
            Educational content covering digital security, verification procedures, and prevention techniques. Separate from the account recovery service.
          </p>
        </div>
      )}

      {hasModules && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {publishedModules.map((mod, i) => (
            <div key={mod.id} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-text-tertiary">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[9px] font-medium text-accent uppercase tracking-wider px-1.5 py-0.5 bg-accent/10 rounded">
                  Available
                </span>
              </div>
              <h4 className="text-sm font-medium text-text-primary mb-1">{mod.title}</h4>
              {mod.description && (
                <p className="text-xs text-text-tertiary leading-relaxed">{mod.description}</p>
              )}
              {mod.content && (
                <div className="mt-3 pt-3 border-t border-border-subtle">
                  <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                    {mod.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
