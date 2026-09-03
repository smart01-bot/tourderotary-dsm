import { supabase } from '@/lib/supabase/client'

// ── Shifts ─────────────────────────────────────────────────────────────────
export async function getOpenShifts() {
  return supabase
    .from('shifts')
    .select('*')
    .order('start_time', { ascending: true })
}

export async function getMyShifts(userId: string) {
  return supabase
    .from('volunteer_shifts')
    .select('*, shift:shifts(*)')
    .eq('volunteer_id', userId)
    .order('created_at', { ascending: true })
}

export async function claimShift(userId: string, shiftId: string) {
  return supabase
    .from('volunteer_shifts')
    .insert({ volunteer_id: userId, shift_id: shiftId, checked_in: false })
    .select()
    .single()
}

export async function releaseShift(userId: string, shiftId: string) {
  return supabase
    .from('volunteer_shifts')
    .delete()
    .eq('volunteer_id', userId)
    .eq('shift_id', shiftId)
}

// ── Check-in ───────────────────────────────────────────────────────────────
export async function getRegistrationByCode(code: string) {
  // Code format: TdRDSM-<uuid> or bare uuid
  const id = code.replace(/^TdRDSM-/i, '').trim()

  return supabase
    .from('registrations')
    .select('*, profile:profiles(full_name, email)')
    .eq('id', id)
    .single()
}

export async function checkInParticipant(registrationId: string) {
  return supabase
    .from('registrations')
    .update({ status: 'checked_in' })
    .eq('id', registrationId)
    .select()
    .single()
}

export async function getRecentCheckIns(limit = 10) {
  return supabase
    .from('registrations')
    .select('id, activity_slug, bib_number, profile:profiles(full_name), updated_at')
    .eq('status', 'checked_in')
    .order('updated_at', { ascending: false })
    .limit(limit)
}
