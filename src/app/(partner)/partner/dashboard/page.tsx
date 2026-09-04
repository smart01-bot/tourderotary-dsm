'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import {
  getPartnerProfile,
  getPartnerDeliverables,
  summariseDeliverables,
  CATEGORY_LABELS,
  type PartnerProfile,
  type DeliverableSummary,
} from '@/lib/supabase/queries/partner'
import { cn } from '@/lib/utils'

export default function PartnerDashboardPage() {
  const { user } = useUser()

  const [partner,  setPartner]  = useState<PartnerProfile | null>(null)
  const [summary,  setSummary]  = useState<DeliverableSummary | null>(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data: p } = await getPartnerProfile(user.id)
      setPartner(p)
      if (p) {
        const { data: items } = await getPartnerDeliverables(p.id)
        setSummary(summariseDeliverables(items ?? []))
      }
      setLoading(false)
    })()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-3xl">
        <div className="h-8 w-64 bg-navy-50 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[0,1,2,3].map(i => <div key={i} className="h-24 bg-navy-50 rounded-2xl" />)}
        </div>
        <div className="h-24 bg-navy-50 rounded-2xl" />
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-navy/40 font-semibold">Your partner profile isn&apos;t set up yet.</p>
        <p className="text-sm text-navy/30 mt-1">Contact the Rotaract 4 Compassion team to get started.</p>
      </div>
    )
  }

  const categoryLabel = CATEGORY_LABELS[partner.category]
  const allDone       = summary ? summary.total > 0 && summary.completed === summary.total : false

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-black uppercase tracking-widest text-gold">
            {categoryLabel}
          </span>
        </div>
        <h1 className="text-display-sm font-black text-navy leading-tight">{partner.name}</h1>
        <p className="text-navy/50 font-medium mt-1">
          Tour de Rotary DSM · 1 November 2026, Dar es Salaam
        </p>
      </div>

      {/* All-done banner */}
      {allDone && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-600 shrink-0" />
          <p className="text-sm font-semibold text-green-800">
            All deliverables complete — thank you for your contribution!
          </p>
        </div>
      )}

      {/* Overdue alert */}
      {summary && summary.overdue > 0 && (
        <div className="bg-magenta-50 border border-magenta-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-magenta shrink-0" />
          <p className="text-sm font-semibold text-navy">
            {summary.overdue} deliverable{summary.overdue > 1 ? 's are' : ' is'} overdue.
            Please check the Deliverables page and contact HQ if you need assistance.
          </p>
        </div>
      )}

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryCard label="Total"       value={summary.total}       color="navy"    />
          <SummaryCard label="Completed"   value={summary.completed}   color="green"   />
          <SummaryCard label="In Progress" value={summary.in_progress} color="gold"    />
          <SummaryCard label="Overdue"     value={summary.overdue}     color="magenta" />
        </div>
      )}

      {/* CTA */}
      <Link
        href="/partner/deliverables"
        className="group bg-white rounded-2xl border border-navy-100 p-6 shadow-card-navy
                   hover:border-gold hover:shadow-card-gold transition-all duration-200 flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy flex items-center justify-center shrink-0
                        group-hover:bg-gold group-hover:text-navy transition-colors duration-200">
          <ClipboardList size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-navy text-sm mb-0.5">View Deliverables</p>
          <p className="text-xs text-navy/50 font-medium">
            Track your commitments and see any notes from the HQ team.
          </p>
        </div>
        <ArrowRight
          size={16}
          className="shrink-0 text-navy/30 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-200 mt-0.5"
        />
      </Link>

      {/* Event info */}
      <div className="bg-navy rounded-2xl p-6 text-white">
        <p className="text-xs font-black uppercase tracking-widest text-gold mb-2">Event details</p>
        <p className="text-lg font-black">Tour de Rotary DSM</p>
        <p className="text-white/60 text-sm font-medium mt-1">
          Sunday, 1 November 2026 · Dar es Salaam, Tanzania
        </p>
        <p className="text-white/50 text-xs font-medium mt-2">
          Six activities: Cyclathon, Marathon, Walkathon, Zumba, Yoga, Community Walk.
          All proceeds benefit Ocean Road Cancer Institute.
        </p>
      </div>
    </div>
  )
}

// ── Summary card ────────────────────────────────────────────────────────────

const CARD_COLORS: Record<string, string> = {
  navy:    'text-navy',
  green:   'text-green-600',
  gold:    'text-gold-700',
  magenta: 'text-magenta',
}

function SummaryCard({
  label, value, color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-4 shadow-card-navy">
      <p className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider mb-2">{label}</p>
      <p className={cn('text-3xl font-black', CARD_COLORS[color] ?? 'text-navy')}>{value}</p>
    </div>
  )
}
