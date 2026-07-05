export default function ModulesPage() {
  const PLACEHOLDER_MODULES = [
    {
      title: "Keamanan Akun Digital",
      description: "Panduan komprehensif untuk mengamankan seluruh akun media sosial dan mencegah pembobolan.",
      icon: "🛡️",
      accentColor: "accent-green",
    },
    {
      title: "Prosedur Verifikasi Identitas",
      description: "Langkah-langkah resmi untuk proses verifikasi identitas di berbagai platform.",
      icon: "🔐",
      accentColor: "accent-gold",
    },
    {
      title: "Autentikasi Dua Faktor (2FA)",
      description: "Implementasi dan pemulihan akses melalui sistem autentikasi dua faktor.",
      icon: "📱",
      accentColor: "accent-green",
    },
    {
      title: "Pengelolaan Data Privasi",
      description: "Teknik pengelolaan data pribadi dan konfigurasi privasi di setiap platform.",
      icon: "📊",
      accentColor: "accent-gold",
    },
    {
      title: "Prosedur Hukum & Pelaporan",
      description: "Panduan pelaporan resmi ke pihak platform dan prosedur hukum terkait penyalahgunaan akun.",
      icon: "⚖️",
      accentColor: "accent-green",
    },
    {
      title: "Recovery Lanjutan",
      description: "Teknik pemulihan akun tingkat lanjut untuk kasus-kasus yang memerlukan penanganan khusus.",
      icon: "🔧",
      accentColor: "accent-gold",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Modul <span className="text-gradient-green">Belajar</span>
        </h1>
        <p className="text-sm text-text-secondary">
          Materi edukasi profesional untuk keamanan akun digital. Terpisah dari layanan pemulihan akun.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div
        className="relative overflow-hidden bg-bg-secondary border border-border-default"
        style={{
          clipPath: "polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
        }}
      >
        {/* 3D inset shadow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            boxShadow: "inset -3px -3px 10px rgba(0,0,0,0.4), inset 1px 1px 4px rgba(255,255,255,0.02)",
          }}
        />

        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-green via-accent-gold to-accent-green" />

        {/* Scan line animation overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <div
            className="absolute w-full h-32"
            style={{
              background: "linear-gradient(0deg, transparent, rgba(57,255,20,0.3), transparent)",
              animation: "scan 4s linear infinite",
            }}
          />
        </div>

        <div className="relative px-6 py-8 sm:px-10 sm:py-12 text-center space-y-5">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16 flex items-center justify-center bg-accent-green/10 border border-accent-green/20 text-accent-green"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-2">
              Modul Belajar Dalam Tahap Pengembangan
            </h2>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-[0.2em]"
              style={{
                clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
              }}
            >
              <span className="w-2 h-2 bg-accent-gold animate-pulse" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
              Coming Soon
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-text-tertiary max-w-xl mx-auto leading-relaxed">
            Modul edukasi ini dikembangkan secara terpisah dari layanan pemulihan akun.
            Konten akan mencakup panduan keamanan digital, prosedur verifikasi, dan teknik pencegahan
            yang disusun oleh tim profesional.
          </p>

          {/* Status line */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-green animate-pulse" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
              <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">
                Sistem Aktif
              </span>
            </div>
            <span className="text-text-tertiary/30">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-gold" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
              <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">
                Konten: Dalam Pengembangan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Preview Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1.5 h-1.5 bg-accent-green"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          />
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
            Pratinjau Modul
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLACEHOLDER_MODULES.map((mod, index) => (
            <div
              key={index}
              className="group relative bg-bg-primary border border-border-default
                         transition-all duration-300 opacity-60 hover:opacity-80"
              style={{
                clipPath: "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)",
              }}
            >
              {/* 3D inset */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.02)",
                }}
              />

              {/* Top accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${
                  mod.accentColor === "accent-green" ? "bg-accent-green/40" : "bg-accent-gold/40"
                }`}
              />

              <div className="p-5 space-y-3">
                {/* Icon + Lock Badge */}
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{mod.icon}</span>
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider
                               bg-bg-tertiary text-text-tertiary border border-border-default"
                    style={{
                      clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)",
                    }}
                  >
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Terkunci
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-text-primary">{mod.title}</h4>

                {/* Description */}
                <p className="text-xs text-text-tertiary leading-relaxed">{mod.description}</p>

                {/* Module Number */}
                <div className="flex items-center gap-2 pt-1">
                  <span
                    className="w-5 h-5 flex items-center justify-center text-[8px] font-bold text-text-tertiary bg-bg-secondary border border-border-default"
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-text-tertiary uppercase tracking-wider">
                    Modul {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary/50 border border-border-subtle text-xs text-text-tertiary"
        style={{
          clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
        }}
      >
        <svg className="w-4 h-4 shrink-0 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Modul edukasi ini terpisah dari layanan pemulihan akun dan akan tersedia pada pembaruan selanjutnya.
      </div>
    </div>
  );
}
