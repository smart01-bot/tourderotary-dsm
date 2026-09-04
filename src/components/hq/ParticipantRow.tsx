'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdminParticipant } from '@/lib/supabase/queries/admin'

const ACTIVITY_LABELS: Record<string, string> = {
  cyclathon:      'Cyclathon',
  marathon:       'Marathon',
  walkathon:      'Walkathon',
  zumba:          'Zumba',
  yoga:           'Yoga',
  community_walk: 'Community Walk',
}

const PAY_COLOR: Record<string, string> = {
  completed: 'bg-green-50 text-green-700',
  pending:   'bg-gold-50 text-gold-700',
  failed:    'bg-magenta-50 text-magenta',
}

interface ParticipantRowProps {
  participant: AdminParticipant
}

export function ParticipantRow({ participant }: ParticipantRowProps) {
  const [expanded, setExpanded] = useState(false)
  const p = participant
  const paid = p.registrations.filter(r => r.payment_status === 'completed').length

  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-card-navy overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-navy-50/40 transition-colors"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0">
          <span className="text-gold font-black text-sm">
            {(p.full_name ?? p.email)[0].toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-black text-navy text-sm">{p.full_name ?? '—'}</p>
          <p className="text-xs text-navy/40 truncate">{p.email}</p>
        </div>

        {/* Reg count */}
        <div className="text-center hidden sm:block">
          <p className="text-lg font-black text-navy">{p.registrations.length}</p>
          <p className="text-[10px] text-navy/40 font-semibold">Reg{p.registrations.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Paid count */}
        <div className="text-center hidden sm:block">
          <p className={cn('text-lg font-black', paid > 0 ? 'text-green-600' : 'text-navy/30')}>{paid}</p>
          <p className="text-[10px] text-navy/40 font-semibold">Paid</p>
        </div>

        <div className="text-navy/30">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-navy-50 px-5 py-4 space-y-4 bg-navy-50/20">
          {/* Contact */}
          <div className="flex flex-wrap gap-4 text-xs font-medium text-navy/60">
            <span className="flex items-center gap-1.5">
              <Mail size={12} /> {p.email}
            </span>
            {p.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={12} /> {p.phone}
              </span>
            )}
            <span className="text-navy/30">
              Joined {new Date(p.created_at).toLocaleDateString('en-GB')}
            </span>
          </div>

          {/* Registrations */}
          {p.registrations.length === 0 ? (
            <p className="text-xs text-navy/30 font-medium">No registrations yet.</p>
          ) : (
            <div className="space-y-2">
              {p.registrations.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-navy-100"
                >
                  <p className="text-sm font-semibold text-navy">
                    {ACTIVITY_LABELS[r.activity_slug] ?? r.activity_slug}
                  </p>
                  <span className={cn(
                    'text-xs font-black px-2 py-0.5 rounded-full capitalize',
                    PAY_COLOR[r.payment_status] ?? 'bg-navy-50 text-navy/50'
                  )}>
                    {r.payment_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
