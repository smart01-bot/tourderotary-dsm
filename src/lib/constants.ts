import type { ActivitySlug, EventPhase, SponsorTier } from '@/types'

// ── Event dates ────────────────────────────────────────────────────────────
export const EVENT_DATE = new Date('2026-11-01T06:00:00+03:00') // 6 AM EAT
export const BUILD_DEADLINE = new Date('2026-09-15T00:00:00+03:00')

// ── Currency ───────────────────────────────────────────────────────────────
export const CURRENCY = 'TSh'
export const CURRENCY_CODE = 'TZS'

// ── Activity slugs ─────────────────────────────────────────────────────────
export const ACTIVITY_SLUGS: ActivitySlug[] = [
  'cyclathon',
  'marathon',
  'walkathon',
  'zumba',
  'yoga',
  'community_walk',
]

// ── Seat caps per activity ─────────────────────────────────────────────────
export const SEAT_CAPS: Record<ActivitySlug, number> = {
  cyclathon:      500,
  marathon:       300,
  walkathon:      500,
  zumba:          200,
  yoga:           150,
  community_walk: 1000,
}

// ── Registration prices (TSh) ──────────────────────────────────────────────
export const ACTIVITY_PRICES: Record<ActivitySlug, { standard: number; vip?: number }> = {
  cyclathon:      { standard: 50_000, vip: 100_000 },
  marathon:       { standard: 30_000, vip: 60_000  },
  walkathon:      { standard: 20_000                },
  zumba:          { standard: 25_000                },
  yoga:           { standard: 25_000                },
  community_walk: { standard: 10_000                },
}

// ── Phase labels ───────────────────────────────────────────────────────────
export const PHASE_LABELS: Record<EventPhase, string> = {
  pre_event:  'Registration Open',
  event_day:  'Event Day — Live!',
  post_event: 'Event Complete',
}

export const PHASE_COLORS: Record<EventPhase, string> = {
  pre_event:  'bg-gold text-navy',
  event_day:  'bg-magenta text-white',
  post_event: 'bg-navy text-white',
}

// ── Sponsor tier order ─────────────────────────────────────────────────────
export const SPONSOR_TIER_ORDER: SponsorTier[] = [
  'platinum',
  'gold',
  'silver',
  'bronze',
  'partner',
]

// ── Route paths (avoid magic strings across the app) ──────────────────────
export const ROUTES = {
  home:       '/',
  about:      '/about',
  activities: '/activities',
  activity:   (slug: ActivitySlug) => `/activities/${slug}`,
  merch:      '/merch',
  sponsors:   '/sponsors',
  frame:      '/frame',
  contact:    '/contact',
  login:      '/login',
  signup:     '/signup',
  reset:      '/reset-password',
  // Participant portal
  dashboard:    '/dashboard',
  register:     (activity: ActivitySlug) => `/register/${activity}`,
  ticket:       '/ticket',
  training:     '/training',
  orders:       '/orders',
  collectibles: '/collectibles',
  referrals:    '/referrals',
  settings:     '/settings',
  // HQ
  hqCommand:    '/command',
} as const

// ── Fundraising targets (TSh) ──────────────────────────────────────────────
export const FUNDRAISING_TARGET_TSH = 50_000_000 // 50 million TSh

// ── Social media ───────────────────────────────────────────────────────────
export const SOCIAL = {
  instagram: 'https://instagram.com/rotaract4compassion',
  twitter:   'https://twitter.com/rotaract4compassion',
  facebook:  'https://facebook.com/rotaract4compassion',
  linkedin:  'https://linkedin.com/company/rotaract4compassion',
}
