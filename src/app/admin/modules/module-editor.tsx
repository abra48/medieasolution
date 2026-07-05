"use client";

import { useActionState, useState } from "react";
import { createModule, updateModule, deleteModule, type ModuleActionState } from "@/app/actions/modules";

type Module = {
  id: string;
  title: string;
  description: string | null;
  content: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export function ModuleEditor({ modules }: { modules: Module[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createState, createAction, createPending] = useActionState<ModuleActionState, FormData>(
    createModule, null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const editingModule = editingId ? modules.find((m) => m.id === editingId) : null;

  const handleDelete = async (id: string) => {
    await deleteModule(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Create / Edit Form */}
      <div
        className="bg-bg-secondary border border-border-default"
        style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
      >
        <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
          <div
            className="w-7 h-7 flex items-center justify-center bg-secondary/15 text-secondary"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {editingId ? "Edit Modul" : "Tambah Modul Baru"}
            </h3>
            <p className="text-[10px] text-text-tertiary">
              {editingId ? "Perbarui konten modul pembelajaran" : "Buat modul pembelajaran baru"}
            </p>
          </div>
          {editingId && (
            <button
              onClick={() => setEditingId(null)}
              className="ml-auto text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              ✕ Batal edit
            </button>
          )}
        </div>

        <div className="p-5">
          <form
            action={editingId
              ? async (formData: FormData) => { await updateModule(editingId, formData); setEditingId(null); }
              : createAction
            }
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                  Judul *
                </label>
                <input
                  name="title"
                  type="text"
                  defaultValue={editingModule?.title || ""}
                  required
                  className="input !py-2"
                  placeholder="Keamanan Akun Digital"
                  key={editingId || "new"}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                  Urutan
                </label>
                <input
                  name="sort_order"
                  type="number"
                  min={0}
                  defaultValue={editingModule?.sort_order ?? 0}
                  className="input !py-2 text-center font-mono"
                  key={`sort-${editingId || "new"}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                Deskripsi
              </label>
              <input
                name="description"
                type="text"
                defaultValue={editingModule?.description || ""}
                className="input !py-2"
                placeholder="Deskripsi singkat modul..."
                key={`desc-${editingId || "new"}`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                Konten
              </label>
              <textarea
                name="content"
                rows={6}
                defaultValue={editingModule?.content || ""}
                className="input !py-2 resize-y"
                placeholder="Tulis konten modul lengkap di sini..."
                key={`cnt-${editingId || "new"}`}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                  Status
                </label>
                <select
                  name="is_published"
                  defaultValue={editingModule?.is_published ? "true" : "false"}
                  className="input !py-1.5 !px-3 !w-auto text-xs"
                  key={`pub-${editingId || "new"}`}
                >
                  <option value="false">Draft</option>
                  <option value="true">Published</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={createPending}
                className="btn-primary !py-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createPending ? "Menyimpan..." : editingId ? "Perbarui Modul" : "Simpan Modul"}
              </button>
            </div>
          </form>

          {createState?.error && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-danger/10 border border-danger/20 text-xs text-danger rounded-md">
              {createState.error}
            </div>
          )}
          {createState?.success && !editingId && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-accent/10 border border-accent/20 text-xs text-accent rounded-md">
              {createState.message}
            </div>
          )}
        </div>
      </div>

      {/* Modules Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">Daftar Modul</h2>
          <span className="text-xs text-text-tertiary">{modules.length} modul</span>
        </div>

        <div
          className="border border-border-default overflow-hidden"
          style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary border-b border-border-default">
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Urutan</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Judul</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Deskripsi</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {modules.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-text-tertiary text-sm">Belum ada modul.</td></tr>
                )}
                {modules.map((mod) => (
                  <tr key={mod.id} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-bold text-text-tertiary bg-bg-secondary border border-border-default"
                        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                        {mod.sort_order}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold text-text-primary">{mod.title}</td>
                    <td className="px-4 py-2.5 text-xs text-text-tertiary truncate max-w-[250px] hidden sm:table-cell">
                      {mod.description || "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          mod.is_published ? "bg-accent/10 text-accent" : "bg-bg-tertiary text-text-tertiary"
                        }`}
                        style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${mod.is_published ? "bg-accent" : "bg-text-tertiary"}`} />
                        {mod.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(mod.id)}
                          className="text-[10px] font-semibold text-accent hover:text-accent-hover transition-colors uppercase tracking-wider"
                        >
                          Edit
                        </button>
                        {deleteConfirm === mod.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(mod.id)}
                              className="text-[10px] font-semibold text-danger hover:text-danger/80 transition-colors uppercase tracking-wider"
                            >
                              Ya
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-[10px] font-semibold text-text-tertiary hover:text-text-primary transition-colors uppercase tracking-wider"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(mod.id)}
                            className="text-[10px] font-semibold text-text-tertiary hover:text-danger transition-colors uppercase tracking-wider"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
