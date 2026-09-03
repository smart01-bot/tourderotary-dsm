'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { usePhase } from '@/hooks/usePhase'
import { getMyRegistrations } from '@/lib/supabase/queries/participant'
import { ActivitySelector } from '@/components/participant/ActivitySelector'

export default function RegisterPage() {
  const { user }                       = useUser()
  const { isPreEvent }                 = usePhase()
  const [registeredSlug, setSlug]      = useState<string | null>(null)
  const [loading,        setLoading]   = useState(true)

  useEffect(() => {
    if (!user) return
    getMyRegistrations(user.id).then(({ data }) => {
      const active = data?.find(r => r.status !== 'cancelled')
      setSlug(active?.activity_slug ?? null)
      setLoading(false)
    })
  }, [user])

  if (!isPreEvent) {
    return (
      <div className="py-20 text-center max-w-sm mx-auto">
        <p className="text-display-sm font-black text-navy mb-2">Registration closed</p>
        <p className="text-navy/50 text-sm">The registration window has ended.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-display-sm font-black text-navy mb-1">Choose your activity</h1>
        <p className="text-navy/50 text-sm">
          {registeredSlug
            ? 'You are already registered for one activity.'
            : 'Select the activity you want to participate in.'}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-navy/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <ActivitySelector registeredSlug={registeredSlug} />
      )}
    </div>
  )
}
