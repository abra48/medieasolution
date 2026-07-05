import { ContactHub } from "@/components/contact-hub";

export default function SupportPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Support <span className="text-gradient-gold">Hub</span>
        </h1>
        <p className="text-text-secondary">
          Hubungi agen kami untuk bantuan teknis terkait pemulihan akun.
        </p>
      </div>

      {/* Contact Hub */}
      <ContactHub />

      {/* FAQ Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 bg-accent-green"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          />
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
            Informasi Penting
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              q: "Berapa lama proses pemulihan?",
              a: "Proses pemulihan bervariasi tergantung platform dan jenis kendala. Rata-rata 1–7 hari kerja.",
            },
            {
              q: "Apakah data saya aman?",
              a: "Seluruh data yang Anda berikan diproses secara terenkripsi dan tidak disimpan setelah proses selesai.",
            },
            {
              q: "Bagaimana cara mendapatkan kode akses?",
              a: "Kode akses dapat diperoleh melalui agen resmi kami via WhatsApp atau distributor affiliate.",
            },
            {
              q: "Apakah ada garansi keberhasilan?",
              a: "Kami menyediakan panduan berbasis prosedur resmi platform. Tingkat keberhasilan bergantung pada kondisi akun.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-bg-primary border border-border-default px-5 py-4 space-y-2"
              style={{
                clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
              }}
            >
              <p className="text-sm font-semibold text-text-primary">{faq.q}</p>
              <p className="text-xs text-text-tertiary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
