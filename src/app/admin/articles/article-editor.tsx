"use client";

import { useActionState, useState } from "react";
import { createArticle, updateArticle, deleteArticle, type ArticleActionState } from "@/app/actions/articles";

type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export function ArticleEditor({ articles }: { articles: Article[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createState, createAction, createPending] = useActionState<ArticleActionState, FormData>(
    createArticle, null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const editingArticle = editingId ? articles.find((a) => a.id === editingId) : null;

  const handleDelete = async (id: string) => {
    await deleteArticle(id);
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
            className="w-7 h-7 flex items-center justify-center bg-accent/15 text-accent"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {editingId ? "Edit Artikel" : "Tambah Artikel Baru"}
            </h3>
            <p className="text-[10px] text-text-tertiary">
              {editingId ? "Perbarui konten artikel" : "Buat artikel baru untuk information center"}
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
              ? async (formData: FormData) => { await updateArticle(editingId, formData); setEditingId(null); }
              : createAction
            }
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                  Judul *
                </label>
                <input
                  name="title"
                  type="text"
                  defaultValue={editingArticle?.title || ""}
                  required
                  className="input !py-2"
                  placeholder="Cara Mengamankan Akun Instagram"
                  key={editingId || "new"}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                  Kategori
                </label>
                <input
                  name="category"
                  type="text"
                  defaultValue={editingArticle?.category || ""}
                  className="input !py-2"
                  placeholder="Security, Recovery, Tips"
                  key={`cat-${editingId || "new"}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                Ringkasan (Excerpt)
              </label>
              <input
                name="excerpt"
                type="text"
                defaultValue={editingArticle?.excerpt || ""}
                className="input !py-2"
                placeholder="Deskripsi singkat untuk preview card..."
                key={`exc-${editingId || "new"}`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                Konten *
              </label>
              <textarea
                name="content"
                rows={6}
                defaultValue={editingArticle?.content || ""}
                required
                className="input !py-2 resize-y"
                placeholder="Tulis konten artikel lengkap di sini..."
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
                  defaultValue={editingArticle?.is_published ? "true" : "false"}
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
                {createPending ? "Menyimpan..." : editingId ? "Perbarui Artikel" : "Simpan Artikel"}
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

      {/* Articles Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">Daftar Artikel</h2>
          <span className="text-xs text-text-tertiary">{articles.length} artikel</span>
        </div>

        <div
          className="border border-border-default overflow-hidden"
          style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary border-b border-border-default">
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Judul</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Kategori</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">Tanggal</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {articles.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-text-tertiary text-sm">Belum ada artikel.</td></tr>
                )}
                {articles.map((article) => (
                  <tr key={article.id} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <p className="text-sm font-medium text-text-primary truncate max-w-[250px]">{article.title}</p>
                      {article.excerpt && (
                        <p className="text-[10px] text-text-tertiary truncate max-w-[250px]">{article.excerpt}</p>
                      )}
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      {article.category ? (
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">{article.category}</span>
                      ) : (
                        <span className="text-xs text-text-tertiary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          article.is_published ? "bg-accent/10 text-accent" : "bg-bg-tertiary text-text-tertiary"
                        }`}
                        style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${article.is_published ? "bg-accent" : "bg-text-tertiary"}`} />
                        {article.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <span className="text-xs text-text-tertiary">
                        {new Date(article.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(article.id)}
                          className="text-[10px] font-semibold text-accent hover:text-accent-hover transition-colors uppercase tracking-wider"
                        >
                          Edit
                        </button>
                        {deleteConfirm === article.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="text-[10px] font-semibold text-danger hover:text-danger/80 transition-colors uppercase tracking-wider"
                            >
                              Ya, Hapus
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
                            onClick={() => setDeleteConfirm(article.id)}
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
