'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { getMyRegistrations } from '@/lib/supabase/queries/participant'
import { TrainingResources } from '@/components/participant/TrainingResources'
import { ACTIVITY_MAP } from '@/config/activities'
import type { ActivitySlug } from '@/types'

export default function TrainingPage() {
  const { user }                         = useUser()
  const [slug,    setSlug]               = useState<ActivitySlug | null>(null)
  const [loading, setLoading]            = useState(true)

  useEffect(() => {
    if (!user) return
    getMyRegistrations(user.id).then(({ data }) => {
      const active = data?.find(r => r.status !== 'cancelled')
      setSlug((active?.activity_slug as ActivitySlug) ?? null)
      setLoading(false)
    })
  }, [user])

  const activity = slug ? ACTIVITY_MAP[slug] : null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-display-sm font-black text-navy mb-1">Training</h1>
        <p className="text-navy/50 text-sm">
          {activity ? `Resources for your ${activity.name}` : 'Register to unlock your training resources.'}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-navy/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <TrainingResources activitySlug={slug} />
      )}
    </div>
  )
}
