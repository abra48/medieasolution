/// <reference lib="webworker" />

const CACHE_NAME = "mediea-v1";
const STATIC_ASSETS = [
  "/",
  "/login",
  "/register",
  "/manifest.json",
];

// Install — cache static shell
self.addEventListener("install", (event) => {
  const e = event as ExtendableEvent;
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  const e = event as ExtendableEvent;
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  (self as unknown as ServiceWorkerGlobalScope).clients.claim();
});

// Fetch — network-first for API, cache-first for assets
self.addEventListener("fetch", (event) => {
  const e = event as FetchEvent;
  const url = new URL(e.request.url);

  // Skip non-GET and Supabase/API requests
  if (e.request.method !== "GET") return;
  if (url.hostname.includes("supabase")) return;
  if (url.pathname.startsWith("/api")) return;

  // Network-first for HTML pages (always fresh)
  if (e.request.headers.get("accept")?.includes("text/html")) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match("/") as Promise<Response>))
    );
    return;
  }

  // Cache-first for static assets (JS, CSS, images, fonts)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        if (response.ok && (
          url.pathname.match(/\.(js|css|woff2?|png|jpg|svg|ico)$/) ||
          url.pathname.startsWith("/_next/static")
        )) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});

export {};
