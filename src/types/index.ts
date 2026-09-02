// ── Event Phase ────────────────────────────────────────────────────────────
export type EventPhase = 'pre_event' | 'event_day' | 'post_event'

// ── User Roles ─────────────────────────────────────────────────────────────
export type UserRole = 'participant' | 'volunteer' | 'sponsor' | 'partner' | 'hq_admin'

// ── Activity slugs (match DB enum) ────────────────────────────────────────
export type ActivitySlug =
  | 'cyclathon'
  | 'marathon'
  | 'walkathon'
  | 'zumba'
  | 'yoga'
  | 'community_walk'

// ── Activity definition (from config) ─────────────────────────────────────
export interface ActivityConfig {
  slug: ActivitySlug
  name: string
  shortName: string
  description: string
  icon: string           // lucide icon name
  color: string          // tailwind class accent
  distance?: string      // e.g. "42km"
  duration?: string      // e.g. "60 min"
  priceMin: number       // TSh
  priceMax?: number      // TSh — if tiered
  seatCap: number
  category: 'cycling' | 'running' | 'walking' | 'fitness'
}

// ── Registration status ────────────────────────────────────────────────────
export type RegistrationStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'cancelled'
  | 'checked_in'

// ── Payment status ─────────────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

// ── Order status ───────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

// ── Merch product ──────────────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  priceGold: number   // TSh — Gold tier (participant)
  pricePublic: number // TSh — Public price
  imageUrl: string
  category: string
  sizes: string[]
  stock: number
}

// ── Cart ───────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  imageUrl: string
}

// ── Sponsor tier ───────────────────────────────────────────────────────────
export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner'

export interface Sponsor {
  id: string
  name: string
  logoUrl: string
  tier: SponsorTier
  websiteUrl?: string
}

// ── Countdown result ───────────────────────────────────────────────────────
export interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

// ── Phase context value ────────────────────────────────────────────────────
export interface PhaseContextValue {
  phase: EventPhase
  isPreEvent: boolean
  isEventDay: boolean
  isPostEvent: boolean
  loading: boolean
}

// ── User context value ─────────────────────────────────────────────────────
export interface UserContextValue {
  user: import('@supabase/supabase-js').User | null
  role: UserRole | null
  loading: boolean
  signOut: () => Promise<void>
}

// ── Nav link ───────────────────────────────────────────────────────────────
export interface NavLink {
  label: string
  href: string
  external?: boolean
}
