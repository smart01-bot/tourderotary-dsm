'use client'

'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PhaseBadge } from '@/components/ui/PhaseBadge'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { RibbonDivider } from '@/components/ui/RibbonDivider'
import { usePhase } from '@/hooks/usePhase'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const { phase, isPostEvent } = usePhase()

  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-navy"
      aria-label="Tour de Rotary DSM hero"
    >
      {/* ── Road-stripe overlay ──────────────────────────────────────────── */}
      <div className="absolute inset-0 road-stripe-overlay pointer-events-none" aria-hidden />

      {/* ── Radial glow — bottom left ────────────────────────────────────── */}
      <div
        className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217,160,23,0.10) 0%, transparent 70%)' }}
        aria-hidden
      />
      {/* ── Radial glow — top right ──────────────────────────────────────── */}
      <div
        className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(233,30,99,0.08) 0%, transparent 70%)' }}
        aria-hidden
      />

      {/* ── Gold road stripe — diagonal accent line ───────────────────────── */}
      <div
        className="absolute top-0 right-0 w-px h-full pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(217,160,23,0.3) 30%, rgba(217,160,23,0.3) 70%, transparent)',
          right: '20%',
          transform: 'skewX(-8deg)',
          width: '2px',
        }}
        aria-hidden
      />
      <div
        className="absolute top-0 right-0 w-px h-full pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(217,160,23,0.15) 30%, rgba(217,160,23,0.15) 70%, transparent)',
          right: 'calc(20% + 10px)',
          transform: 'skewX(-8deg)',
          width: '6px',
        }}
        aria-hidden
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="container-site relative z-10 py-20 lg:py-24">
        <div className="max-w-4xl">

          {/* Phase badge */}
          <div className="animate-fade-in mb-8">
            <PhaseBadge phase={phase} pulse />
          </div>

          {/* Event meta — location + date */}
          <div className="animate-fade-in-up flex flex-wrap items-center gap-4 mb-6" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center gap-1.5 text-white/55 text-sm font-medium">
              <MapPin className="w-4 h-4 text-gold" aria-hidden />
              Dar es Salaam, Tanzania
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden />
            <span className="inline-flex items-center gap-1.5 text-white/55 text-sm font-medium">
              <Calendar className="w-4 h-4 text-gold" aria-hidden />
              1 November 2026
            </span>
          </div>

          {/* Main headline */}
          <div className="animate-fade-in-up mb-4" style={{ animationDelay: '0.15s' }}>
            <h1 className="font-black text-white leading-none tracking-tight">
              <span className="block text-[clamp(2.75rem,8vw,6rem)]">
                Tour de
              </span>
              <span className="block text-[clamp(2.75rem,8vw,6rem)] text-gold">
                Rotary
              </span>
              {/* DSM as bold callout */}
              <span className="block text-[clamp(1.5rem,4vw,2.5rem)] text-white/60 font-semibold tracking-[0.15em] uppercase mt-1">
                Dar es Salaam
              </span>
            </h1>
          </div>

          {/* Tagline */}
          <div className="animate-fade-in-up mb-8" style={{ animationDelay: '0.2s' }}>
            <RibbonDivider className="mb-4 max-w-xs" />
            <p className="text-white/65 text-lg sm:text-xl leading-relaxed max-w-2xl">
              6 activities. One city. A cause that changes lives.{' '}
              <span className="text-white font-semibold">
                Help fund cancer care for Tanzanian families
              </span>{' '}
              — on a bike, on your feet, or on the dance floor.
            </p>
          </div>

          {/* ── Countdown — embedded in hero ───────────────────────────── */}
          {!isPostEvent && (
            <div className="animate-fade-in-up mb-10" style={{ animationDelay: '0.25s' }}>
              <p className="text-eyebrow text-gold/70 mb-4">Until the starting gun</p>
              <CountdownTimer variant="hero" />
            </div>
          )}

          {/* CTA row */}
          <div
            className="animate-fade-in-up flex flex-wrap gap-3"
            style={{ animationDelay: '0.35s' }}
          >
            <Link href="/signup">
              <Button
                variant="primary"
                size="xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Register Now
              </Button>
            </Link>
            <Link href="/activities">
              <Button variant="outline" size="xl">
                See Activities
              </Button>
            </Link>
          </div>

          {/* Trust signal */}
          <p className="mt-5 text-white/35 text-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Organised by Rotaract 4 Compassion · All proceeds fund cancer care in Tanzania
          </p>
        </div>
      </div>

      {/* ── Diagonal bottom edge ─────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white pointer-events-none"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 0)' }}
        aria-hidden
      />
    </section>
  )
}
