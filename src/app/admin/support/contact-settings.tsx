"use client";

import { useState, useEffect, useActionState } from "react";
import { upsertContactSettings, getContactSettings } from "@/app/actions/contact";

export function ContactSettings() {
  const [phone, setPhone] = useState("081241511156");
  const [website, setWebsite] = useState("mediea.co.id");
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/6281241511156");
  const [telegramUrl, setTelegramUrl] = useState("https://t.me/medieasolution");
  const [loaded, setLoaded] = useState(false);

  const [state, formAction, isPending] = useActionState(upsertContactSettings, null);

  // Load current settings on mount
  useEffect(() => {
    getContactSettings().then((settings) => {
      setPhone(settings.phone);
      setWebsite(settings.website);
      setWhatsappUrl(settings.whatsapp_url);
      setTelegramUrl(settings.telegram_url);
      setLoaded(true);
    });
  }, []);

  // Auto-derive WhatsApp URL from phone
  useEffect(() => {
    if (phone) {
      const cleaned = phone.replace(/^0/, "");
      setWhatsappUrl(`https://wa.me/62${cleaned}`);
    }
  }, [phone]);

  return (
    <div className="card !p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Pengaturan Kontak</h3>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            Atur informasi kontak yang ditampilkan di website dan portal.
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </div>
      </div>

      {/* Status messages */}
      {state?.success && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 animate-fade-in">
          <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs text-accent font-medium">{state.message}</span>
        </div>
      )}
      {state?.error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20 animate-fade-in">
          <svg className="w-3.5 h-3.5 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-xs text-danger">{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Phone */}
          <div>
            <label htmlFor="contact-phone" className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium block mb-1.5">
              Nomor Telepon *
            </label>
            <input
              id="contact-phone"
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081241511156"
              className="input text-sm"
              required
              disabled={!loaded}
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="contact-website" className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium block mb-1.5">
              Website
            </label>
            <input
              id="contact-website"
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="mediea.co.id"
              className="input text-sm"
              disabled={!loaded}
            />
          </div>

          {/* WhatsApp URL */}
          <div>
            <label htmlFor="contact-whatsapp" className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium block mb-1.5">
              WhatsApp URL
            </label>
            <input
              id="contact-whatsapp"
              type="url"
              name="whatsapp_url"
              value={whatsappUrl}
              onChange={(e) => setWhatsappUrl(e.target.value)}
              placeholder="https://wa.me/6281241511156"
              className="input text-sm text-text-secondary"
              disabled={!loaded}
            />
            <p className="text-[10px] text-text-tertiary mt-1">Otomatis terisi dari nomor telepon</p>
          </div>

          {/* Telegram URL */}
          <div>
            <label htmlFor="contact-telegram" className="text-[11px] text-text-tertiary uppercase tracking-wider font-medium block mb-1.5">
              Telegram URL
            </label>
            <input
              id="contact-telegram"
              type="url"
              name="telegram_url"
              value={telegramUrl}
              onChange={(e) => setTelegramUrl(e.target.value)}
              placeholder="https://t.me/medieasolution"
              className="input text-sm"
              disabled={!loaded}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[10px] text-text-tertiary">
            Perubahan akan ditampilkan di landing page dan portal support.
          </p>
          <button
            type="submit"
            disabled={isPending || !loaded}
            className="btn-primary !py-2 !px-5 !text-xs disabled:opacity-40"
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Simpan Kontak"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
