import { supabase } from '@/lib/supabase/client'

// ── Local types ────────────────────────────────────────────────────────────
// (Tables are created in Supabase by the setup SQL — not yet in database.ts placeholder)

export type SponsorTierSlug = 'platinum' | 'gold' | 'silver' | 'bronze'
export type SponsorStatus   = 'active' | 'pending' | 'lapsed'

export interface SponsorProfile {
  id:           string
  user_id:      string
  name:         string
  logo_url:     string | null
  tier:         SponsorTierSlug
  amount_tsh:   number
  website_url:  string | null
  contact_name: string | null
  status:       SponsorStatus
  created_at:   string
}

export interface SponsorAsset {
  id:          string
  sponsor_id:  string
  label:       string
  description: string | null
  file_url:    string
  file_type:   string           // e.g. 'pdf', 'zip', 'png'
  size_bytes:  number | null
  created_at:  string
}

export interface ActivityStat {
  activity_slug: string
  count:         number
}

export interface ImpactStats {
  total_registrations: number
  paid_registrations:  number
  by_activity:         ActivityStat[]
}

// ── Sponsor profile ────────────────────────────────────────────────────────

export async function getSponsorProfile(userId: string) {
  return supabase
    .from('sponsors')
    .select('*')
    .eq('user_id', userId)
    .single<SponsorProfile>()
}

// ── Sponsor assets ─────────────────────────────────────────────────────────

export async function getSponsorAssets(sponsorId: string) {
  return supabase
    .from('sponsor_assets')
    .select('*')
    .eq('sponsor_id', sponsorId)
    .order('created_at', { ascending: true })
    .returns<SponsorAsset[]>()
}

// ── Event impact stats (visible to all sponsors) ───────────────────────────

export async function getImpactStats() {
  // Total registrations
  const { count: total } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })

  // Paid registrations
  const { count: paid } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'completed')

  // Breakdown by activity
  const { data: rows } = await supabase
    .from('registrations')
    .select('activity_slug')

  const byActivity: Record<string, number> = {}
  for (const row of rows ?? []) {
    byActivity[row.activity_slug] = (byActivity[row.activity_slug] ?? 0) + 1
  }

  const by_activity: ActivityStat[] = Object.entries(byActivity).map(
    ([activity_slug, count]) => ({ activity_slug, count })
  )

  const stats: ImpactStats = {
    total_registrations: total ?? 0,
    paid_registrations:  paid  ?? 0,
    by_activity,
  }

  return { data: stats, error: null }
}

// ── Tier metadata (static reference) ──────────────────────────────────────

export const TIER_META: Record<SponsorTierSlug, {
  label:      string
  minTsh:     number
  color:      string    // tailwind bg class
  textColor:  string
  perks:      string[]
}> = {
  platinum: {
    label:     'Platinum',
    minTsh:    5_000_000,
    color:     'bg-navy',
    textColor: 'text-white',
    perks: [
      'Title sponsor naming rights',
      'Premium logo on all event materials',
      'VIP hospitality tent access',
      'Brand activation space at finish line',
      'Speaking slot at opening ceremony',
      'Full post-event impact report',
      'Logo on participant bibs',
    ],
  },
  gold: {
    label:     'Gold',
    minTsh:    2_000_000,
    color:     'bg-gold',
    textColor: 'text-navy',
    perks: [
      'Large logo on banners and programmes',
      'Social media feature (3 posts)',
      'Brand activation space',
      'Full post-event impact report',
      'Logo on participant t-shirts',
    ],
  },
  silver: {
    label:     'Silver',
    minTsh:    1_000_000,
    color:     'bg-navy-200',
    textColor: 'text-navy',
    perks: [
      'Medium logo on event programmes',
      'Social media mention (1 post)',
      'Post-event impact summary',
      'Logo on event website',
    ],
  },
  bronze: {
    label:     'Bronze',
    minTsh:    500_000,
    color:     'bg-gold-200',
    textColor: 'text-navy',
    perks: [
      'Logo on event website',
      'Thank-you mention at ceremony',
      'Post-event impact summary',
    ],
  },
}
