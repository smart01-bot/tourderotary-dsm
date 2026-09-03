'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { getMyRegistrations } from '@/lib/supabase/queries/participant'
import { Badge } from '@/components/ui/Badge'
import { ACTIVITY_MAP } from '@/config/activities'
import { SITE } from '@/config/site'
import type { RegistrationStatus } from '@/types'

const STATUS_BADGE: Record<RegistrationStatus, {
  label: string
  variant: 'success' | 'warning' | 'navy' | 'error' | 'neutral' | 'gold' | 'magenta'
}> = {
  pending:    { label: 'Pending payment', variant: 'warning' },
  confirmed:  { label: 'Confirmed',       variant: 'navy'    },
  paid:       { label: 'Paid ✓',          variant: 'success' },
  cancelled:  { label: 'Cancelled',       variant: 'error'   },
  checked_in: { label: 'Checked in ✓',   variant: 'success' },
}

export default function TicketPage() {
  const { user }                       = useUser()
  const [registration, setReg]         = useState<any>(null)
  const [loading,      setLoading]     = useState(true)

  useEffect(() => {
    if (!user) return
    getMyRegistrations(user.id).then(({ data }) => {
      const active = data?.find(r => r.status !== 'cancelled')
      setReg(active ?? null)
      setLoading(false)
    })
  }, [user])

  if (loading) {
    return <div className="h-96 max-w-sm bg-navy/5 rounded-2xl animate-pulse" />
  }

  if (!registration) {
    return (
      <div className="py-20 text-center max-w-sm mx-auto">
        <p className="text-display-sm font-black text-navy mb-2">No ticket yet</p>
        <p className="text-navy/50 text-sm">Register for an activity to get your event ticket.</p>
      </div>
    )
  }

  const activity   = ACTIVITY_MAP[registration.activity_slug]
  const statusCfg  = STATUS_BADGE[registration.status as RegistrationStatus]
  const qrPayload  = encodeURIComponent(`TdRDSM-${registration.id}`)
  const qrUrl      = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrPayload}&bgcolor=FFFFFF&color=0D1B3D&margin=10&format=svg`

  return (
    <div className="space-y-6 max-w-sm">
      <h1 className="text-display-sm font-black text-navy">My Ticket</h1>

      {/* Ticket card */}
      <div className="rounded-2xl overflow-hidden border border-navy/15 bg-white shadow-card-navy">
        {/* Header strip */}
        <div className="bg-navy px-6 py-5">
          <p className="text-gold text-eyebrow mb-1">{SITE.name}</p>
          <p className="text-white font-black text-xl">{activity?.name ?? registration.activity_slug}</p>
          <p className="text-white/45 text-xs mt-1">{SITE.eventDate} · {SITE.location}</p>
        </div>

        {/* Perforated divider */}
        <div className="relative flex items-center h-5 bg-white">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#F7F6F3] border border-navy/10" />
          <div className="flex-1 mx-4 border-t-2 border-dashed border-navy/10" />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-[#F7F6F3] border border-navy/10" />
        </div>

        {/* QR + details */}
        <div className="px-6 pb-6 pt-2 flex flex-col items-center gap-4">
          <img
            src={qrUrl}
            alt="Event QR code"
            width={180}
            height={180}
            className="rounded-xl border border-navy/8"
          />
          <div className="text-center space-y-1.5">
            {registration.bib_number && (
              <p className="text-3xl font-black text-navy">BIB #{registration.bib_number}</p>
            )}
            <Badge variant={statusCfg.variant} size="md">{statusCfg.label}</Badge>
            <p className="text-[10px] text-navy/35 font-mono tracking-widest">
              {registration.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-navy/40">
        Present this QR code at the event check-in gate.
      </p>
    </div>
  )
}
