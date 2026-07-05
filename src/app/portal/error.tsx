"use client";

import { useEffect } from "react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Portal Error]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="card max-w-sm w-full text-center !p-8">
        <h2 className="text-base font-bold text-text-primary mb-2">Failed to load</h2>
        <p className="text-xs text-text-tertiary mb-1">An error occurred while processing your request.</p>
        {error.digest && (
          <p className="text-[10px] font-mono text-text-tertiary mb-4">Ref: {error.digest}</p>
        )}
        <button onClick={reset} className="btn-primary !py-2 !px-5 !text-xs">
          Try again
        </button>
      </div>
    </div>
  );
}
