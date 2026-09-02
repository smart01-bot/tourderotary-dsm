import { cn } from '@/lib/utils'
import type { EventPhase } from '@/types'
import { PHASE_LABELS } from '@/lib/constants'

interface PhaseBadgeProps {
  phase: EventPhase
  className?: string
  pulse?: boolean
}

const phaseStyles: Record<EventPhase, string> = {
  pre_event:  'bg-gold/15 text-gold-700 border border-gold/30',
  event_day:  'bg-magenta text-white border border-magenta/50 shadow-glow-magenta',
  post_event: 'bg-navy/10 text-navy border border-navy/20',
}

export function PhaseBadge({ phase, className, pulse = false }: PhaseBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-pill text-xs font-semibold uppercase tracking-widest',
        phaseStyles[phase],
        className
      )}
    >
      {(phase === 'event_day' || pulse) && (
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {PHASE_LABELS[phase]}
    </span>
  )
}
