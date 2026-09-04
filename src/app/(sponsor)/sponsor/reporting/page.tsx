'use client'

import { useEffect, useState } from 'react'
import { usePhase } from '@/hooks/usePhase'
import { getImpactStats, type ImpactStats } from '@/lib/supabase/queries/sponsor'
import { ImpactReport } from '@/components/sponsor/ImpactReport'
import { formatTSh } from '@/lib/utils'

// ── Fee constants (mirrors participant constants) ──────────────────────────
// Used to estimate total fundraising value (paid_registrations × avg fee)
const AVG_ACTIVITY_FEE_TSH = 30_000 // conservative mid-tier estimate

export default function SponsorReportingPage() {
  const { phase, isPostEvent } = usePhase()

  const [stats,   setStats]   = useState<ImpactStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data } = await getImpactStats()
      setStats(data)
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-3xl">
        <div className="h-8 w-48 bg-navy-50 rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          {[0,1,2].map(i => <div key={i} className="h-24 bg-navy-50 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-navy-50 rounded-2xl" />
      </div>
    )
  }

  const estimatedRevTsh = stats
    ? stats.paid_registrations * AVG_ACTIVITY_FEE_TSH
    : 0

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-display-sm font-black text-navy">Impact Report</h1>
        <p className="text-navy/50 font-medium mt-1">
          {isPostEvent
            ? 'Final event impact — thank you for making this possible.'
            : 'Live registration data — updates as participants sign up.'}
        </p>
      </div>

      {/* Pre-event notice */}
      {phase === 'pre_event' && (
        <div className="bg-gold-50 border border-gold-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
          <p className="text-sm text-navy/70 font-medium">
            Registration is open. Numbers update in real time as participants register.
            Full impact data will be available after the event on 1 November 2026.
          </p>
        </div>
      )}

      {/* Core impact report */}
      {stats && <ImpactReport stats={stats} />}

      {/* Estimated fundraising value */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-card-navy">
        <h3 className="text-sm font-black text-navy uppercase tracking-wider mb-4">
          Estimated Registration Revenue
        </h3>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black text-navy">
            {formatTSh(estimatedRevTsh)}
          </span>
          <span className="text-sm text-navy/40 font-medium mb-1">
            projected from paid registrations
          </span>
        </div>
        <p className="text-xs text-navy/30 font-medium mt-2">
          Based on average activity fee of {formatTSh(AVG_ACTIVITY_FEE_TSH)} per participant.
          All proceeds support cancer care at Ocean Road Cancer Institute.
        </p>
      </div>

      {/* Charity reminder */}
      <div className="bg-navy rounded-2xl p-6 text-white">
        <p className="text-xs font-black uppercase tracking-widest text-gold mb-2">
          Charity beneficiary
        </p>
        <p className="text-lg font-black leading-snug">
          Ocean Road Cancer Institute
        </p>
        <p className="text-white/60 text-sm font-medium mt-1 leading-relaxed">
          Supporting Tanzanian families affected by cancer. Your sponsorship directly
          enables participant access to this event and funds raised go to patient care.
        </p>
      </div>
    </div>
  )
}
