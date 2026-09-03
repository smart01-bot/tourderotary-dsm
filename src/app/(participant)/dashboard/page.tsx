'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bike, Ticket, Share2, ShoppingBag } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { usePhase } from '@/hooks/usePhase'
import { getMyRegistrations } from '@/lib/supabase/queries/participant'
import { RegistrationStatus } from '@/components/participant/RegistrationStatus'
import { FundraisingProgress } from '@/components/participant/FundraisingProgress'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ACTIVITY_MAP } from '@/config/activities'
import { PHASE_LABELS } from '@/lib/constants'

const QUICK_LINKS = [
  { href: '/ticket',    icon: Ticket,      label: 'My Ticket'  },
  { href: '/register',  icon: Bike,        label: 'Register'   },
  { href: '/referrals', icon: Share2,      label: 'Referrals'  },
  { href: '/merch',     icon: ShoppingBag, label: 'Merch'      },
]

export default function DashboardPage() {
  const { user }                    = useUser()
  const { phase, isPreEvent }       = usePhase()
  const [registrations, setRegs]    = useState<any[]>([])
  const [loading,       setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getMyRegistrations(user.id).then(({ data }) => {
      setRegs(data ?? [])
      setLoading(false)
    })
  }, [user])

  const activeReg = registrations.find(r => r.status !== 'cancelled')
  const activity  = activeReg ? ACTIVITY_MAP[activeReg.activity_slug] : null
  const firstName = user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-black text-navy mb-2">
            Hey, {firstName} 👋
          </h1>
          <Badge variant="gold" dot>{PHASE_LABELS[phase]}</Badge>
        </div>
        {isPreEvent && !activeReg && !loading && (
          <Link href="/register">
            <Button size="sm">Register now</Button>
          </Link>
        )}
      </div>

      {/* Registration card */}
      <div className="rounded-2xl border border-navy/12 bg-white p-5">
        <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-4">
          Registration
        </p>
        {loading ? (
          <div className="h-12 bg-navy/5 rounded-xl animate-pulse" />
        ) : activeReg && activity ? (
          <div className="flex items-center justify-between gap-4">
            <RegistrationStatus
              status={activeReg.status}
              activityName={activity.name}
              bibNumber={activeReg.bib_number}
            />
            {activeReg.status === 'pending' && (
              <Link href="/ticket">
                <Button size="sm" variant="secondary">Pay now</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-navy/50">No registration yet.</p>
            {isPreEvent && (
              <Link href="/register">
                <Button variant="ghost" size="sm">Choose an activity →</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Fundraising */}
      <FundraisingProgress raised={0} />

      {/* Quick links */}
      <div>
        <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-3">
          Quick links
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-navy/10 bg-white
                         hover:border-gold/40 hover:shadow-card-gold transition-all duration-150 text-center"
            >
              <Icon size={22} className="text-navy/60" />
              <span className="text-xs font-semibold text-navy/70">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
