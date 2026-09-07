'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, QrCode, Share2, Users, Award, Link2, TrendingUp, ChevronRight, Bike, Activity } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { usePhase } from '@/hooks/usePhase'
import { getMyRegistrations } from '@/lib/supabase/queries/participant'
import { FundraisingProgress } from '@/components/participant/FundraisingProgress'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ACTIVITY_MAP } from '@/config/activities'
import { PHASE_LABELS, EVENT_DATE } from '@/lib/constants'

function daysToRace() {
  const ms = EVENT_DATE.getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

const QUICK = [
  { href: '/ticket',    icon: QrCode, label: 'My bib'      },
  { href: '/ticket',    icon: Award,  label: 'Certificate' },
  { href: '/referrals', icon: Share2, label: 'Share'       },
  { href: '/referrals', icon: Link2,  label: 'Referral'    },
  { href: '#',          icon: Users,  label: 'My team'     },
]

export default function DashboardPage() {
  const { user }                 = useUser()
  const { phase, isPreEvent }    = usePhase()
  const [registrations, setRegs] = useState<any[]>([])
  const [loading, setLoading]    = useState(true)

  useEffect(() => {
    if (!user) return
    getMyRegistrations(user.id).then(({ data }) => {
      setRegs(data ?? [])
      setLoading(false)
    })
  }, [user])

  const activeReg = registrations.find(r => r.status !== 'cancelled')
  const activity  = activeReg ? ACTIVITY_MAP[activeReg.activity_slug] : null
  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
              ?? user?.email?.split('@')[0]
              ?? 'there'
  const days = daysToRace()

  const phaseVariant = phase === 'event_day'
    ? 'magenta'
    : phase === 'post_event'
      ? 'navy'
      : 'success' as const

  return (
    <div className="space-y-4 max-w-3xl">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy mb-1.5">
            Hey, {firstName} 👋
          </h1>
          <Badge variant={phaseVariant} dot>{PHASE_LABELS[phase]}</Badge>
        </div>
        <button className="p-2 rounded-xl border border-navy/12 bg-white text-navy/60 hover:text-navy hover:bg-navy/4 transition-colors">
          <Bell size={16} />
        </button>
      </div>

      {/* ── Stat strip ─────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Days to race',    value: days.toString() },
          { label: 'Challenges done', value: '0'             },
          { label: 'Team size',       value: '—'             },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-2xl border border-navy/10 bg-white px-4 py-3 flex items-center justify-between"
          >
            <span className="text-[10px] font-semibold text-navy/50 uppercase tracking-wide leading-tight">
              {s.label}
            </span>
            <span className="text-lg font-black text-navy">{s.value}</span>
          </div>
        ))}
      </div>

      {/* ── Row 1: Raised + Ticket ──────────────────────── */}
      <div className="grid grid-cols-2 gap-4">

        <FundraisingProgress raised={0} />

        {/* Ticket preview */}
        <div className="rounded-2xl border border-navy/12 bg-white p-5">
          <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-3">
            My ticket
          </p>
          <div className="flex gap-3.5 mb-4">
            <div className="w-16 h-16 rounded-xl bg-[#F7F6F3] border border-navy/10 flex items-center justify-center shrink-0">
              <QrCode size={28} className="text-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-navy text-sm mb-1">Tour de Rotary DSM</p>
              <p className="text-xs text-navy/55 mb-0.5">Dar es Salaam</p>
              <p className="text-xs text-navy/55 mb-2.5">1 November 2026</p>
              {activeReg?.bib_number ? (
                <span className="inline-flex text-[10px] font-bold text-navy bg-gold/15 px-2.5 py-1 rounded-lg">
                  BIB #{activeReg.bib_number}
                </span>
              ) : (
                <span className="inline-flex text-[10px] font-bold text-gold bg-gold/15 px-2.5 py-1 rounded-lg">
                  Bib pending
                </span>
              )}
            </div>
          </div>
          <div className="border-t border-navy/8 pt-3.5">
            <Link href="/ticket">
              <Button variant="ghost" size="sm" fullWidth rightIcon={<ChevronRight size={14} />}>
                View full ticket
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 2: Training + Registration ─────────────── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Training tiles */}
        <div className="rounded-2xl border border-navy/12 bg-white p-5">
          <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-3">
            Training plans
          </p>
          <div className="grid grid-cols-2 gap-2.5 mb-3.5">
            {[
              { Icon: Activity, name: 'Run plan',   sub: '5 km · 3×/wk'  },
              { Icon: Bike,     name: 'Cycle plan', sub: '25 km · 2×/wk' },
            ].map(({ Icon, name, sub }) => (
              <div
                key={name}
                className="bg-navy rounded-xl p-3.5 flex flex-col items-center gap-2"
              >
                <Icon size={22} className="text-gold" strokeWidth={1.8} />
                <div className="text-center">
                  <p className="text-white text-xs font-bold">{name}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/training">
            <Button variant="ghost" size="sm" fullWidth rightIcon={<ChevronRight size={14} />}>
              All plans
            </Button>
          </Link>
        </div>

        {/* Registration */}
        <div className="rounded-2xl border border-navy/12 bg-white p-5">
          <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-3">
            Registration
          </p>

          {loading ? (
            <div className="h-16 bg-navy/5 rounded-xl animate-pulse mb-4" />
          ) : activeReg && activity ? (
            <>
              <p className="text-xs text-navy/55 font-semibold mb-1">Activity</p>
              <p className="font-bold text-navy text-sm mb-3">{activity.name}</p>
              <div className="mb-4">
                <Badge
                  variant={
                    activeReg.status === 'paid' || activeReg.status === 'confirmed'
                      ? 'success'
                      : 'warning'
                  }
                >
                  {activeReg.status === 'paid'
                    ? 'Paid ✓'
                    : activeReg.status === 'confirmed'
                      ? 'Confirmed'
                      : 'Pending payment'}
                </Badge>
              </div>
              {activeReg.status === 'pending' && (
                <Link href="/ticket">
                  <Button size="sm" fullWidth>Pay now</Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="text-xs text-navy/55 font-semibold mb-1">Activity</p>
              <p className="font-bold text-navy text-sm mb-3">Not yet selected</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['Cyclathon', 'Marathon', 'Walkathon'].map(a => (
                  <span
                    key={a}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-navy/12 text-navy/60"
                  >
                    {a}
                  </span>
                ))}
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-navy/6 text-navy/55">
                  + 3 more
                </span>
              </div>
              {isPreEvent && (
                <Link href="/register">
                  <Button size="sm" fullWidth>Complete registration</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Run-up teaser ───────────────────────────────── */}
      <div className="rounded-2xl border border-navy/12 bg-white p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-magenta/10 flex items-center justify-center shrink-0">
            <TrendingUp size={20} className="text-magenta" />
          </div>
          <div>
            <p className="font-bold text-navy text-sm mb-0.5">The run-up is live</p>
            <p className="text-xs text-navy/55">
              Share training updates, stories and team news with the community.
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" className="shrink-0">Post now</Button>
      </div>

      {/* ── Quick access ────────────────────────────────── */}
      <div className="rounded-2xl border border-navy/12 bg-white p-5">
        <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-3">
          Quick access
        </p>
        <div className="flex gap-2.5">
          {QUICK.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              className="flex-1 flex flex-col items-center gap-2 py-3.5 rounded-xl
                         bg-[#F7F6F3] hover:bg-navy/8 transition-colors"
            >
              <Icon size={17} className="text-navy" strokeWidth={1.8} />
              <span className="text-[10px] font-semibold text-navy/70 text-center leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
