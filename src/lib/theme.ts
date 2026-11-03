/* ——— Theme (dark / light) — satu sumber untuk landing, login, portal & admin ——— */

export const THEME_KEY = "mediea-theme";
const LEGACY_KEYS = ["gx-theme"];

export function getSavedIsDark(): boolean {
  try {
    const saved =
      localStorage.getItem(THEME_KEY) ??
      LEGACY_KEYS.map((k) => localStorage.getItem(k)).find(Boolean);
    return saved ? saved === "dark" : true; // default dark
  } catch {
    return true;
  }
}

export function applyTheme(isDark: boolean) {
  const html = document.documentElement;
  html.setAttribute("data-theme", isDark ? "dark" : "light");
  html.style.colorScheme = isDark ? "dark" : "light";
  document.querySelectorAll(".gx-page").forEach((el) => {
    el.classList.toggle("gx-light", !isDark);
  });
}

export function saveTheme(isDark: boolean) {
  try {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  } catch {}
}

/* ——— Untuk useSyncExternalStore: tema dibaca langsung dari atribut <html> ——— */
export function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function getThemeSnapshot(): "dark" | "light" {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function getServerThemeSnapshot(): null {
  return null;
}

/** Dijalankan inline di <head> sebelum paint agar tidak berkedip / kembali ke dark */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}")||localStorage.getItem("gx-theme");var d=t?t==="dark":true;var h=document.documentElement;h.setAttribute("data-theme",d?"dark":"light");h.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
