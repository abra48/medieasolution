"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="card max-w-sm w-full text-center !p-8">
        <h2 className="text-base font-bold text-text-primary mb-2">Something went wrong</h2>
        <p className="text-xs text-text-tertiary mb-4">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={reset} className="btn-primary !py-2 !px-4 !text-xs">
            Try again
          </button>
          <a href="/admin" className="btn-secondary !py-2 !px-4 !text-xs">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
