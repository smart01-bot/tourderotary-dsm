import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ── Tailwind class merger ──────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Currency formatting ────────────────────────────────────────────────────
/**
 * Format a number as Tanzanian Shillings.
 * e.g. formatTSh(50000) → "TSh 50,000"
 */
export function formatTSh(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000) return `TSh ${(amount / 1_000_000).toFixed(1)}M`
    if (amount >= 1_000)     return `TSh ${(amount / 1_000).toFixed(0)}K`
  }
  return `TSh ${amount.toLocaleString('en-TZ')}`
}

// ── Date helpers ───────────────────────────────────────────────────────────
/**
 * Format a date as a readable string.
 * e.g. formatDate(new Date('2026-11-01')) → "1 November 2026"
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  })
}

/**
 * Format a date as short form.
 * e.g. formatDateShort(new Date('2026-11-01')) → "1 Nov 2026"
 */
export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}

/**
 * Returns days until a target date (0 if past).
 */
export function daysUntil(target: Date): number {
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ── String helpers ─────────────────────────────────────────────────────────
/**
 * Convert activity slug to display name.
 * e.g. "community_walk" → "Community Walk"
 */
export function slugToName(slug: string): string {
  return slug
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Truncate text to a given character limit with ellipsis.
 */
export function truncate(text: string, limit: number): string {
  return text.length > limit ? text.slice(0, limit) + '…' : text
}

// ── Number helpers ─────────────────────────────────────────────────────────
/**
 * Pad a number with leading zeros (for countdown).
 * e.g. pad(5) → "05"
 */
export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/**
 * Format a large integer with commas.
 * e.g. formatNumber(1234567) → "1,234,567"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-TZ')
}

// ── Supabase storage helpers ───────────────────────────────────────────────
/**
 * Build a public Supabase storage URL.
 */
export function storageUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/${bucket}/${path}`
}

// ── Referral code ──────────────────────────────────────────────────────────
/**
 * Generate a predictable referral slug from a user ID.
 */
export function referralSlug(userId: string): string {
  return userId.slice(0, 8).toUpperCase()
}
