import { supabase } from '@/lib/supabase/client'
import type { UserRole } from '@/types'

// ── Sign in ────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

// ── Sign up ────────────────────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  phone: string,
  role: UserRole
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, role },
    },
  })

  if (error || !data.user) return { data, error }

  // Belt-and-suspenders: upsert profile (DB trigger also handles this)
  await supabase.from('profiles').upsert({
    id:        data.user.id,
    email,
    full_name: fullName,
    role,
  })

  return { data, error: null }
}

// ── Password reset ─────────────────────────────────────────────────────────
export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password/confirm`,
  })
  return { error }
}

// ── Sign out ───────────────────────────────────────────────────────────────
export async function signOut() {
  await supabase.auth.signOut()
}

// ── Role → portal redirect ─────────────────────────────────────────────────
export function portalRedirect(role: UserRole | null): string {
  switch (role) {
    case 'participant': return '/dashboard'
    case 'volunteer':   return '/volunteer/dashboard'
    case 'sponsor':     return '/sponsor/dashboard'
    case 'partner':     return '/partner/dashboard'
    case 'hq_admin':    return '/command'
    default:            return '/dashboard'
  }
}
