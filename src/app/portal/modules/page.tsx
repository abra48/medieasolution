export default function ModulesPage() {
  const MODULES = [
    { title: "Keamanan Akun Digital", desc: "Panduan mengamankan seluruh akun media sosial dan mencegah pembobolan." },
    { title: "Prosedur Verifikasi Identitas", desc: "Langkah-langkah resmi untuk proses verifikasi identitas di berbagai platform." },
    { title: "Autentikasi Dua Faktor", desc: "Implementasi dan pemulihan akses melalui sistem 2FA." },
    { title: "Pengelolaan Data Privasi", desc: "Teknik pengelolaan data pribadi dan konfigurasi privasi." },
    { title: "Prosedur Hukum & Pelaporan", desc: "Panduan pelaporan resmi ke platform dan prosedur hukum." },
    { title: "Recovery Lanjutan", desc: "Teknik pemulihan akun tingkat lanjut untuk kasus khusus." },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary mb-1">Learning Modules</h1>
        <p className="text-sm text-text-tertiary">Educational materials for digital account security.</p>
      </div>

      <div className="card text-center !py-10">
        <p className="text-xs font-medium text-secondary uppercase tracking-widest mb-2">Coming Soon</p>
        <h2 className="text-base font-bold text-text-primary mb-2">Modules are in development</h2>
        <p className="text-xs text-text-tertiary max-w-md mx-auto">
          Educational content covering digital security, verification procedures, and prevention techniques. Separate from the account recovery service.
        </p>
      </div>

      <div>
        <p className="text-xs text-text-tertiary uppercase tracking-wider mb-3">Preview</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map((mod, i) => (
            <div key={i} className="card opacity-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-text-tertiary">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[9px] font-medium text-text-tertiary uppercase tracking-wider px-1.5 py-0.5 bg-bg-tertiary rounded">Locked</span>
              </div>
              <h4 className="text-sm font-medium text-text-primary mb-1">{mod.title}</h4>
              <p className="text-xs text-text-tertiary leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
