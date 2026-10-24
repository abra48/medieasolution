import { createClient } from "@/lib/supabase/server";
import { CodeGenerator } from "./code-generator";

export default async function AdminCodesPage() {
  const supabase = await createClient();

  const { data: codes } = await supabase
    .from("access_codes")
    .select("id, code, is_used, used_by, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const allCodes = codes || [];
  const totalCodes = allCodes.length;
  const usedCodes = allCodes.filter((c) => c.is_used).length;
  const availableCodes = totalCodes - usedCodes;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Manajemen <span className="text-gradient-gold">Kode Akses</span>
        </h1>
        <p className="text-sm text-text-secondary">
          Buat dan kelola kode akses untuk pengguna. Setiap kode berlaku 1x pakai.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Kode", value: totalCodes, color: "text-text-primary", bg: "bg-bg-secondary" },
          { label: "Tersedia", value: availableCodes, color: "text-accent-green", bg: "bg-accent-green/5" },
          { label: "Terpakai", value: usedCodes, color: "text-accent-gold", bg: "bg-accent-gold/5" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border border-border-default px-4 py-3`}
            style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
          >
            <p className={`text-2xl font-bold ${stat.color} font-mono`}>{stat.value}</p>
            <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Generator */}
      <CodeGenerator />

      {/* Data Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">Registrasi Kode</h2>
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-accent-green" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
              Tersedia
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-accent-gold" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
              Terpakai (1x Pakai)
            </span>
          </div>
        </div>

        <div
          className="border border-border-default overflow-hidden"
          style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary border-b border-border-default">
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">#</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Kode Akses</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Digunakan Oleh</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">Tanggal Dibuat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {totalCodes === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-text-tertiary text-sm">
                      Belum ada kode akses. Gunakan generator di atas untuk membuat kode baru.
                    </td>
                  </tr>
                )}
                {allCodes.map((code, index) => (
                  <tr key={code.id} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                    <td className="px-4 py-2.5 text-xs text-text-tertiary font-mono">{String(index + 1).padStart(3, "0")}</td>
                    <td className="px-4 py-2.5">
                      <code className="text-sm font-mono font-bold text-text-primary tracking-[0.15em]">
                        {code.code}
                      </code>
                    </td>
                    <td className="px-4 py-2.5">
                      {code.is_used ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent-gold/10 text-accent-gold"
                          style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                        >
                          <span className="w-1.5 h-1.5 bg-accent-gold" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                          Terpakai
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent-green/10 text-accent-green"
                          style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                        >
                          <span className="w-1.5 h-1.5 bg-accent-green animate-pulse" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                          Tersedia
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      {code.used_by ? (
                        <span className="text-xs text-text-secondary font-mono tracking-wider">
                          {code.used_by.substring(0, 8)}…{code.used_by.substring(code.used_by.length - 4)}
                        </span>
                      ) : (
                        <span className="text-xs text-text-tertiary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <span className="text-xs text-text-tertiary">
                        {new Date(code.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enforcement note */}
        <div
          className="mt-3 flex items-center gap-2 px-3 py-2 bg-bg-secondary/50 border border-border-subtle text-xs text-text-tertiary"
          style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
        >
          <svg className="w-3.5 h-3.5 shrink-0 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Setiap kode bersifat single-use. Setelah digunakan, kode tidak dapat diaktifkan kembali.
        </div>
      </div>
    </div>
  );
}
