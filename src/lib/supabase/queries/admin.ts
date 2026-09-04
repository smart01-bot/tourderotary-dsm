import { supabase } from '@/lib/supabase/client'
import type { EventPhase } from '@/types'

// ── Local types ─────────────────────────────────────────────────────────────

export interface AdminRegistration {
  id:             string
  user_id:        string
  activity_slug:  string
  status:         string
  payment_status: string
  bib_number:     string | null
  created_at:     string
  profile: {
    full_name: string | null
    email:     string
    phone:     string | null
  } | null
}

export interface AdminParticipant {
  id:        string
  email:     string
  full_name: string | null
  phone:     string | null
  created_at: string
  registrations: { activity_slug: string; status: string; payment_status: string }[]
}

export interface AdminVolunteer {
  id:        string
  email:     string
  full_name: string | null
  created_at: string
  shifts: {
    id:          string
    shift_id:    string
    checked_in:  boolean
    shift: { title: string; start_time: string; location: string | null } | null
  }[]
}

export interface AdminSponsor {
  id:          string
  name:        string
  tier:        string
  amount_tsh:  number
  status:      string
  contact_name: string | null
  created_at:  string
  user: { email: string } | null
}

export interface AdminPartner {
  id:          string
  name:        string
  category:    string
  status:      string
  contact_name: string | null
  created_at:  string
  user: { email: string } | null
  deliverable_count:  number
  completed_count:    number
}

export interface AdminOrder {
  id:         string
  user_id:    string
  status:     string
  total_tsh:  number
  created_at: string
  profile: { full_name: string | null; email: string } | null
  items: { product_name: string; quantity: number; size: string | null; price_tsh: number }[]
}

export interface AdminProduct {
  id:                  string
  name:                string
  slug:                string
  category:            string | null
  price_participant:   number
  price_public:        number
  stock:               number
  sizes:               string[]
  image_url:           string | null
}

export interface AuditEvent {
  id:         string
  action:     string
  table_name: string | null
  record_id:  string | null
  actor_id:   string | null
  actor_email: string | null
  metadata:   Record<string, unknown> | null
  created_at: string
}

export interface HQStats {
  total_registrations: number
  paid_registrations:  number
  total_revenue_tsh:   number
  total_volunteers:    number
  total_sponsors:      number
  total_partners:      number
  total_orders:        number
  by_activity: { activity_slug: string; count: number; paid: number }[]
}

// ── Dashboard stats ─────────────────────────────────────────────────────────

export async function getHQStats(): Promise<{ data: HQStats; error: null }> {
  const [
    { count: totalReg },
    { count: paidReg },
    { count: volunteers },
    { count: sponsors },
    { count: partners },
    { count: orders },
    { data: regRows },
    { data: paidRows },
  ] = await Promise.all([
    supabase.from('registrations').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('payment_status', 'completed'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'volunteer'),
    supabase.from('sponsors').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('partners').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('activity_slug'),
    supabase.from('registrations').select('activity_slug, amount_tsh').eq('payment_status', 'completed'),
  ])

  // Revenue: sum of paid registration amounts
  const totalRevenue = (paidRows ?? []).reduce((sum, r) => sum + (r.amount_tsh ?? 0), 0)

  // By-activity breakdown
  const actMap: Record<string, { count: number; paid: number }> = {}
  for (const r of regRows ?? []) {
    if (!actMap[r.activity_slug]) actMap[r.activity_slug] = { count: 0, paid: 0 }
    actMap[r.activity_slug].count++
  }
  for (const r of paidRows ?? []) {
    if (!actMap[r.activity_slug]) actMap[r.activity_slug] = { count: 0, paid: 0 }
    actMap[r.activity_slug].paid++
  }
  const by_activity = Object.entries(actMap).map(([activity_slug, v]) => ({
    activity_slug, ...v,
  }))

  return {
    data: {
      total_registrations: totalReg  ?? 0,
      paid_registrations:  paidReg   ?? 0,
      total_revenue_tsh:   totalRevenue,
      total_volunteers:    volunteers ?? 0,
      total_sponsors:      sponsors   ?? 0,
      total_partners:      partners   ?? 0,
      total_orders:        orders     ?? 0,
      by_activity,
    },
    error: null,
  }
}

// ── Registrations ───────────────────────────────────────────────────────────

export async function getAllRegistrations() {
  return supabase
    .from('registrations')
    .select('*, profile:profiles(full_name, email, phone)')
    .order('created_at', { ascending: false })
    .returns<AdminRegistration[]>()
}

export async function updateRegistrationStatus(
  id: string,
  status: string,
  payment_status?: string
) {
  const update: Record<string, string> = { status }
  if (payment_status) update.payment_status = payment_status
  return supabase.from('registrations').update(update).eq('id', id).select().single()
}

export async function assignBibNumber(id: string, bib: string) {
  return supabase
    .from('registrations')
    .update({ bib_number: bib })
    .eq('id', id)
    .select()
    .single()
}

// ── Participants ────────────────────────────────────────────────────────────

export async function getAllParticipants() {
  return supabase
    .from('profiles')
    .select('*, registrations(activity_slug, status, payment_status)')
    .eq('role', 'participant')
    .order('created_at', { ascending: false })
    .returns<AdminParticipant[]>()
}

// ── Volunteers ──────────────────────────────────────────────────────────────

export async function getAllVolunteers() {
  return supabase
    .from('profiles')
    .select('*, shifts:volunteer_shifts(id, shift_id, checked_in, shift:shifts(title, start_time, location))')
    .eq('role', 'volunteer')
    .order('created_at', { ascending: false })
    .returns<AdminVolunteer[]>()
}

// ── Sponsors ────────────────────────────────────────────────────────────────

export async function getAllSponsors() {
  return supabase
    .from('sponsors')
    .select('*, user:profiles(email)')
    .order('amount_tsh', { ascending: false })
    .returns<AdminSponsor[]>()
}

export async function updateSponsorStatus(id: string, status: string) {
  return supabase.from('sponsors').update({ status }).eq('id', id).select().single()
}

// ── Partners ────────────────────────────────────────────────────────────────

export async function getAllPartners() {
  return supabase
    .from('partners')
    .select(`
      *,
      user:profiles(email),
      deliverables:partner_deliverables(id, status)
    `)
    .order('created_at', { ascending: false })
    .returns<(Omit<AdminPartner, 'deliverable_count' | 'completed_count'> & {
      deliverables: { id: string; status: string }[]
    })[]>()
}

export async function updatePartnerStatus(id: string, status: string) {
  return supabase.from('partners').update({ status }).eq('id', id).select().single()
}

// ── Orders ──────────────────────────────────────────────────────────────────

export async function getAllOrders() {
  return supabase
    .from('orders')
    .select(`
      *,
      profile:profiles(full_name, email),
      items:order_items(product_name, quantity, size, price_tsh)
    `)
    .order('created_at', { ascending: false })
    .returns<AdminOrder[]>()
}

export async function updateOrderStatus(id: string, status: string) {
  return supabase.from('orders').update({ status }).eq('id', id).select().single()
}

// ── Inventory ───────────────────────────────────────────────────────────────

export async function getAllProducts() {
  return supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true })
    .returns<AdminProduct[]>()
}

export async function updateProductStock(id: string, stock: number) {
  return supabase.from('products').update({ stock }).eq('id', id).select().single()
}

// ── Phase control ───────────────────────────────────────────────────────────

export async function getCurrentPhase() {
  return supabase
    .from('event_config')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single()
}

export async function setEventPhase(phase: EventPhase, actorId: string) {
  // Upsert into the single config row (id = 1)
  return supabase
    .from('event_config')
    .upsert({ id: 1, phase, updated_by: actorId }, { onConflict: 'id' })
    .select()
    .single()
}

// ── Audit log ───────────────────────────────────────────────────────────────

export async function getAuditLog(limit = 100) {
  return supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<AuditEvent[]>()
}

export async function writeAuditEvent(
  action: string,
  actorId: string,
  actorEmail: string,
  opts?: { table_name?: string; record_id?: string; metadata?: Record<string, unknown> }
) {
  return supabase.from('audit_log').insert({
    action,
    actor_id:    actorId,
    actor_email: actorEmail,
    table_name:  opts?.table_name ?? null,
    record_id:   opts?.record_id  ?? null,
    metadata:    opts?.metadata   ?? null,
  })
}

// ── Financial summary ───────────────────────────────────────────────────────

export interface FinancialRow {
  activity_slug: string
  registrations: number
  revenue_tsh:   number
}

export async function getFinancialBreakdown() {
  const { data, error } = await supabase
    .from('registrations')
    .select('activity_slug, amount_tsh, payment_status')

  if (error || !data) return { data: [] as FinancialRow[], error }

  const map: Record<string, { registrations: number; revenue_tsh: number }> = {}
  for (const r of data) {
    if (!map[r.activity_slug]) map[r.activity_slug] = { registrations: 0, revenue_tsh: 0 }
    map[r.activity_slug].registrations++
    if (r.payment_status === 'completed') {
      map[r.activity_slug].revenue_tsh += r.amount_tsh ?? 0
    }
  }

  const rows: FinancialRow[] = Object.entries(map).map(([activity_slug, v]) => ({
    activity_slug,
    ...v,
  }))

  return { data: rows, error: null }
}
