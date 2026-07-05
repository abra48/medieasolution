"use client";

import { useActionState } from "react";
import { createPlatform, type ActionResult } from "@/app/actions/admin";

export function PlatformForm() {
  const [state, action, pending] = useActionState<ActionResult, FormData>(createPlatform, null);

  return (
    <div
      className="bg-bg-secondary border border-border-default"
      style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
    >
      <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
        <div className="w-7 h-7 flex items-center justify-center bg-accent-green/15 text-accent-green"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-text-primary">Tambah Platform</h3>
      </div>

      <form action={action} className="p-5 space-y-4">
        {state?.error && (
          <div className="px-3 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs text-danger"
            style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
          >{state.error}</div>
        )}
        {state?.success && (
          <div className="px-3 py-2 bg-accent-green/10 border border-accent-green/20 text-xs text-accent-green"
            style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
          >{state.message}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Nama Platform *</label>
            <input name="name" required placeholder="e.g., Facebook" className="input !py-2 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Icon URL</label>
            <input name="icon_url" placeholder="https://..." className="input !py-2 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Status</label>
            <select name="status" defaultValue="active" className="input !py-2 text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={pending} className="btn-primary !py-2 text-sm disabled:opacity-50">
          {pending ? "Menyimpan..." : "Simpan Platform"}
        </button>
      </form>
    </div>
  );
}
