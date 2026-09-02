'use client'

import { useCountdown } from '@/hooks/useCountdown'
import { cn } from '@/lib/utils'
import { EVENT_DATE } from '@/lib/constants'

interface CountdownTimerProps {
  target?: Date
  /** 'hero' = large display on navy bg | 'strip' = compact on accent bg */
  variant?: 'hero' | 'strip'
  className?: string
}

interface UnitProps {
  value: string
  label: string
  variant: 'hero' | 'strip'
}

function Unit({ value, label, variant }: UnitProps) {
  return (
    <div className={cn('countdown-cell', variant === 'hero' ? 'min-w-[80px]' : 'min-w-[60px]')}>
      <span
        className={cn(
          'tabular-nums font-black leading-none',
          variant === 'hero'
            ? 'text-5xl sm:text-6xl lg:text-7xl text-gold'
            : 'text-3xl sm:text-4xl text-navy'
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          'text-eyebrow mt-1.5',
          variant === 'hero' ? 'text-white/50' : 'text-navy/60'
        )}
      >
        {label}
      </span>
    </div>
  )
}

function Colon({ variant }: { variant: 'hero' | 'strip' }) {
  return (
    <span
      className={cn(
        'font-black pb-4 select-none',
        variant === 'hero'
          ? 'text-4xl text-gold/40'
          : 'text-2xl text-navy/30'
      )}
      aria-hidden
    >
      :
    </span>
  )
}

export function CountdownTimer({ target = EVENT_DATE, variant = 'hero', className }: CountdownTimerProps) {
  const { formatted, isExpired } = useCountdown(target)

  if (isExpired) {
    return (
      <p className={cn(
        'font-bold uppercase tracking-widest',
        variant === 'hero' ? 'text-gold text-xl' : 'text-navy text-base'
      )}>
        The event is underway!
      </p>
    )
  }

  return (
    <div
      className={cn('flex items-end gap-3 sm:gap-5', className)}
      role="timer"
      aria-label="Countdown to Tour de Rotary DSM"
    >
      <Unit value={formatted.days}    label="Days"    variant={variant} />
      <Colon variant={variant} />
      <Unit value={formatted.hours}   label="Hours"   variant={variant} />
      <Colon variant={variant} />
      <Unit value={formatted.minutes} label="Mins"    variant={variant} />
      <Colon variant={variant} />
      <Unit value={formatted.seconds} label="Secs"    variant={variant} />
    </div>
  )
}
