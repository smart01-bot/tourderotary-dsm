'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from './FormField'
import { sendPasswordReset } from '@/lib/supabase/auth'

export function ResetPasswordForm() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setError(null)
    setLoading(true)

    const { error: resetError } = await sendPasswordReset(email.trim().toLowerCase())

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 mb-6">
          <CheckCircle className="text-gold" size={32} />
        </div>
        <h1 className="text-display-sm font-black text-navy mb-2">Check your inbox</h1>
        <p className="text-navy/50 text-sm leading-relaxed mb-8">
          We sent a reset link to{' '}
          <strong className="text-navy font-semibold">{email}</strong>. Check
          your spam folder if you don&apos;t see it within a minute.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-display-sm font-black text-navy mb-1">Reset password</h1>
        <p className="text-navy/50 text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Send reset link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/50 hover:text-navy transition-colors"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
