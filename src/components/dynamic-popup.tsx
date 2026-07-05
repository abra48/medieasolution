"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PopUp = {
  id: string;
  title: string;
  content: string;
  button_text: string | null;
  button_url: string | null;
  is_active: boolean;
};

export function DynamicPopUp() {
  const [popup, setPopup] = useState<PopUp | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("popup_dismissed");
    if (dismissed) return;

    const fetchPopup = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("assets")
          .select("id, title, description, content, link_url, is_active")
          .eq("asset_type", "pop_up")
          .eq("is_active", true)
          .limit(1)
          .single();

        if (data) {
          setPopup({
            id: data.id,
            title: data.title || "Announcement",
            content: data.description || data.content || "",
            button_text: data.title ? "Open" : null,
            button_url: data.link_url || null,
            is_active: data.is_active,
          });
          setTimeout(() => setVisible(true), 500);
        }
      } catch {
        // No popup available
      }
    };

    fetchPopup();
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("popup_dismissed", "1");
    setTimeout(() => setPopup(null), 300);
  };

  if (!popup) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-bg-primary/60 backdrop-blur-sm" onClick={dismiss} />

      <div className={`relative card max-w-sm w-full !p-6 transition-transform duration-300 ${visible ? "scale-100" : "scale-95"}`}>
        <button onClick={dismiss} className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-text-tertiary hover:text-text-primary bg-bg-tertiary transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-base font-bold text-text-primary mb-2 pr-6">{popup.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">{popup.content}</p>

        <div className="flex gap-2">
          {popup.button_url && (
            <a href={popup.button_url} target="_blank" rel="noopener noreferrer" onClick={dismiss} className="btn-primary !py-2 !text-xs">
              {popup.button_text || "Open"}
            </a>
          )}
          <button onClick={dismiss} className="btn-secondary !py-2 !text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
