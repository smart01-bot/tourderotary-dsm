import { supabase } from '@/lib/supabase/client'

// ── Local types ────────────────────────────────────────────────────────────

export type PartnerCategory =
  | 'medical'
  | 'media'
  | 'logistics'
  | 'venue'
  | 'catering'
  | 'technology'
  | 'other'

export type PartnerStatus = 'active' | 'pending' | 'inactive'

export type DeliverableStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'

export interface PartnerProfile {
  id:           string
  user_id:      string
  name:         string
  logo_url:     string | null
  category:     PartnerCategory
  contact_name: string | null
  status:       PartnerStatus
  created_at:   string
}

export interface PartnerDeliverable {
  id:          string
  partner_id:  string
  title:       string
  description: string | null
  due_date:    string | null   // ISO date string
  status:      DeliverableStatus
  hq_notes:    string | null   // HQ-visible notes; partners can read, not write
  created_at:  string
  updated_at:  string
}

// ── Partner profile ────────────────────────────────────────────────────────

export async function getPartnerProfile(userId: string) {
  return supabase
    .from('partners')
    .select('*')
    .eq('user_id', userId)
    .single<PartnerProfile>()
}

// ── Deliverables ───────────────────────────────────────────────────────────

export async function getPartnerDeliverables(partnerId: string) {
  return supabase
    .from('partner_deliverables')
    .select('*')
    .eq('partner_id', partnerId)
    .order('due_date', { ascending: true, nullsFirst: false })
    .returns<PartnerDeliverable[]>()
}

// ── Deliverable summary counts ─────────────────────────────────────────────

export interface DeliverableSummary {
  total:      number
  completed:  number
  in_progress: number
  pending:    number
  overdue:    number
}

export function summariseDeliverables(items: PartnerDeliverable[]): DeliverableSummary {
  return items.reduce<DeliverableSummary>(
    (acc, d) => {
      acc.total++
      acc[d.status]++
      return acc
    },
    { total: 0, completed: 0, in_progress: 0, pending: 0, overdue: 0 }
  )
}

// ── Static display helpers ─────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  medical:    'Medical & Safety',
  media:      'Media & Communications',
  logistics:  'Logistics',
  venue:      'Venue & Facilities',
  catering:   'Catering & Refreshments',
  technology: 'Technology',
  other:      'Partner',
}

export const DELIVERABLE_STATUS_META: Record<
  DeliverableStatus,
  { label: string; color: string; dot: string }
> = {
  pending:     { label: 'Pending',     color: 'bg-navy-50 text-navy/60',       dot: 'bg-navy/30'   },
  in_progress: { label: 'In Progress', color: 'bg-gold-50 text-gold-700',      dot: 'bg-gold'      },
  completed:   { label: 'Completed',   color: 'bg-green-50 text-green-700',    dot: 'bg-green-500' },
  overdue:     { label: 'Overdue',     color: 'bg-magenta-50 text-magenta',    dot: 'bg-magenta'   },
}
