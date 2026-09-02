'use client'

import { useContext } from 'react'
import { PhaseContext } from '@/context/PhaseContext'
import type { PhaseContextValue } from '@/types'

/**
 * usePhase — the only way components should access the current event phase.
 * NEVER hardcode phase logic or dates in components — always use this hook.
 */
export function usePhase(): PhaseContextValue {
  const ctx = useContext(PhaseContext)

  if (!ctx) {
    throw new Error('usePhase must be used within a PhaseProvider')
  }

  return ctx
}
