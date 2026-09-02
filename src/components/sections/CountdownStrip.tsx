'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { Button } from '@/components/ui/Button'
import { usePhase } from '@/hooks/usePhase'

export function CountdownStrip() {
  const { isPostEvent } = usePhase()

  if (isPostEvent) return null

  return (
    <section
      className="bg-gold py-12"
      aria-label="Countdown to event"
    >
      <div className="container-site">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Left */}
          <div>
            <p className="text-eyebrow text-navy/60 mb-2">
              1 November 2026 · Dar es Salaam
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-navy leading-tight">
              The clock is running.{' '}
              <span className="text-navy/60">Are you ready?</span>
            </h2>
          </div>

          {/* Countdown */}
          <div>
            <CountdownTimer variant="strip" />
          </div>

          {/* CTA */}
          <Link href="/signup">
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Secure your spot
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
