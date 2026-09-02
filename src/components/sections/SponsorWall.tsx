import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SponsorTier } from '@/types'

// Placeholder sponsor data — replaced by Supabase query in production
const PLACEHOLDER_SPONSORS: Array<{ name: string; tier: SponsorTier }> = [
  { name: 'Platinum Partner',  tier: 'platinum' },
  { name: 'Gold Sponsor A',    tier: 'gold'     },
  { name: 'Gold Sponsor B',    tier: 'gold'     },
  { name: 'Silver Sponsor A',  tier: 'silver'   },
  { name: 'Silver Sponsor B',  tier: 'silver'   },
  { name: 'Silver Sponsor C',  tier: 'silver'   },
  { name: 'Bronze Sponsor A',  tier: 'bronze'   },
  { name: 'Bronze Sponsor B',  tier: 'bronze'   },
]

const tierHeights: Record<SponsorTier, string> = {
  platinum: 'h-14',
  gold:     'h-10',
  silver:   'h-8',
  bronze:   'h-7',
  partner:  'h-7',
}

const tierOpacity: Record<SponsorTier, string> = {
  platinum: 'opacity-90',
  gold:     'opacity-75',
  silver:   'opacity-60',
  bronze:   'opacity-50',
  partner:  'opacity-45',
}

export function SponsorWall() {
  const platinum = PLACEHOLDER_SPONSORS.filter(s => s.tier === 'platinum')
  const gold     = PLACEHOLDER_SPONSORS.filter(s => s.tier === 'gold')
  const silver   = PLACEHOLDER_SPONSORS.filter(s => s.tier === 'silver')
  const bronze   = PLACEHOLDER_SPONSORS.filter(s => s.tier === 'bronze' || s.tier === 'partner')

  return (
    <section
      className="bg-navy/4 border-y border-navy/8 py-section-sm"
      aria-labelledby="sponsor-wall-heading"
    >
      <div className="container-site">

        <div className="text-center mb-10">
          <p className="text-eyebrow text-gold mb-2">Our sponsors</p>
          <h2
            id="sponsor-wall-heading"
            className="text-section-heading text-navy"
          >
            Supported by those who care
          </h2>
          <p className="text-navy/50 text-sm mt-2 max-w-md mx-auto">
            Thank you to every organisation making Tour de Rotary DSM possible.
          </p>
        </div>

        {/* Platinum row */}
        {platinum.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {platinum.map(s => (
              <SponsorSlot key={s.name} name={s.name} tier={s.tier} />
            ))}
          </div>
        )}

        {/* Gold row */}
        {gold.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {gold.map(s => (
              <SponsorSlot key={s.name} name={s.name} tier={s.tier} />
            ))}
          </div>
        )}

        {/* Silver + bronze row */}
        <div className="flex flex-wrap justify-center gap-5 items-center">
          {[...silver, ...bronze].map(s => (
            <SponsorSlot key={s.name} name={s.name} tier={s.tier} />
          ))}
        </div>

        {/* Become a sponsor CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/sponsors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-600 transition-colors group"
          >
            View sponsorship packages
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}

function SponsorSlot({ name, tier }: { name: string; tier: SponsorTier }) {
  return (
    <div
      className={`
        flex items-center justify-center
        px-6 py-3 rounded-card border border-navy/10 bg-white
        ${tierHeights[tier]} ${tierOpacity[tier]}
        hover:opacity-100 transition-opacity duration-200
        min-w-[120px] max-w-[200px]
      `}
      title={`${name} — ${tier}`}
      aria-label={name}
    >
      {/* Logo placeholder — replace with <Image src={s.logoUrl} /> when data is loaded */}
      <span className="text-navy/40 text-xs font-medium text-center leading-tight">
        {name}
      </span>
    </div>
  )
}
