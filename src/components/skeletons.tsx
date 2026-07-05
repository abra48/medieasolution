/**
 * 3D Skeleton Loaders — "Tech Pro" aesthetic
 * Sharp-edged, symmetrical loading placeholders with neon pulse animation.
 */

export function SkeletonCard() {
  return (
    <div
      className="bg-bg-primary border border-border-default animate-pulse"
      style={{
        clipPath: "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-15"
        style={{ boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.02)" }}
      />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 bg-skeleton"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-skeleton w-2/3" style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }} />
            <div className="h-2 bg-skeleton w-1/2" style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-skeleton w-full" style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }} />
          <div className="h-2 bg-skeleton w-4/5" style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div
      className="border border-border-default overflow-hidden"
      style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
    >
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-default px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-2 bg-skeleton flex-1"
            style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, ri) => (
        <div key={ri} className="px-4 py-3 border-b border-border-subtle flex gap-4 animate-pulse"
          style={{ animationDelay: `${ri * 80}ms` }}
        >
          {Array.from({ length: cols }).map((_, ci) => (
            <div key={ci} className="h-2.5 bg-skeleton flex-1"
              style={{
                width: ci === 0 ? "20%" : undefined,
                clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonSteps({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-primary border border-border-default animate-pulse"
          style={{
            clipPath: "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)",
            animationDelay: `${i * 120}ms`,
          }}
        >
          <div className="p-5 flex gap-4">
            {/* Step number */}
            <div className="w-10 h-10 shrink-0 bg-skeleton"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 bg-skeleton w-1/3"
                style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }}
              />
              <div className="h-2 bg-skeleton w-full"
                style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }}
              />
              <div className="h-2 bg-skeleton w-4/5"
                style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 3 }: { count?: number }) {
  return (
    <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-secondary border border-border-default px-4 py-3 animate-pulse"
          style={{
            clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
            animationDelay: `${i * 100}ms`,
          }}
        >
          <div className="h-6 bg-skeleton w-12 mb-1"
            style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }}
          />
          <div className="h-2 bg-skeleton w-16"
            style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }}
          />
        </div>
      ))}
    </div>
  );
}
