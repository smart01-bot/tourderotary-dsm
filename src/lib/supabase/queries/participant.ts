import { supabase } from '@/lib/supabase/client'
import type { ActivitySlug } from '@/types'

// ── Profile ────────────────────────────────────────────────────────────────
export async function getMyProfile(userId: string) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export async function updateProfile(userId: string, updates: { full_name?: string }) {
  return supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
}

// ── Registrations ──────────────────────────────────────────────────────────
export async function getMyRegistrations(userId: string) {
  return supabase
    .from('registrations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function createRegistration(userId: string, activitySlug: ActivitySlug) {
  return supabase
    .from('registrations')
    .insert({
      user_id:        userId,
      activity_slug:  activitySlug,
      status:         'pending',
      payment_status: 'pending',
    })
    .select()
    .single()
}

export async function getActivitySeatCount(activitySlug: string) {
  return supabase
    .from('registrations')
    .select('id', { count: 'exact', head: true })
    .eq('activity_slug', activitySlug)
    .neq('status', 'cancelled')
}

// ── Products ───────────────────────────────────────────────────────────────
export async function getProducts() {
  return supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .order('name')
}

// ── Orders ─────────────────────────────────────────────────────────────────
export async function getMyOrders(userId: string) {
  return supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}
