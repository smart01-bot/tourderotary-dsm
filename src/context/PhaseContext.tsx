'use client'

import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { EventPhase, PhaseContextValue } from '@/types'
import { fetchCurrentPhase } from '@/lib/phase'

export const PhaseContext = createContext<PhaseContextValue | null>(null)

export function PhaseProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<EventPhase>('pre_event')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    fetchCurrentPhase().then(p => {
      if (mounted) {
        setPhase(p)
        setLoading(false)
      }
    })

    // Re-fetch every 5 minutes — HQ can change phase at any time
    const interval = setInterval(() => {
      fetchCurrentPhase().then(p => {
        if (mounted) setPhase(p)
      })
    }, 5 * 60 * 1000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const value: PhaseContextValue = {
    phase,
    isPreEvent:  phase === 'pre_event',
    isEventDay:  phase === 'event_day',
    isPostEvent: phase === 'post_event',
    loading,
  }

  return (
    <PhaseContext.Provider value={value}>
      {children}
    </PhaseContext.Provider>
  )
}
