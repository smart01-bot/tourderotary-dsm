import type { EventPhase } from '@/types'
import { supabase } from '@/lib/supabase/client'

// ── Types ──────────────────────────────────────────────────────────────────
export interface PhaseRecord {
  phase: EventPhase
  updated_at: string
  updated_by: string | null
}

// ── Phase resolution ───────────────────────────────────────────────────────
/**
 * Fetch the current event phase from Supabase.
 * The `event_config` table holds a single row with the current phase.
 * HQ Admin can override this via the Phase Engine controls UI.
 *
 * Falls back to 'pre_event' if the DB is unreachable.
 */
export async function fetchCurrentPhase(): Promise<EventPhase> {
  try {
    const { data, error } = await supabase
      .from('event_config')
      .select('phase')
      .single()

    if (error || !data) {
      console.warn('[phase] Could not fetch phase, defaulting to pre_event', error)
      return 'pre_event'
    }

    return data.phase as EventPhase
  } catch (err) {
    console.error('[phase] Unexpected error', err)
    return 'pre_event'
  }
}

// ── Phase helpers ──────────────────────────────────────────────────────────
export function isPreEvent(phase: EventPhase)  { return phase === 'pre_event'  }
export function isEventDay(phase: EventPhase)  { return phase === 'event_day'  }
export function isPostEvent(phase: EventPhase) { return phase === 'post_event' }

/**
 * RULE: Never hardcode dates in components.
 * Always derive phase from the DB record above.
 * This function exists only for the HQ phase engine to suggest
 * what the automated phase *would* be based on the calendar —
 * the HQ Admin still confirms before any switch.
 */
export function suggestPhaseFromDate(now: Date = new Date()): EventPhase {
  const EVENT_DATE = new Date('2026-11-01T06:00:00+03:00')
  const EVENT_END  = new Date('2026-11-01T18:00:00+03:00')

  if (now < EVENT_DATE) return 'pre_event'
  if (now <= EVENT_END) return 'event_day'
  return 'post_event'
}
