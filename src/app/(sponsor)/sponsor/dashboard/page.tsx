'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, BarChart2, ArrowRight, CalendarDays } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { usePhase } from '@/hooks/usePhase'
import {
  getSponsorProfile,
  getImpactStats,
  type SponsorProfile,
  type ImpactStats,
} from '@/lib/supabase/queries/sponsor'
import { TierCard } from '@/components/sponsor/TierCard'

// Event date — 1 November 2026
const EVENT_DATE = new Date('2026-11-01T07:00:00+03:00')

function getDaysToEvent() {
  const diff = EVENT_DATE.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function SponsorDashboardPage() {
  const { user }   = useUser()
  const { phase }  = usePhase()

  const [sponsor, setSponsor]   = useState<SponsorProfile | null>(null)
  const [stats,   setStats]     = useState<ImpactStats | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const [{ data: sp }, { data: st }] = await Promise.all([
        getSponsorProfile(user.id),
        getImpactStats(),
      ])
      setSponsor(sp)
      setStats(st)
      setLoading(false)
    })()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-navy-50 rounded-xl" />
        <div className="h-52 bg-navy-50 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[0,1,2].map(i => <div key={i} className="h-24 bg-navy-50 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (!sponsor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-navy/40 font-semibold">
          Your sponsor profile isn&apos;t set up yet.
        </p>
        <p className="text-sm text-navy/30 mt-1">
          Contact the Rotaract 4 Compassion team to get started.
        </p>
      </div>
    )
  }

  const daysToEvent = getDaysToEvent()

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page header */}
      <div>
        <h1 className="text-display-sm font-black text-navy leading-tight">
          Welcome, {sponsor.name}
        </h1>
        <p className="text-navy/50 font-medium mt-1">
          Thank you for powering Tour de Rotary DSM · 1 November 2026
        </p>
      </div>

      {/* Tier card */}
      <TierCard
        tier={sponsor.tier}
        amountTsh={sponsor.amount_tsh}
        name={sponsor.name}
      />

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickStat
          label="Days to Event"
          value={phase === 'post_event' ? 'Done' : `${daysToEvent}`}
          sub={phase === 'post_event' ? 'Event complete' : 'Until 1 Nov 2026'}
          icon={<CalendarDays size={18} />}
        />
        <QuickStat
          label="Total Registered"
          value={stats ? stats.total_registrations.toLocaleString() : '—'}
          sub="Participants so far"
          icon={null}
        />
        <QuickStat
          label="Paid Participants"
          value={stats ? stats.paid_registrations.toLocaleString() : '—'}
          sub="Confirmed registrations"
          icon={null}
        />
      </div>

      {/* CTA cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CtaCard
          href="/sponsor/assets"
          icon={<Download size={20} />}
          title="Download Assets"
          desc="Your logo kit, event banners, and brand materials."
        />
        <CtaCard
          href="/sponsor/reporting"
          icon={<BarChart2 size={20} />}
          title="View Impact Report"
          desc="Participant numbers and event reach by activity."
        />
      </div>
    </div>
  )
}

// ── Quick stat ──────────────────────────────────────────────────────────────

function QuickStat({
  label, value, sub, icon,
}: {
  label: string
  value: string
  sub:   string
  icon:  React.ReactNode | null
}) {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-5 shadow-card-navy">
      <p className="text-xs font-semibold text-navy/50 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-black text-navy">{value}</p>
      <p className="text-xs text-navy/40 font-medium mt-1">{sub}</p>
    </div>
  )
}

// ── CTA card ────────────────────────────────────────────────────────────────

function CtaCard({
  href, icon, title, desc,
}: {
  href:  string
  icon:  React.ReactNode
  title: string
  desc:  string
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border border-navy-100 p-6 shadow-card-navy
                 hover:border-gold hover:shadow-card-gold transition-all duration-200 flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy flex items-center justify-center shrink-0
                      group-hover:bg-gold group-hover:text-navy transition-colors duration-200">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-navy text-sm mb-0.5">{title}</p>
        <p className="text-xs text-navy/50 font-medium leading-snug">{desc}</p>
      </div>
      <ArrowRight
        size={16}
        className="shrink-0 text-navy/30 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-200 mt-0.5"
      />
    </Link>
  )
}
