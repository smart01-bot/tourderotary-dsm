'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from './FormField'
import { signIn, portalRedirect } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'
import type { UserRole } from '@/types'

export function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const next         = searchParams.get('next')
  const justVerified = searchParams.get('verified') === '1'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await signIn(email.trim().toLowerCase(), password)

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Fetch role and redirect to the right portal
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const redirectTo = next ?? portalRedirect((profile?.role as UserRole) ?? null)
      router.replace(redirectTo)
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-display-sm font-black text-navy mb-1">Welcome back</h1>
        <p className="text-navy/50 text-sm">Sign in to your account to continue.</p>
      </div>

      {justVerified && (
        <div className="flex items-start gap-3 mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
          <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 font-medium">
            Account created — check your email to confirm, then sign in.
          </p>
        </div>
      )}

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

        <FormField
          label="Password"
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
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

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Link
            href="/reset-password"
            className="text-xs font-semibold text-gold hover:text-gold-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy/50">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-navy hover:text-gold transition-colors">
          Create one
        </Link>
      </p>
    </div>
  )
}
