'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { ACTIVITY_MAP } from '@/config/activities'
import { createRegistration, getMyRegistrations } from '@/lib/supabase/queries/participant'
import { PaymentSummary } from '@/components/participant/PaymentSummary'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatTSh } from '@/lib/utils'
import { Bike, Footprints, PersonStanding, Music2, Sunset, Users } from 'lucide-react'
import type { ActivitySlug } from '@/types'

const ICON_MAP = { Bike, Footprints, PersonStanding, Music2, Sunset, Users } as const
type IconName = keyof typeof ICON_MAP

export default function ActivityRegisterPage() {
  const params   = useParams()
  const router   = useRouter()
  const { user } = useUser()

  const slug     = params.activity as string
  const activity = ACTIVITY_MAP[slug]

  const [alreadyRegistered, setAlreadyReg] = useState(false)
  const [loading,           setLoading]    = useState(false)
  const [checking,          setChecking]   = useState(true)
  const [error,             setError]      = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getMyRegistrations(user.id).then(({ data }) => {
      const active = data?.find(r => r.status !== 'cancelled')
      if (active) setAlreadyReg(true)
      setChecking(false)
    })
  }, [user])

  if (!activity) {
    return (
      <div className="py-20 text-center max-w-sm mx-auto">
        <p className="text-display-sm font-black text-navy mb-4">Activity not found</p>
        <Link href="/register"><Button variant="ghost" size="sm">← Back to activities</Button></Link>
      </div>
    )
  }

  const Icon   = ICON_MAP[activity.icon as IconName] ?? Bike
  const detail = activity.distance ?? activity.duration ?? '—'

  const handleRegister = async () => {
    if (!user) return
    setError(null)
    setLoading(true)

    const { error: regError } = await createRegistration(user.id, slug as ActivitySlug)

    if (regError) {
      setError(regError.message)
      setLoading(false)
      return
    }

    router.replace('/dashboard')
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link
        href="/register"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/50 hover:text-navy transition-colors"
      >
        <ArrowLeft size={15} />
        All activities
      </Link>

      {/* Activity card */}
      <div className="rounded-2xl border border-navy/12 bg-white p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-navy/8 shrink-0">
            <Icon size={24} className="text-navy" />
          </div>
          <div>
            <h1 className="text-display-sm font-black text-navy leading-tight">{activity.name}</h1>
            <Badge variant="gold" className="mt-1">{detail}</Badge>
          </div>
        </div>
        <p className="text-navy/60 text-sm leading-relaxed mb-3">{activity.description}</p>
        <p className="text-xs text-navy/35">Capacity: {activity.seatCap} participants</p>
      </div>

      {/* Payment summary */}
      <PaymentSummary activity={activity} />

      {/* CTA */}
      {checking ? null : alreadyRegistered ? (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700 font-medium">
          You already have an active registration.{' '}
          <Link href="/dashboard" className="underline font-bold">View on dashboard</Link>.
        </div>
      ) : (
        <div className="space-y-3">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}
          <Button fullWidth size="lg" variant="secondary" onClick={handleRegister} loading={loading}>
            Confirm registration — {formatTSh(activity.priceMin)}
          </Button>
          <p className="text-xs text-center text-navy/40">
            Your spot is reserved on confirmation. Payment collected in the next step.
          </p>
        </div>
      )}
    </div>
  )
}
