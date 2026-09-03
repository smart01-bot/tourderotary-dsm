'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, ScanLine, Clock } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { getMyShifts } from '@/lib/supabase/queries/volunteer'
import { StatCard } from '@/components/participant/StatCard'
import { Button } from '@/components/ui/Button'
import { SITE } from '@/config/site'

type VolunteerShift = {
  id: string
  shift: {
    id: string
    title: string
    location: string | null
    start_time: string
    end_time: string
  }
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function VolunteerDashboardPage() {
  const { user }                      = useUser()
  const [shifts,  setShifts]          = useState<VolunteerShift[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    if (!user) return
    getMyShifts(user.id).then(({ data }) => {
      setShifts((data as VolunteerShift[]) ?? [])
      setLoading(false)
    })
  }, [user])

  const firstName   = user?.email?.split('@')[0] ?? 'Volunteer'
  const upcoming    = shifts.filter(s => new Date(s.shift.start_time) > new Date())
  const nextShift   = upcoming[0]?.shift ?? null

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-display-sm font-black text-navy mb-1">Hey, {firstName} 👋</h1>
        <p className="text-navy/50 text-sm">Thanks for volunteering at {SITE.shortName}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Shifts claimed"
          value={loading ? '—' : shifts.length}
          icon={<CalendarDays size={18} />}
          accent="gold"
        />
        <StatCard
          label="Upcoming shifts"
          value={loading ? '—' : upcoming.length}
          icon={<Clock size={18} />}
          accent="navy"
        />
      </div>

      {/* Next shift */}
      <div className="rounded-2xl border border-navy/12 bg-white p-5">
        <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-4">Next shift</p>
        {loading ? (
          <div className="h-12 bg-navy/5 rounded-xl animate-pulse" />
        ) : nextShift ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-navy">{nextShift.title}</p>
              <p className="text-xs text-navy/50 mt-0.5">
                {fmtDate(nextShift.start_time)} · {fmtTime(nextShift.start_time)} – {fmtTime(nextShift.end_time)}
              </p>
              {nextShift.location && (
                <p className="text-xs text-navy/40 mt-0.5">{nextShift.location}</p>
              )}
            </div>
            <Link href="/volunteer/shifts">
              <Button variant="ghost" size="sm">View all →</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-navy/50">No shifts claimed yet.</p>
            <Link href="/volunteer/shifts">
              <Button size="sm">Browse shifts</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/volunteer/shifts',  icon: CalendarDays, label: 'My Shifts'  },
          { href: '/volunteer/checkin', icon: ScanLine,     label: 'Check-in'   },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2.5 p-5 rounded-2xl border border-navy/10 bg-white
                       hover:border-gold/40 hover:shadow-card-gold transition-all duration-150 text-center"
          >
            <Icon size={22} className="text-navy/60" />
            <span className="text-xs font-semibold text-navy/70">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
