/**
 * Custom Icon Library — Mediea Solution
 * Clean, minimal, geometric SVG icons inspired by Streamline Guidance style.
 * Each icon is hand-crafted with consistent 24x24 viewBox, 1.5px stroke.
 */

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

const defaultProps: IconProps = {
  className: "w-5 h-5",
  size: 24,
};

/* ——— Dashboard / Stats Icons ——— */

/** Grid of 4 squares — represents platforms */
export function IconGrid({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

/** Open book — represents solutions/guides */
export function IconBook({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
      <path d="M8 7h8" />
      <path d="M8 11h5" />
    </svg>
  );
}

/** Document with folded corner — represents templates */
export function IconDocument({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

/** Play triangle inside rounded rectangle — represents videos */
export function IconVideo({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polygon points="10,8.5 16,12 10,15.5" fill={color || "currentColor"} stroke="none" />
    </svg>
  );
}

/* ——— Quick Action Icons ——— */

/** Shield with checkmark — represents account recovery */
export function IconShieldCheck({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3.5 6.5V11c0 5.25 3.625 10.15 8.5 11.5 4.875-1.35 8.5-6.25 8.5-11.5V6.5L12 2z" />
      <polyline points="8.5 12.5 10.5 14.5 15.5 9.5" />
    </svg>
  );
}

/** Newspaper / article — represents reading articles */
export function IconArticle({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7" y1="7" x2="17" y2="7" />
      <line x1="7" y1="11" x2="13" y2="11" />
      <line x1="7" y1="15" x2="11" y2="15" />
      <rect x="14" y="11" width="3" height="4" rx="0.5" />
    </svg>
  );
}

/** Chat bubble with dots — represents support */
export function IconChat({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <circle cx="9.5" cy="11.5" r="0.75" fill={color || "currentColor"} stroke="none" />
      <circle cx="12.5" cy="11.5" r="0.75" fill={color || "currentColor"} stroke="none" />
      <circle cx="15.5" cy="11.5" r="0.75" fill={color || "currentColor"} stroke="none" />
    </svg>
  );
}

/** Graduation cap — represents learning modules */
export function IconGraduation({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 2,7 12,12 22,7" />
      <path d="M6 9.5V16c0 0 2.5 3 6 3s6-3 6-3V9.5" />
      <line x1="22" y1="7" x2="22" y2="13" />
    </svg>
  );
}

/* ——— Utility Icons ——— */

/** Bolt/lightning — represents quick start */
export function IconBolt({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

/** Checkmark in circle — represents success/verified */
export function IconCheckCircle({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  );
}

/** Right chevron arrow */
export function IconChevronRight({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

/** Lock closed — represents locked content */
export function IconLock({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1" fill={color || "currentColor"} stroke="none" />
    </svg>
  );
}

/** Alert circle — represents error/warning */
export function IconAlertCircle({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <circle cx="12" cy="16.5" r="0.75" fill={color || "currentColor"} stroke="none" />
    </svg>
  );
}

/** Spinner/loader */
export function IconSpinner({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={`${className} animate-spin`} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke={color || "currentColor"} strokeWidth="3" />
      <path className="opacity-75" fill={color || "currentColor"} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/** Search magnifying glass */
export function IconSearch({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

/** Arrow right — clean directional arrow */
export function IconArrowRight({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="14 7 19 12 14 17" />
    </svg>
  );
}

/** Key — represents access codes */
export function IconKey({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="15.5" cy="8.5" r="5.5" />
      <path d="M11.5 12.5L3 21" />
      <path d="M3 21l3-1 1-3" />
      <path d="M8 16l2-1" />
    </svg>
  );
}

/** Compass/target — represents platform selection */
export function IconCompass({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color || "currentColor"} stroke="none" opacity="0.2" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

/** Wrench/tool — represents troubleshooting */
export function IconWrench({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/** Verified badge with check — represents success */
export function IconVerified({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 2.9h3.7l.3 3.7L21 11l-2.6 2.4.3 3.7h-3.7L12 22l-2.4-2.9H5.9l-.3-3.7L3 13l2.6-2.4-.3-3.7h3.7L12 2z" />
      <polyline points="8.5 12.5 10.5 14.5 15.5 9.5" />
    </svg>
  );
}

/** External link — opens in new tab */
export function IconExternalLink({ className = defaultProps.className, size = 24, color }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

