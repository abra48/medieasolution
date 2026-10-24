/**
 * Admin role hierarchy utilities for Mediea Solution.
 *
 * Role tiers (highest → lowest):
 *   admin / admin_lead → admin_senior → admin_junior
 *
 * "admin" is the legacy role and has the same privileges as admin_lead.
 */

export type AdminRole = "admin" | "admin_lead" | "admin_senior" | "admin_junior";

const ADMIN_ROLES = new Set<string>(["admin", "admin_lead", "admin_senior", "admin_junior"]);

/** Check if a role string is any admin tier */
export function isAdminRole(role: string | null | undefined): boolean {
  return !!role && ADMIN_ROLES.has(role);
}

/** Check if the role has "lead" (full) access — includes legacy "admin" */
export function isAdminLead(role: string | null | undefined): boolean {
  return role === "admin" || role === "admin_lead";
}

/** Check if the role has at least "senior" access */
export function isAdminSeniorOrAbove(role: string | null | undefined): boolean {
  return role === "admin" || role === "admin_lead" || role === "admin_senior";
}

/** Check if the role has at least "junior" access */
export function isAdminJuniorOrAbove(role: string | null | undefined): boolean {
  return ADMIN_ROLES.has(role || "");
}

/** Get display label for admin tier */
export function getAdminTierLabel(role: string | null | undefined): string {
  switch (role) {
    case "admin":
    case "admin_lead":
      return "Lead";
    case "admin_senior":
      return "Senior";
    case "admin_junior":
      return "Junior";
    default:
      return "Unknown";
  }
}

/** Get tier accent color */
export function getAdminTierColor(role: string | null | undefined): string {
  switch (role) {
    case "admin":
    case "admin_lead":
      return "accent-gold";
    case "admin_senior":
      return "accent-green";
    case "admin_junior":
      return "text-secondary";
    default:
      return "text-tertiary";
  }
}

/** Navigation permission map — which tabs each tier can see */
export type NavPermission = {
  dashboard: boolean;
  platforms: boolean;
  issues: boolean;
  solutions: boolean;
  codes: boolean;
  affiliates: boolean;
  assets: boolean;
  articles: boolean;
  modules: boolean;
  support: boolean;
};

export function getNavPermissions(role: string | null | undefined): NavPermission {
  const isLead = isAdminLead(role);
  const isSenior = isAdminSeniorOrAbove(role);

  return {
    dashboard: true, // all tiers
    platforms: isSenior,
    issues: isSenior,
    solutions: isSenior,
    codes: isLead,
    affiliates: isLead,
    assets: true, // all tiers (junior restricted to articles/testimonials at app layer)
    articles: true, // all tiers can manage articles
    modules: isSenior,
    support: true, // all tiers
  };
}
