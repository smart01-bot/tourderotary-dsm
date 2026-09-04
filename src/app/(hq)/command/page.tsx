'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { usePhase } from '@/hooks/usePhase'
import { getHQStats, type HQStats } from '@/lib/supabase/queries/admin'
import { StatsOverview } from '@/components/hq/StatsOverview'

const PHASE_META = {
  pre_event:  { label: 'Pre-Event',  color: 'bg-gold-50 border-gold text-gold-700',         dot: 'bg-gold'       },
  event_day:  { label: 'Event Day',  color: 'bg-magenta-50 border-magenta text-magenta',     dot: 'bg-magenta'    },
  post_event: { label: 'Post-Event', color: 'bg-green-50 border-green-400 text-green-700',   dot: 'bg-green-500'  },
}

export default function CommandPage() {
  const { phase }               = usePhase()
  const [stats,   setStats]     = useState<HQStats | null>(null)
  const [loading, setLoading]   = useState(true)
  const [refresh, setRefresh]   = useState(0)

  useEffect(() => {
    setLoading(true)
    getHQStats().then(({ data }) => {
      setStats(data)
      setLoading(false)
    })
  }, [refresh])

  const phaseMeta = phase ? PHASE_META[phase] : null

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-black text-navy">Command</h1>
          <p className="text-navy/50 font-medium mt-1">
            Tour de Rotary DSM · 1 November 2026
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {phaseMeta && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${phaseMeta.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${phaseMeta.dot} animate-pulse`} />
              {phaseMeta.label}
            </span>
          )}
          <button
            onClick={() => setRefresh(r => r + 1)}
            className="p-2 rounded-xl border border-navy-100 bg-white text-navy/50 hover:text-navy hover:border-navy/30 transition-colors"
            title="Refresh stats"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-28 bg-navy-50 rounded-2xl" />
          ))}
        </div>
      ) : stats ? (
        <StatsOverview stats={stats} />
      ) : null}

      {/* Activity breakdown */}
      {stats && stats.by_activity.length > 0 && (
        <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-card-navy">
          <h2 className="text-xs font-black uppercase tracking-wider text-navy/40 mb-5">
            Registrations by Activity
          </h2>
          <div className="space-y-3">
            {[...stats.by_activity]
              .sort((a, b) => b.count - a.count)
              .map(act => {
                const maxCount = Math.max(...stats.by_activity.map(a => a.count), 1)
                const pct = Math.round((act.count / maxCount) * 100)
                const payPct = act.count > 0 ? Math.round((act.paid / act.count) * 100) : 0
                return (
                  <div key={act.activity_slug}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-black text-navy capitalize">
                        {act.activity_slug.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-navy/40 font-semibold">
                        {act.count} reg{act.count !== 1 ? 's' : ''} · {payPct}% paid
                      </span>
                    </div>
                    <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { href: '/hq/registrations', label: 'Manage Registrations' },
          { href: '/hq/phase',         label: 'Control Event Phase'  },
          { href: '/hq/reports',       label: 'Financial Reports'    },
          { href: '/hq/volunteers',    label: 'View Volunteers'      },
          { href: '/hq/communications', label: 'Send Communications' },
          { href: '/hq/audit',         label: 'View Audit Log'       },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white rounded-2xl border border-navy-100 p-4 shadow-card-navy
                       hover:border-gold hover:shadow-card-gold transition-all duration-200 flex items-center justify-between gap-2"
          >
            <span className="text-sm font-black text-navy">{label}</span>
            <ArrowRight size={15} className="text-navy/20 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
