'use client'

import { useEffect, useRef, useState } from 'react'
import { cn, formatTSh, formatNumber } from '@/lib/utils'
import { FUNDRAISING_TARGET_TSH } from '@/lib/constants'

interface Stat {
  value: number
  suffix: string
  label: string
  sub: string
  format?: 'number' | 'tsh'
}

const STATS: Stat[] = [
  {
    value:  2650,
    suffix: '+',
    label:  'Participants',
    sub:    'target across all 6 activities',
    format: 'number',
  },
  {
    value:  FUNDRAISING_TARGET_TSH,
    suffix: '',
    label:  'Fundraising Goal',
    sub:    'direct to cancer treatment funds',
    format: 'tsh',
  },
  {
    value:  6,
    suffix: '',
    label:  'Activities',
    sub:    'from cycling to community walk',
    format: 'number',
  },
  {
    value:  100,
    suffix: '%',
    label:  'Proceeds',
    sub:    'to Rotaract 4 Compassion cancer fund',
    format: 'number',
  },
]

function useCountUp(target: number, duration = 1800, start = false) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!start) return
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [target, duration, start])

  return start ? current : 0
}

function StatItem({ stat, animate }: { stat: Stat; animate: boolean }) {
  const value = useCountUp(stat.value, 1800, animate)

  const display =
    stat.format === 'tsh'
      ? formatTSh(value, true)
      : `${formatNumber(value)}${stat.suffix}`

  return (
    <div className="text-center px-4">
      <p
        className="text-4xl sm:text-5xl font-black text-gold tabular-nums leading-none mb-1"
        aria-label={`${stat.label}: ${stat.format === 'tsh' ? formatTSh(stat.value, true) : stat.value + stat.suffix}`}
      >
        {display}
      </p>
      <p className="text-white font-bold text-base mb-1">{stat.label}</p>
      <p className="text-white/45 text-xs leading-snug max-w-[150px] mx-auto">{stat.sub}</p>
    </div>
  )
}

export function ImpactNumbers() {
  const ref = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="bg-navy-900 py-section border-y border-white/8"
      aria-labelledby="impact-numbers-heading"
      ref={ref}
    >
      <div className="container-site">
        <div className="text-center mb-12">
          <p className="text-eyebrow text-gold mb-3">The numbers</p>
          <h2
            id="impact-numbers-heading"
            className="text-section-heading text-white"
          >
            Built to make a{' '}
            <span className="text-magenta">real difference</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y-0 lg:divide-x lg:divide-white/10">
          {STATS.map(stat => (
            <StatItem key={stat.label} stat={stat} animate={animated} />
          ))}
        </div>
      </div>
    </section>
  )
}
