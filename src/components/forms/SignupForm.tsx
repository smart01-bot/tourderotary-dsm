'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from './FormField'
import { signUp } from '@/lib/supabase/auth'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

const ROLE_OPTIONS: { value: UserRole; label: string; emoji: string }[] = [
  { value: 'participant', label: 'Participant', emoji: '🏃' },
  { value: 'volunteer',   label: 'Volunteer',   emoji: '🙌' },
  { value: 'sponsor',     label: 'Sponsor',     emoji: '🏢' },
  { value: 'partner',     label: 'Partner',     emoji: '🤝' },
]

export function SignupForm() {
  const router = useRouter()

  const [fullName,     setFullName]     = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
  const [role,         setRole]         = useState<UserRole>('participant')
  const [password,     setPassword]     = useState('')
  const [confirm,      setConfirm]      = useState('')
  const [showPass,     setShowPass]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [fieldErrors,  setFieldErrors]  = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!fullName.trim())     errs.fullName = 'Full name is required'
    if (!email.trim())        errs.email    = 'Email is required'
    if (password.length < 8)  errs.password = 'Minimum 8 characters'
    if (password !== confirm)  errs.confirm  = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setFieldErrors({})
    setLoading(true)

    const { error: authError } = await signUp(
      email.trim().toLowerCase(),
      password,
      fullName.trim(),
      phone.trim(),
      role
    )

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.replace('/login?verified=1')
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-display-sm font-black text-navy mb-1">Create account</h1>
        <p className="text-navy/50 text-sm">Join Tour de Rotary DSM and make a difference.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          error={fieldErrors.fullName}
          autoComplete="name"
          required
        />

        <FormField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={fieldErrors.email}
          autoComplete="email"
          required
        />

        <FormField
          label="Phone number"
          type="tel"
          placeholder="+255 7XX XXX XXX"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          autoComplete="tel"
          hint="Optional — for event communications"
        />

        {/* Role pills */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-navy">I am a…</p>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left',
                  'transition-all duration-150',
                  role === opt.value
                    ? 'border-gold bg-gold/8 text-navy'
                    : 'border-navy/15 bg-white text-navy/55 hover:border-navy/30 hover:text-navy/70'
                )}
              >
                <span className="text-base leading-none shrink-0">{opt.emoji}</span>
                <span className={cn(
                  'text-xs font-semibold',
                  role === opt.value ? 'text-navy' : 'text-navy/65'
                )}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <FormField
          label="Password"
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={fieldErrors.password}
          autoComplete="new-password"
          hint="Minimum 8 characters"
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="text-navy/40 hover:text-navy transition-colors"
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <FormField
          label="Confirm password"
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          error={fieldErrors.confirm}
          autoComplete="new-password"
          required
        />

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create account
        </Button>

        <p className="text-xs text-center text-navy/40 leading-relaxed">
          By signing up you agree to our{' '}
          <Link href="/terms" className="underline hover:text-navy transition-colors">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-navy transition-colors">Privacy Policy</Link>.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-navy/50">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-navy hover:text-gold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
