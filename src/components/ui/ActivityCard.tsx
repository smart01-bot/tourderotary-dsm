import Link from 'next/link'
import { Bike, Footprints, PersonStanding, Music2, Sunset, Users, ArrowRight } from 'lucide-react'
import { cn, formatTSh } from '@/lib/utils'
import type { ActivityConfig } from '@/types'
import { ROUTES } from '@/lib/constants'

// Icon map — matches ActivityConfig.icon field
const ICON_MAP = {
  Bike, Footprints, PersonStanding, Music2, Sunset, Users,
} as const

type IconName = keyof typeof ICON_MAP

interface ActivityCardProps {
  activity: ActivityConfig
  /** If true, shows a "Register" CTA linking to the signup-gated register flow */
  showCta?: boolean
  /** Compact mode for narrow contexts */
  compact?: boolean
  className?: string
}

// Accent colour per activity
const accentMap: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  gold:    { border: 'border-gold/30',    bg: 'bg-gold/10',    text: 'text-gold',    icon: 'text-gold'    },
  magenta: { border: 'border-magenta/30', bg: 'bg-magenta/10', text: 'text-magenta', icon: 'text-magenta' },
  navy:    { border: 'border-white/20',   bg: 'bg-white/10',   text: 'text-white',   icon: 'text-white/80' },
}

export function ActivityCard({ activity, showCta = true, compact = false, className }: ActivityCardProps) {
  const Icon = ICON_MAP[activity.icon as IconName] ?? Bike
  const accent = accentMap[activity.color] ?? accentMap.gold

  const detail = activity.distance ?? activity.duration ?? '—'

  return (
    <div
      className={cn(
        'activity-card group flex flex-col',
        compact ? 'p-4' : 'p-6',
        className
      )}
    >
      {/* Icon + label */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-xl', accent.bg, accent.border, 'border')}>
          <Icon className={cn('w-6 h-6', accent.icon)} aria-hidden />
        </div>
        <span className={cn(
          'text-eyebrow px-2 py-0.5 rounded border',
          accent.bg, accent.border, accent.text,
          'text-[10px]'
        )}>
          {detail}
        </span>
      </div>

      {/* Name + description */}
      <h3 className={cn(
        'text-white font-bold mb-2',
        compact ? 'text-base' : 'text-xl'
      )}>
        {activity.name}
      </h3>

      {!compact && (
        <p className="text-white/60 text-sm leading-relaxed flex-1 mb-5">
          {activity.description}
        </p>
      )}

      {/* Price + CTA */}
      <div className={cn(
        'flex items-center justify-between',
        compact ? 'mt-3' : 'mt-auto pt-4 border-t border-white/10'
      )}>
        <div>
          <span className="text-white/50 text-xs">From</span>
          <p className="text-gold font-bold text-lg leading-tight">
            {formatTSh(activity.priceMin)}
          </p>
        </div>

        {showCta && (
          <Link
            href={ROUTES.register(activity.slug)}
            className={cn(
              'inline-flex items-center gap-1.5 text-sm font-semibold',
              'text-gold hover:text-gold-400 transition-colors group-hover:gap-2.5',
              'duration-200'
            )}
          >
            Register
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        )}
      </div>

      {/* Seat cap indicator */}
      <div className="mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
        {/* In real use, fill percentage comes from a query result */}
        <div className="h-full w-1/3 bg-gold/60 rounded-full" aria-hidden />
      </div>
    </div>
  )
}
