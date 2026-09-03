'use client'

import { useState } from 'react'
import { MapPin, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type Shift = {
  id: string
  title: string
  description: string | null
  location: string | null
  start_time: string
  end_time: string
  max_slots: number
  filled_slots: number
}

interface Props {
  shift: Shift
  claimed: boolean
  onClaim: (shiftId: string) => Promise<void>
  onRelease: (shiftId: string) => Promise<void>
}

function shiftStatus(start: string, end: string): 'upcoming' | 'live' | 'done' {
  const now  = Date.now()
  const s    = new Date(start).getTime()
  const e    = new Date(end).getTime()
  if (now < s)  return 'upcoming'
  if (now <= e) return 'live'
  return 'done'
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function ShiftCard({ shift, claimed, onClaim, onRelease }: Props) {
  const [loading, setLoading] = useState(false)
  const status   = shiftStatus(shift.start_time, shift.end_time)
  const free     = shift.max_slots - shift.filled_slots
  const full     = free <= 0

  const handleClaim = async () => {
    setLoading(true)
    await onClaim(shift.id)
    setLoading(false)
  }

  const handleRelease = async () => {
    setLoading(true)
    await onRelease(shift.id)
    setLoading(false)
  }

  const statusBadge = {
    upcoming: <Badge variant="navy" dot>Upcoming</Badge>,
    live:     <Badge variant="success" dot>Live now</Badge>,
    done:     <Badge variant="neutral">Completed</Badge>,
  }[status]

  return (
    <div className={cn(
      'rounded-2xl border bg-white p-5 transition-all duration-150',
      claimed    ? 'border-gold/40 shadow-card-gold' :
      status === 'live' ? 'border-green-300' :
      'border-navy/12 hover:border-navy/20'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-navy text-base leading-tight">{shift.title}</h3>
        {statusBadge}
      </div>

      {/* Meta */}
      <div className="space-y-1.5 mb-4 text-xs text-navy/55 font-medium">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="shrink-0" />
          {fmtDate(shift.start_time)} · {fmtTime(shift.start_time)} – {fmtTime(shift.end_time)}
        </div>
        {shift.location && (
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0" />
            {shift.location}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Users size={13} className="shrink-0" />
          {full ? 'No slots remaining' : `${free} of ${shift.max_slots} slots open`}
        </div>
      </div>

      {shift.description && (
        <p className="text-xs text-navy/45 leading-relaxed mb-4 line-clamp-2">{shift.description}</p>
      )}

      {/* Action */}
      {status !== 'done' && (
        claimed ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gold">✓ Claimed</span>
            <Button variant="ghost" size="sm" onClick={handleRelease} loading={loading}>
              Release
            </Button>
          </div>
        ) : full ? (
          <p className="text-xs text-navy/40 font-semibold">Shift full</p>
        ) : (
          <Button size="sm" onClick={handleClaim} loading={loading}>
            Claim shift
          </Button>
        )
      )}
    </div>
  )
}
