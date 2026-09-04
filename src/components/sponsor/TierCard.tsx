import { CheckCircle2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatTSh } from '@/lib/utils'
import { TIER_META, type SponsorTierSlug } from '@/lib/supabase/queries/sponsor'

interface TierCardProps {
  tier:       SponsorTierSlug
  amountTsh:  number
  name:       string
  className?: string
}

const TIER_ACCENT: Record<SponsorTierSlug, string> = {
  platinum: 'border-navy bg-gradient-to-br from-navy to-navy-700',
  gold:     'border-gold bg-gradient-to-br from-gold-600 to-gold-500',
  silver:   'border-navy-200 bg-gradient-to-br from-navy-100 to-navy-50',
  bronze:   'border-gold-200 bg-gradient-to-br from-gold-100 to-gold-50',
}

const BADGE_STYLE: Record<SponsorTierSlug, string> = {
  platinum: 'bg-gold text-navy',
  gold:     'bg-navy text-gold',
  silver:   'bg-navy text-white',
  bronze:   'bg-gold-600 text-white',
}

const TEXT_DARK: Record<SponsorTierSlug, boolean> = {
  platinum: false,
  gold:     false,
  silver:   true,
  bronze:   true,
}

export function TierCard({ tier, amountTsh, name, className }: TierCardProps) {
  const meta   = TIER_META[tier]
  const isDark = !TEXT_DARK[tier]

  return (
    <div
      className={cn(
        'rounded-2xl border-2 p-6 shadow-card-navy',
        TIER_ACCENT[tier],
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2',
              BADGE_STYLE[tier]
            )}
          >
            <Star size={11} className="shrink-0" aria-hidden />
            {meta.label} Sponsor
          </span>
          <h2 className={cn(
            'text-xl font-black leading-tight',
            isDark ? 'text-white' : 'text-navy'
          )}>
            {name}
          </h2>
        </div>
        <div className={cn(
          'text-right shrink-0',
          isDark ? 'text-white/80' : 'text-navy/70'
        )}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5">Contribution</p>
          <p className={cn(
            'text-lg font-black',
            isDark ? 'text-gold' : 'text-navy'
          )}>
            {formatTSh(amountTsh)}
          </p>
        </div>
      </div>

      {/* Perks */}
      <div className={cn(
        'rounded-xl p-4',
        isDark ? 'bg-white/8' : 'bg-navy/6'
      )}>
        <p className={cn(
          'text-[10px] font-black uppercase tracking-widest mb-3',
          isDark ? 'text-white/50' : 'text-navy/50'
        )}>
          Your sponsorship includes
        </p>
        <ul className="space-y-2">
          {meta.perks.map((perk) => (
            <li key={perk} className="flex items-start gap-2">
              <CheckCircle2
                size={14}
                className={cn(
                  'mt-0.5 shrink-0',
                  isDark ? 'text-gold' : 'text-navy'
                )}
                aria-hidden
              />
              <span className={cn(
                'text-sm font-medium leading-snug',
                isDark ? 'text-white/80' : 'text-navy/80'
              )}>
                {perk}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
