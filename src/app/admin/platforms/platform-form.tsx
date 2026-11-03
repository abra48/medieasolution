"use client";

import { useActionState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPlatform, type ActionResult } from "@/app/actions/admin";

export function PlatformForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionResult, FormData>(async (prev, formData) => {
    const result = await createPlatform(prev, formData);
    if (result?.success) {
      formRef.current?.reset();
      router.refresh();
    }
    return result;
  }, null);

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {state?.error && <p className="mx-notice mx-notice-error">{state.error}</p>}
      {state?.success && <p className="mx-notice">{state.message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="mx-field-label" htmlFor="platform-name">Nama platform *</label>
          <input id="platform-name" name="name" required placeholder="Facebook" className="mx-input" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor="platform-icon">Icon URL</label>
          <input id="platform-icon" name="icon_url" placeholder="https://…" className="mx-input font-mono" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor="platform-status">Status</label>
          <select id="platform-status" name="status" defaultValue="active" className="mx-input">
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      <button type="submit" disabled={pending} className="mx-btn mx-btn-solid">
        {pending ? "Menyimpan…" : "Tambah platform"}
      </button>
    </form>
  );
}
