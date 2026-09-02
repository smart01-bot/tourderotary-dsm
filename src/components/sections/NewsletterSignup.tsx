'use client'

import { useState, type FormEvent } from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { newsletterApi } from '@/lib/api'

export function NewsletterSignup() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]     = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)

    const { error: apiError } = await newsletterApi.subscribe(email.trim())

    setLoading(false)

    if (apiError) {
      setError('Something went wrong. Please try again.')
      return
    }

    setDone(true)
    setEmail('')
  }

  return (
    <section
      className="bg-navy py-section"
      aria-labelledby="newsletter-heading"
    >
      <div className="container-site">
        <div className="max-w-2xl mx-auto text-center">

          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-6 h-6 text-gold" aria-hidden />
          </div>

          <p className="text-eyebrow text-gold mb-3">Stay in the loop</p>
          <h2
            id="newsletter-heading"
            className="text-section-heading text-white mb-3"
          >
            Event updates, straight to you.
          </h2>
          <p className="text-white/55 mb-8">
            Training tips, registration reminders, sponsor announcements, and
            everything you need to arrive ready on 1 November 2026.
          </p>

          {done ? (
            <div className="flex items-center justify-center gap-2 text-gold font-semibold text-lg">
              <CheckCircle2 className="w-5 h-5" />
              You're on the list — see you on 1 November!
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              noValidate
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="
                  flex-1 px-4 py-3 rounded-xl bg-white/8 border border-white/15
                  text-white placeholder:text-white/35 text-sm
                  focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
                  transition-all
                "
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
              >
                Subscribe
              </Button>
            </form>
          )}

          {error && (
            <p role="alert" className="mt-3 text-magenta text-sm">{error}</p>
          )}

          <p className="mt-4 text-white/30 text-xs">
            No spam, ever. Unsubscribe any time.
          </p>
        </div>
      </div>
    </section>
  )
}
