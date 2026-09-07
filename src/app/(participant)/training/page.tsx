'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { getMyRegistrations } from '@/lib/supabase/queries/participant'
import { TrainingResources } from '@/components/participant/TrainingResources'
import { ACTIVITY_MAP } from '@/config/activities'
import type { ActivitySlug } from '@/types'

const PLANS: Record<string, { week: string; focus: string; detail: string; intensity: 'Low' | 'Medium' | 'Medium-High' | 'High' }[]> = {
  cyclathon: [
    { week: 'Week 1–2', focus: 'Base endurance',  detail: '3 rides · 15–25 km each',     intensity: 'Low'         },
    { week: 'Week 3–4', focus: 'Distance build',  detail: '3 rides · 25–40 km each',     intensity: 'Medium'      },
    { week: 'Week 5–6', focus: 'Tempo intervals', detail: '2 rides + 1 long · 40–55 km', intensity: 'Medium-High' },
    { week: 'Week 7',   focus: 'Peak long ride',  detail: '1 ride · 55–65 km',           intensity: 'High'        },
    { week: 'Week 8',   focus: 'Taper',           detail: '2 short rides · 20 km each',  intensity: 'Low'         },
  ],
  marathon: [
    { week: 'Week 1–2', focus: 'Easy running',      detail: '4 runs · 5–8 km each',         intensity: 'Low'         },
    { week: 'Week 3–4', focus: 'Build mileage',     detail: '4 runs · 8–14 km each',        intensity: 'Medium'      },
    { week: 'Week 5–6', focus: 'Long run + tempo',  detail: '3 runs + 1 long · 20–28 km',   intensity: 'Medium-High' },
    { week: 'Week 7',   focus: 'Peak long run',     detail: 'Long run · 32 km',             intensity: 'High'        },
    { week: 'Week 8',   focus: 'Taper',             detail: '3 short easy runs',             intensity: 'Low'         },
  ],
  walkathon: [
    { week: 'Week 1–2', focus: 'Daily walks',     detail: '30 min walks · 5×/wk',   intensity: 'Low'    },
    { week: 'Week 3–4', focus: 'Extend distance', detail: '45–60 min · 5×/wk',      intensity: 'Low'    },
    { week: 'Week 5–6', focus: 'Pace work',       detail: 'Brisk 8 km · 3×/wk',    intensity: 'Medium' },
    { week: 'Week 7',   focus: 'Distance day',    detail: '10 km walk at pace',     intensity: 'Medium' },
    { week: 'Week 8',   focus: 'Rest and ready',  detail: 'Easy 3 km walks',        intensity: 'Low'    },
  ],
}

const INTENSITY_STYLES: Record<string, string> = {
  Low:          'bg-emerald-50 text-emerald-700 border border-emerald-100',
  Medium:       'bg-gold/10 text-gold-700 border border-gold/20',
  'Medium-High':'bg-magenta/10 text-magenta border border-magenta/20',
  High:         'bg-magenta/15 text-magenta border border-magenta/25',
}

export default function TrainingPage() {
  const { user }              = useUser()
  const [slug, setSlug]       = useState<ActivitySlug | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getMyRegistrations(user.id).then(({ data }) => {
      const active = data?.find(r => r.status !== 'cancelled')
      setSlug((active?.activity_slug as ActivitySlug) ?? null)
      setLoading(false)
    })
  }, [user])

  const activity = slug ? ACTIVITY_MAP[slug] : null
  const plan     = slug ? PLANS[slug] : null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-navy mb-1">Training</h1>
        <p className="text-navy/50 text-sm">
          {activity
            ? `8-week programme for your ${activity.name}`
            : 'Register for an activity to unlock your training plan.'}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-navy/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : plan ? (
        <>
          {/* Week table */}
          <div className="rounded-2xl border border-navy/12 bg-white overflow-hidden">
            {plan.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4 border-b border-navy/8 last:border-0"
              >
                <div className="w-20 shrink-0">
                  <span className="text-xs font-bold text-navy">{row.week}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-navy mb-0.5">{row.focus}</p>
                  <p className="text-xs text-navy/50">{row.detail}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${INTENSITY_STYLES[row.intensity]}`}>
                  {row.intensity}
                </span>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div>
            <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-3">
              Resources
            </p>
            <TrainingResources activitySlug={slug} />
          </div>
        </>
      ) : (
        <TrainingResources activitySlug={slug} />
      )}
    </div>
  )
}
