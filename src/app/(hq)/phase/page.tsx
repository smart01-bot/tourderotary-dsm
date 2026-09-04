'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { getCurrentPhase, setEventPhase, writeAuditEvent } from '@/lib/supabase/queries/admin'
import { PhaseControl } from '@/components/hq/PhaseControl'
import type { EventPhase } from '@/types'

export default function PhasePage() {
  const { user }              = useUser()
  const [phase,   setPhase]   = useState<EventPhase | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentPhase().then(({ data }) => {
      setPhase(data?.phase ?? 'pre_event')
      setLoading(false)
    })
  }, [])

  const handlePhaseChange = async (newPhase: EventPhase) => {
    if (!user) throw new Error('Not authenticated')
    await setEventPhase(newPhase, user.id)
    await writeAuditEvent('phase_change', user.id, user.email ?? '', {
      metadata: { from: phase, to: newPhase },
    })
    setPhase(newPhase)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Phase Control</h1>
        <p className="text-navy/50 font-medium mt-1">
          Switch the event phase. Changes take effect immediately across all portals.
        </p>
      </div>

      {loading || !phase ? (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-3 gap-4">
            {[0,1,2].map(i => <div key={i} className="h-32 bg-navy-50 rounded-2xl" />)}
          </div>
        </div>
      ) : (
        <PhaseControl
          currentPhase={phase}
          onPhaseChange={handlePhaseChange}
        />
      )}

      <div className="bg-navy-50 rounded-2xl p-5">
        <p className="text-xs font-black text-navy/40 uppercase tracking-wider mb-2">How phases work</p>
        <ul className="space-y-2 text-sm text-navy/60 font-medium">
          <li><span className="font-black text-navy">Pre-Event</span> — Registration open, payment active, sponsor/partner portals live.</li>
          <li><span className="font-black text-navy">Event Day</span> — Registration closed, check-in and bib scanning active.</li>
          <li><span className="font-black text-navy">Post-Event</span> — All portals show impact data, certificates unlocked.</li>
        </ul>
      </div>
    </div>
  )
}
