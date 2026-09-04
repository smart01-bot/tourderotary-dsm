'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import {
  getPartnerProfile,
  getPartnerDeliverables,
  summariseDeliverables,
  DELIVERABLE_STATUS_META,
  type PartnerProfile,
  type PartnerDeliverable,
  type DeliverableSummary,
  type DeliverableStatus,
} from '@/lib/supabase/queries/partner'
import { DeliverableList } from '@/components/partner/DeliverableList'
import { cn } from '@/lib/utils'

const STATUS_FILTERS: { value: DeliverableStatus | 'all'; label: string }[] = [
  { value: 'all',         label: 'All'         },
  { value: 'pending',     label: 'Pending'     },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed'   },
  { value: 'overdue',     label: 'Overdue'     },
]

export default function PartnerDeliverablesPage() {
  const { user } = useUser()

  const [partner,     setPartner]     = useState<PartnerProfile | null>(null)
  const [deliverables, setDeliverables] = useState<PartnerDeliverable[]>([])
  const [summary,     setSummary]     = useState<DeliverableSummary | null>(null)
  const [filter,      setFilter]      = useState<DeliverableStatus | 'all'>('all')
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data: p } = await getPartnerProfile(user.id)
      setPartner(p)
      if (p) {
        const { data: items } = await getPartnerDeliverables(p.id)
        const list = items ?? []
        setDeliverables(list)
        setSummary(summariseDeliverables(list))
      }
      setLoading(false)
    })()
  }, [user])

  const filtered = filter === 'all'
    ? deliverables
    : deliverables.filter(d => d.status === filter)

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse max-w-3xl">
        <div className="h-8 w-48 bg-navy-50 rounded-xl" />
        <div className="flex gap-2">
          {[0,1,2,3,4].map(i => <div key={i} className="h-8 w-24 bg-navy-50 rounded-full" />)}
        </div>
        {[0,1,2].map(i => <div key={i} className="h-28 bg-navy-50 rounded-2xl" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-display-sm font-black text-navy">Deliverables</h1>
        <p className="text-navy/50 font-medium mt-1">
          Your commitments for Tour de Rotary DSM · 1 November 2026
        </p>
      </div>

      {/* Progress bar */}
      {summary && summary.total > 0 && (
        <ProgressBar summary={summary} />
      )}

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => {
          const count = value === 'all'
            ? (summary?.total ?? 0)
            : (summary ? summary[value === 'in_progress' ? 'in_progress' : value as keyof DeliverableSummary] as number : 0)

          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-black transition-all duration-150',
                filter === value
                  ? 'bg-navy text-white'
                  : 'bg-white border border-navy-100 text-navy/60 hover:border-navy/30 hover:text-navy'
              )}
            >
              {label}
              {count > 0 && (
                <span className={cn(
                  'ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]',
                  filter === value ? 'bg-white/20 text-white' : 'bg-navy-50 text-navy/50'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* List */}
      <DeliverableList items={filtered} />

      {/* Contact note */}
      <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5">
        <p className="text-sm font-semibold text-navy">Questions about your deliverables?</p>
        <p className="text-sm text-navy/60 mt-1">
          Reach the HQ team at{' '}
          <a
            href="mailto:hq@rotaract4compassion.or.tz"
            className="text-navy font-semibold underline underline-offset-2 hover:text-gold-700 transition-colors"
          >
            hq@rotaract4compassion.or.tz
          </a>
        </p>
      </div>
    </div>
  )
}

// ── Progress bar ────────────────────────────────────────────────────────────

function ProgressBar({ summary }: { summary: DeliverableSummary }) {
  const pct = summary.total > 0
    ? Math.round((summary.completed / summary.total) * 100)
    : 0

  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-5 shadow-card-navy">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-black text-navy">Overall Progress</p>
        <p className="text-sm font-black text-gold">{pct}%</p>
      </div>
      <div className="h-2.5 bg-navy-50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center gap-4 mt-3">
        {Object.entries(DELIVERABLE_STATUS_META).map(([status, meta]) => {
          const count = summary[status === 'in_progress' ? 'in_progress' : status as keyof DeliverableSummary] as number
          if (count === 0) return null
          return (
            <span key={status} className="flex items-center gap-1.5 text-xs font-semibold text-navy/50">
              <span className={cn('w-2 h-2 rounded-full', meta.dot)} />
              {count} {meta.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
