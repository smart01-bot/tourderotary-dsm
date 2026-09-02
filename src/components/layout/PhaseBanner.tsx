'use client'

import Link from 'next/link'
import { usePhase } from '@/hooks/usePhase'
import { cn } from '@/lib/utils'

const bannerConfig = {
  pre_event: {
    bg:   'bg-gold',
    text: 'text-navy',
    message: '🎯 Registration is open — secure your spot for 1 November 2026.',
    cta:    { label: 'Register now', href: '/signup' },
  },
  event_day: {
    bg:   'bg-magenta',
    text: 'text-white',
    message: '🚴 Tour de Rotary DSM is happening today! Follow along live.',
    cta:    null,
  },
  post_event: {
    bg:   'bg-navy',
    text: 'text-white',
    message: '🏅 The event is complete. Thank you for riding with us.',
    cta:    { label: 'View results', href: '/about' },
  },
}

export function PhaseBanner() {
  const { phase, loading } = usePhase()

  if (loading) return null

  const config = bannerConfig[phase]

  return (
    <div
      className={cn(
        'w-full py-2 px-4 text-center text-sm font-semibold',
        config.bg, config.text
      )}
      role="banner"
      aria-label="Event phase status"
    >
      <span>{config.message}</span>
      {config.cta && (
        <Link
          href={config.cta.href}
          className={cn(
            'ml-3 underline underline-offset-2 hover:no-underline transition-all font-bold'
          )}
        >
          {config.cta.label} →
        </Link>
      )}
    </div>
  )
}
