/**
 * Platform Table Resolver
 * 
 * Memetakan nama platform dari tabel `platforms` ke slug tabel database.
 * Setiap platform memiliki tabel `{slug}_issues` dan `{slug}_solutions` tersendiri.
 */

const PLATFORM_SLUG_MAP: Record<string, string> = {
  "facebook": "facebook",
  "instagram": "instagram",
  "tiktok": "tiktok",
  "twitter / x": "twitter_x",
  "twitter": "twitter_x",
  "x": "twitter_x",
  "youtube": "youtube",
  "whatsapp": "whatsapp",
  "telegram": "telegram",
  "linkedin": "linkedin",
};

/**
 * Resolve nama platform ke slug tabel.
 * Case-insensitive, toleran terhadap variasi penulisan.
 * @throws Error jika platform tidak dikenali.
 */
export function getPlatformSlug(platformName: string): string {
  const normalized = platformName.trim().toLowerCase();
  const slug = PLATFORM_SLUG_MAP[normalized];
  if (!slug) {
    throw new Error(`Platform tidak dikenali: "${platformName}". Platform yang didukung: ${Object.keys(PLATFORM_SLUG_MAP).join(", ")}`);
  }
  return slug;
}

/**
 * Resolve nama platform ke nama tabel issues.
 * Contoh: "Facebook" → "facebook_issues"
 */
export function getIssuesTable(platformName: string): string {
  return `${getPlatformSlug(platformName)}_issues`;
}

/**
 * Resolve nama platform ke nama tabel solutions.
 * Contoh: "Facebook" → "facebook_solutions"
 */
export function getSolutionsTable(platformName: string): string {
  return `${getPlatformSlug(platformName)}_solutions`;
}

/** Daftar semua slug platform yang didukung. */
export const ALL_PLATFORM_SLUGS = [
  "facebook",
  "instagram",
  "tiktok",
  "twitter_x",
  "youtube",
  "whatsapp",
  "telegram",
  "linkedin",
] as const;

export type PlatformSlug = (typeof ALL_PLATFORM_SLUGS)[number];
