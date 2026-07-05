"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex items-center justify-center min-h-[300px] p-6">
          <div
            className="bg-bg-primary border border-border-default max-w-md w-full"
            style={{
              clipPath: "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)",
            }}
          >
            {/* Top accent */}
            <div className="h-[2px] bg-[#EF4444]" />

            {/* 3D inset */}
            <div className="relative">
              <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{ boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.02)" }}
              />

              <div className="p-6 space-y-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 flex items-center justify-center bg-[#EF4444]/10 text-danger mx-auto"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-text-primary text-center">
                  Terjadi Kesalahan Sistem
                </h3>

                {/* Description */}
                <p className="text-xs text-text-tertiary text-center leading-relaxed">
                  Komponen ini mengalami kegagalan eksekusi. Muat ulang halaman untuk melanjutkan.
                </p>

                {/* Error detail */}
                {this.state.error && (
                  <div
                    className="bg-bg-input border border-border-default px-3 py-2 text-[10px] font-mono text-text-tertiary truncate"
                    style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                  >
                    {this.state.error.message}
                  </div>
                )}

                {/* Retry */}
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.reload();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold
                             bg-bg-secondary border border-border-default text-text-primary
                             hover:bg-bg-tertiary transition-all duration-200"
                  style={{ clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Muat Ulang Halaman
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Inline error display for forms and data fetching */
export function SystemAlert({
  type,
  message,
}: {
  type: "error" | "success" | "warning" | "info";
  message: string;
}) {
  const config = {
    error: { bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/20", text: "text-danger", label: "Kesalahan" },
    success: { bg: "bg-accent-green/10", border: "border-accent-green/20", text: "text-accent-green", label: "Berhasil" },
    warning: { bg: "bg-accent-gold/10", border: "border-accent-gold/20", text: "text-accent-gold", label: "Peringatan" },
    info: { bg: "bg-bg-tertiary", border: "border-border-default", text: "text-text-secondary", label: "Informasi" },
  }[type];

  return (
    <div
      className={`flex items-start gap-2.5 px-3 py-2.5 ${config.bg} border ${config.border}`}
      style={{ clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)" }}
    >
      <span
        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-px shrink-0 mt-0.5 ${config.bg} ${config.text}`}
        style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }}
      >
        {config.label}
      </span>
      <p className={`text-xs ${config.text} leading-relaxed`}>{message}</p>
    </div>
  );
}

/** Empty state display */
export function EmptyState({ message, icon }: { message: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div
        className="w-14 h-14 flex items-center justify-center bg-bg-secondary border border-border-default text-text-tertiary"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
      >
        {icon || (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <p className="text-sm text-text-tertiary text-center max-w-xs">{message}</p>
    </div>
  );
}
