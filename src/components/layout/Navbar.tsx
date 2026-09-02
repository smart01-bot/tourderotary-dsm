'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'
import { usePhase } from '@/hooks/usePhase'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { PUBLIC_NAV, SITE } from '@/config/site'

// Phase-aware CTA
function NavCta() {
  const { isPreEvent, isEventDay, isPostEvent } = usePhase()

  if (isEventDay) {
    return (
      <Link href="/dashboard">
        <Button variant="primary" size="sm">
          My Portal
        </Button>
      </Link>
    )
  }

  if (isPostEvent) {
    return (
      <Link href="/about">
        <Button variant="outline" size="sm">
          View Results
        </Button>
      </Link>
    )
  }

  // isPreEvent (default)
  return (
    <Link href="/signup">
      <Button variant="primary" size="sm">
        Register Now
      </Button>
    </Link>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphism bar */}
      <nav
        className="bg-navy/95 backdrop-blur-md border-b border-white/8"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16">

            {/* Logo / wordmark */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label={SITE.name}
            >
              {/* Wordmark — replace with <Image> when logo asset is ready */}
              <div className="flex flex-col leading-none">
                <span className="text-gold font-black text-sm tracking-widest uppercase">
                  Tour de Rotary
                </span>
                <span className="text-white/60 font-semibold text-[10px] tracking-[0.2em] uppercase -mt-0.5">
                  DSM · Ride Together
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {PUBLIC_NAV.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium text-white/75',
                    'hover:text-white hover:bg-white/8 transition-all duration-150'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-white/75 hover:text-white transition-colors"
                >
                  My Portal
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/75 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
              )}
              <NavCta />
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/8 transition-all"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/8 bg-navy">
            <div className="container-site py-4 flex flex-col gap-1">
              {PUBLIC_NAV.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3 py-3 rounded-lg',
                    'text-sm font-medium text-white/75 hover:text-white hover:bg-white/8 transition-all'
                  )}
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 opacity-40" aria-hidden />
                </Link>
              ))}

              <div className="pt-3 border-t border-white/8 mt-1 flex flex-col gap-2">
                {!user && (
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="md" fullWidth>
                      Sign in
                    </Button>
                  </Link>
                )}
                <NavCta />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
