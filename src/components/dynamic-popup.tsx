"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type PopUpAsset = {
  id: string;
  title: string | null;
  content: string;
  image_url: string | null;
  link_url: string | null;
};

export function DynamicPopUp() {
  const [popUp, setPopUp] = useState<PopUpAsset | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchPopUp = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("assets")
        .select("id, title, content, image_url, link_url")
        .eq("asset_type", "pop_up")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        // Check if user dismissed this popup in current session
        const dismissedId = sessionStorage.getItem("mediea_popup_dismissed");
        if (dismissedId !== data.id) {
          setPopUp(data);
          // Small delay for entrance animation
          setTimeout(() => setVisible(true), 300);
        }
      }
    };

    fetchPopUp();
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      if (popUp) {
        sessionStorage.setItem("mediea_popup_dismissed", popUp.id);
      }
      setPopUp(null);
    }, 300);
  }, [popUp]);

  if (!popUp) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-[3px] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={dismiss}
      />

      {/* Pop-Up Container */}
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div
          className="relative bg-bg-primary border border-border-default w-full max-w-lg shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          style={{
            clipPath: "polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 3D inset shadow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              boxShadow: "inset -2px -2px 8px rgba(0,0,0,0.4), inset 1px 1px 3px rgba(255,255,255,0.02)",
            }}
          />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-green via-accent-gold to-accent-green" />

          {/* Close Button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center
                       bg-bg-secondary border border-border-default text-text-tertiary
                       hover:text-danger hover:border-danger/30 transition-all duration-200"
            style={{
              clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image */}
          {popUp.image_url && (
            <div
              className="w-full h-44 bg-bg-secondary overflow-hidden"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
              }}
            >
              <img
                src={popUp.image_url}
                alt={popUp.title || ""}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Title */}
            {popUp.title && (
              <h3 className="text-lg font-bold text-text-primary pr-8">
                {popUp.title}
              </h3>
            )}

            {/* Body */}
            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {popUp.content}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {popUp.link_url && (
                <a
                  href={popUp.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2
                             bg-gradient-to-r from-[#FFD700] to-[#DAA520]
                             text-[#1e252b] font-bold text-sm
                             px-5 py-3
                             transition-all duration-300
                             hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]
                             hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Lihat Selengkapnya
                </a>
              )}
              <button
                onClick={dismiss}
                className="flex-1 sm:flex-none px-5 py-3 text-sm font-semibold text-text-tertiary
                           bg-bg-secondary border border-border-default
                           hover:text-text-primary hover:border-border-focus/30
                           transition-all duration-200"
                style={{
                  clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
                }}
              >
                Tutup
              </button>
            </div>
          </div>

          {/* Bottom corner accent */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8"
            style={{
              background: "linear-gradient(135deg, transparent 50%, rgba(255,215,0,0.15) 50%)",
            }}
          />
        </div>
      </div>
    </>
  );
}
