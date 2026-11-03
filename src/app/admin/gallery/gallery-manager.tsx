"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { setLandingStepImage } from "@/app/actions/admin";

const BUCKET = "media";
const FOLDER = "gallery";
const MAX_SIZE = 5 * 1024 * 1024;

type MediaFile = { name: string; path: string; url: string; size: number };

function publicUrl(path: string) {
  return createClient().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function listMedia(): Promise<MediaFile[]> {
  const { data, error } = await createClient()
    .storage.from(BUCKET)
    .list(FOLDER, { limit: 500, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw error;
  return (data ?? [])
    .filter((f) => f.id && !f.name.startsWith("."))
    .map((f) => {
      const path = `${FOLDER}/${f.name}`;
      return { name: f.name, path, url: publicUrl(path), size: Number(f.metadata?.size ?? 0) };
    });
}

function safeFileName(file: File) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${Date.now()}-${base || "image"}.${ext}`;
}

function formatSize(bytes: number) {
  if (!bytes) return "";
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export function GalleryManager({
  initialStepImages,
  canEdit,
  stepCount,
}: {
  initialStepImages: Record<number, string>;
  canEdit: boolean;
  stepCount: number;
}) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [stepImages, setStepImages] = useState(initialStepImages);
  const [pickingStep, setPickingStep] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      setFiles(await listMedia());
    } catch (e) {
      setNotice({ type: "error", text: `Gagal memuat galeri: ${(e as Error).message}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    listMedia()
      .then((list) => !cancelled && setFiles(list))
      .catch((e) => !cancelled && setNotice({ type: "error", text: `Gagal memuat galeri: ${(e as Error).message}` }))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  async function uploadFiles(list: FileList | null): Promise<string[]> {
    if (!list || list.length === 0) return [];
    setUploading(true);
    setNotice(null);
    const supabase = createClient();
    const uploaded: string[] = [];
    const failed: string[] = [];

    for (const file of Array.from(list)) {
      if (!file.type.startsWith("image/")) {
        failed.push(`${file.name} (bukan gambar)`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        failed.push(`${file.name} (lebih dari 5 MB)`);
        continue;
      }
      const path = `${FOLDER}/${safeFileName(file)}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
      if (error) failed.push(`${file.name} (${error.message})`);
      else uploaded.push(publicUrl(path));
    }

    setUploading(false);
    await refresh();
    setNotice(
      failed.length
        ? { type: "error", text: `Gagal upload: ${failed.join(", ")}` }
        : { type: "ok", text: `${uploaded.length} foto berhasil diupload.` }
    );
    return uploaded;
  }

  async function deleteFile(file: MediaFile) {
    const usedBy = Object.entries(stepImages).find(([, url]) => url === file.url)?.[0];
    const warning = usedBy ? `\n\nFoto ini dipakai di langkah ${usedBy} dan akan dilepas dari langkah tersebut.` : "";
    if (!window.confirm(`Hapus "${file.name}" dari galeri?${warning}`)) return;

    const { error } = await createClient().storage.from(BUCKET).remove([file.path]);
    if (error) {
      setNotice({ type: "error", text: `Gagal menghapus: ${error.message}` });
      return;
    }
    if (usedBy) await assignStep(Number(usedBy), null);
    await refresh();
    setNotice({ type: "ok", text: "Foto dihapus." });
  }

  async function assignStep(step: number, url: string | null) {
    const result = await setLandingStepImage(step, url);
    if (result?.error) {
      setNotice({ type: "error", text: result.error });
      return;
    }
    setStepImages((prev) => {
      const next = { ...prev };
      if (url) next[step] = url;
      else delete next[step];
      return next;
    });
    setPickingStep(null);
    setNotice({ type: "ok", text: result?.message ?? "Tersimpan." });
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt("Salin URL:", url);
    }
  }

  return (
    <div className="space-y-12">
      {notice && (
        <p className={`mx-notice ${notice.type === "error" ? "mx-notice-error" : ""}`} role="status">
          {notice.text}
        </p>
      )}

      {/* ——— Landing step photos ——— */}
      <section>
        <div className="mx-section-head">
          <div>
            <p className="mx-label">Halaman depan</p>
            <h2 className="mx-subtitle">Foto langkah &ldquo;Cara Kerja&rdquo;</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 mx-grid">
          {Array.from({ length: stepCount }, (_, i) => i + 1).map((step) => {
            const url = stepImages[step];
            const picking = pickingStep === step;
            return (
              <div key={step} className={`mx-cell ${picking ? "mx-cell-active" : ""}`}>
                <div className="mx-thumb">
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={`Foto langkah ${step}`} />
                  ) : (
                    <span className="mx-thumb-empty">{String(step).padStart(2, "0")}</span>
                  )}
                </div>
                <p className="mx-num mt-3">Langkah {String(step).padStart(2, "0")}</p>
                {canEdit && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <button type="button" className="mx-link" onClick={() => setPickingStep(picking ? null : step)}>
                      {picking ? "Batal" : url ? "Ganti" : "Pilih foto"}
                    </button>
                    {url && (
                      <button type="button" className="mx-link mx-link-danger" onClick={() => assignStep(step, null)}>
                        Lepas
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {pickingStep && (
          <p className="text-xs mt-3" style={{ color: "var(--p-muted)" }}>
            Klik salah satu foto di galeri di bawah untuk dipakai di langkah {String(pickingStep).padStart(2, "0")}, atau upload foto baru.
          </p>
        )}
      </section>

      {/* ——— Gallery ——— */}
      <section>
        <div className="mx-section-head">
          <div>
            <p className="mx-label">Semua foto</p>
            <h2 className="mx-subtitle">
              Galeri <span className="mx-num">{files.length}</span>
            </h2>
          </div>
          {canEdit && (
            <>
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={async (e) => {
                  const urls = await uploadFiles(e.target.files);
                  e.target.value = "";
                  if (pickingStep && urls[0]) await assignStep(pickingStep, urls[0]);
                }}
              />
              <button type="button" className="mx-btn" disabled={uploading} onClick={() => uploadRef.current?.click()}>
                {uploading ? "Mengupload…" : "Upload foto"}
              </button>
            </>
          )}
        </div>

        {loading ? (
          <p className="mx-empty">Memuat galeri…</p>
        ) : files.length === 0 ? (
          <p className="mx-empty">Belum ada foto. Upload foto JPG, PNG, atau WebP (maks. 5 MB).</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mx-grid">
            {files.map((file) => {
              const usedBy = Object.entries(stepImages).find(([, url]) => url === file.url)?.[0];
              return (
                <div key={file.path} className="mx-cell">
                  <button
                    type="button"
                    className={`mx-thumb ${pickingStep ? "mx-thumb-pickable" : ""}`}
                    onClick={() => pickingStep && assignStep(pickingStep, file.url)}
                    disabled={!pickingStep}
                    aria-label={pickingStep ? `Pakai ${file.name} untuk langkah ${pickingStep}` : file.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={file.url} alt={file.name} loading="lazy" />
                  </button>
                  <p className="text-xs truncate mt-3" style={{ color: "var(--p-text)" }} title={file.name}>
                    {file.name.replace(/^\d+-/, "")}
                  </p>
                  <p className="mx-num">
                    {formatSize(file.size)}
                    {usedBy && ` · Langkah ${String(usedBy).padStart(2, "0")}`}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <button type="button" className="mx-link" onClick={() => copyUrl(file.url)}>
                      {copied === file.url ? "Tersalin" : "Salin URL"}
                    </button>
                    {canEdit && (
                      <button type="button" className="mx-link mx-link-danger" onClick={() => deleteFile(file)}>
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
