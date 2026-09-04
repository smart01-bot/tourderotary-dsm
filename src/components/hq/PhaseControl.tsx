'use client'

import { useState } from 'react'
import { ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EventPhase } from '@/types'

const PHASES: { value: EventPhase; label: string; desc: string; color: string }[] = [
  {
    value: 'pre_event',
    label: 'Pre-Event',
    desc:  'Registration open. Participant, sponsor and partner portals are live.',
    color: 'border-gold bg-gold-50',
  },
  {
    value: 'event_day',
    label: 'Event Day',
    desc:  'Registration closed. Check-in and live tracking active.',
    color: 'border-magenta bg-magenta-50',
  },
  {
    value: 'post_event',
    label: 'Post-Event',
    desc:  'Event complete. Impact reports and certificates are live.',
    color: 'border-green-400 bg-green-50',
  },
]

interface PhaseControlProps {
  currentPhase: EventPhase
  onPhaseChange: (phase: EventPhase) => Promise<void>
}

export function PhaseControl({ currentPhase, onPhaseChange }: PhaseControlProps) {
  const [pending,     setPending]     = useState<EventPhase | null>(null)
  const [confirming,  setConfirming]  = useState<EventPhase | null>(null)
  const [saving,      setSaving]      = useState(false)
  const [success,     setSuccess]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  const requestChange = (phase: EventPhase) => {
    if (phase === currentPhase) return
    setPending(phase)
    setConfirming(phase)
    setSuccess(false)
    setError(null)
  }

  const confirmChange = async () => {
    if (!pending) return
    setSaving(true)
    setError(null)
    try {
      await onPhaseChange(pending)
      setSuccess(true)
      setConfirming(null)
    } catch (e) {
      setError('Failed to update phase. Please try again.')
    } finally {
      setSaving(false)
      setPending(null)
    }
  }

  const cancel = () => {
    setPending(null)
    setConfirming(null)
  }

  return (
    <div className="space-y-6">
      {/* Phase cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PHASES.map(({ value, label, desc, color }) => {
          const isActive  = currentPhase === value
          const isTarget  = confirming   === value
          return (
            <button
              key={value}
              onClick={() => requestChange(value)}
              disabled={isActive || saving}
              className={cn(
                'rounded-2xl border-2 p-5 text-left transition-all duration-200',
                isActive
                  ? `${color} opacity-100 cursor-default`
                  : 'border-navy-100 bg-white hover:border-navy/30 hover:shadow-card-navy',
                isTarget && !isActive && 'border-magenta bg-magenta-50',
                (isActive || saving) && 'cursor-not-allowed'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn(
                  'text-xs font-black uppercase tracking-widest',
                  isActive ? 'text-navy' : 'text-navy/50'
                )}>
                  {label}
                </span>
                {isActive
                  ? <ToggleRight size={20} className="text-navy" />
                  : <ToggleLeft  size={20} className="text-navy/20" />
                }
              </div>
              <p className={cn(
                'text-xs font-medium leading-relaxed',
                isActive ? 'text-navy/70' : 'text-navy/40'
              )}>
                {desc}
              </p>
              {isActive && (
                <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-black text-navy/50 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Confirmation dialog */}
      {confirming && (
        <div className="bg-white rounded-2xl border-2 border-magenta p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-magenta shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-navy text-sm">
                Switch to {PHASES.find(p => p.value === confirming)?.label}?
              </p>
              <p className="text-sm text-navy/60 font-medium mt-1">
                This affects all portal users immediately. Make sure you&apos;re ready before confirming.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={confirmChange}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white
                         text-sm font-black hover:bg-navy-700 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Switching…' : 'Confirm switch'}
            </button>
            <button
              onClick={cancel}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-navy-100 text-sm font-semibold
                         text-navy/60 hover:text-navy hover:border-navy/30 transition-colors"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-sm text-magenta font-semibold">{error}</p>}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
          <CheckCircle2 size={16} />
          Phase updated successfully.
        </div>
      )}
    </div>
  )
}
