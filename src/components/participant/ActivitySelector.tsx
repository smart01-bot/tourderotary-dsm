import Link from 'next/link'
import { Bike, Footprints, PersonStanding, Music2, Sunset, Users } from 'lucide-react'
import { cn, formatTSh } from '@/lib/utils'
import { ACTIVITIES } from '@/config/activities'
import type { ActivityConfig } from '@/types'

const ICON_MAP = { Bike, Footprints, PersonStanding, Music2, Sunset, Users } as const
type IconName = keyof typeof ICON_MAP

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
  const Icon   = ICON_MAP[activity.icon as IconName] ?? Bike
  const detail = activity.distance ?? activity.duration ?? '—'

  const card = (
    <div className={cn(
      'group flex flex-col h-full rounded-2xl border-2 p-5 transition-all duration-200',
      isRegistered
        ? 'border-gold bg-gold/5'
        : disabled
          ? 'border-navy/8 bg-navy/2 opacity-50 cursor-not-allowed'
          : 'border-navy/12 bg-white hover:border-gold/50 hover:shadow-card-gold cursor-pointer'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-navy/8">
          <Icon size={20} className="text-navy" />
        </div>
        <span className="text-[10px] font-semibold text-navy/45 uppercase tracking-wide">{detail}</span>
      </div>

      <h3 className="text-navy font-bold text-base mb-1">{activity.name}</h3>
      <p className="text-navy/50 text-xs leading-relaxed flex-1 mb-4 line-clamp-2">
        {activity.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <p className="text-gold font-bold text-sm">{formatTSh(activity.priceMin)}</p>
        {isRegistered ? (
          <span className="text-xs font-semibold text-gold bg-gold/10 px-2.5 py-1 rounded-full">
            ✓ Registered
          </span>
        ) : !disabled ? (
          <span className="text-xs font-semibold text-navy/50 group-hover:text-gold transition-colors">
            Select →
          </span>
        ) : null}
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
