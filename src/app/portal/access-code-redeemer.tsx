"use client";

import { useActionState } from "react";
import { redeemAccessCode, type AccessCodeState } from "@/app/actions/codes";

export function AccessCodeRedeemer() {
  const [state, action, pending] = useActionState<AccessCodeState, FormData>(
    redeemAccessCode,
    null
  );

  if (state?.success) {
    return (
      <div className="card !border-accent/20 !bg-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          <div>
            <p className="text-sm font-medium text-accent">{state.message}</p>
            <p className="text-xs text-text-tertiary mt-0.5">Refresh to access premium guides.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card !p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-1">Enter Access Code</h3>
      <p className="text-xs text-text-tertiary mb-4">Unlock premium recovery guides.</p>

      <form action={action} className="space-y-3">
        {state?.error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-danger/10 border border-danger/20">
            <span className="text-xs text-danger">{state.error}</span>
          </div>
        )}

        <div className="flex gap-2">
          <input
            name="code"
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            maxLength={20}
            autoComplete="off"
            className="input flex-1 font-mono tracking-widest uppercase text-center"
          />
          <button type="submit" disabled={pending} className="btn-accent-secondary !px-5 shrink-0 disabled:opacity-50">
            {pending ? "..." : "Redeem"}
          </button>
        </div>
      </form>
    </div>
  );
}
