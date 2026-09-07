import Link from 'next/link'
import { Bike, Footprints, PersonStanding, Music2, Sunset, Users, Check } from 'lucide-react'
import { cn, formatTSh } from '@/lib/utils'
import { ACTIVITIES } from '@/config/activities'
import type { ActivityConfig } from '@/types'

const ICON_MAP = { Bike, Footprints, PersonStanding, Music2, Sunset, Users } as const
type IconName = keyof typeof ICON_MAP

const COLOR_MAP: Record<string, { icon: string; border: string; badge: string; text: string }> = {
  gold:    { icon: 'bg-gold/15 text-gold-700',   border: 'border-gold',   badge: 'bg-gold/12 text-gold-700',   text: 'text-gold-700'   },
  magenta: { icon: 'bg-magenta/12 text-magenta', border: 'border-magenta',badge: 'bg-magenta/10 text-magenta', text: 'text-magenta'    },
  navy:    { icon: 'bg-navy/8 text-navy',         border: 'border-navy',   badge: 'bg-navy/8 text-navy',         text: 'text-navy'       },
}

interface Props {
  registeredSlug?: string | null
}

export function ActivitySelector({ registeredSlug }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {ACTIVITIES.map(activity => (
        <ActivityOption
          key={activity.slug}
          activity={activity}
          isRegistered={registeredSlug === activity.slug}
          disabled={!!registeredSlug && registeredSlug !== activity.slug}
        />
      ))}
    </div>
  )
}

function ActivityOption({
  activity,
  isRegistered,
  disabled,
}: {
  activity: ActivityConfig
  isRegistered: boolean
  disabled: boolean
}) {
  const Icon    = ICON_MAP[activity.icon as IconName] ?? Bike
  const detail  = activity.distance ?? activity.duration ?? '—'
  const colors  = COLOR_MAP[activity.color] ?? COLOR_MAP.navy

  const card = (
    <div className={cn(
      'group flex flex-col h-full rounded-2xl border-2 p-5 transition-all duration-200',
      isRegistered
        ? `${colors.border} bg-white shadow-sm`
        : disabled
          ? 'border-navy/8 bg-white opacity-40 cursor-not-allowed'
          : 'border-navy/12 bg-white hover:border-navy/30 hover:shadow-sm cursor-pointer'
    )}>

      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2.5 rounded-xl shrink-0', colors.icon)}>
          <Icon size={20} aria-hidden />
        </div>
        {isRegistered && (
          <span className={cn('flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full', colors.badge)}>
            <Check size={10} /> Registered
          </span>
        )}
        {!isRegistered && !disabled && (
          <span className="text-[10px] font-semibold text-navy/40 uppercase tracking-wide">{detail}</span>
        )}
      </div>

      <h3 className="text-navy font-black text-base mb-1">{activity.name}</h3>

      {!isRegistered && (
        <span className="text-[10px] font-semibold text-navy/40 uppercase tracking-wide mb-2">{detail}</span>
      )}

      <p className="text-navy/50 text-xs leading-relaxed flex-1 mb-4 line-clamp-3">
        {activity.description}
      </p>

      <div className="flex items-center justify-between border-t border-navy/8 pt-3.5 mt-auto">
        <div>
          <p className={cn('font-black text-base', colors.text)}>{formatTSh(activity.priceMin)}</p>
          {activity.priceMax && (
            <p className="text-[10px] text-navy/40 mt-0.5">up to {formatTSh(activity.priceMax)} VIP</p>
          )}
        </div>
        {!isRegistered && !disabled && (
          <span className={cn('text-xs font-bold transition-colors', colors.text)}>
            Select →
          </span>
        )}
      </div>
    </div>
  )

  if (isRegistered || disabled) return card

  return (
    <Link href={`/register/${activity.slug}`} className="block h-full">
      {card}
    </Link>
  )
}
