import { ExternalLink, Eye } from 'lucide-react'
import type { ActivitySlug } from '@/types'

interface Resource { label: string; url: string; description: string }

const RESOURCES: Partial<Record<ActivitySlug, Resource[]>> = {
  cyclathon: [
    { label: 'Cycling for Beginners — Strava',   url: 'https://www.strava.com/features',              description: '8-week plan for 60 km'       },
    { label: 'Bike Safety Checks — Park Tool',    url: 'https://www.parktool.com/en-us/blog/repair-help', description: 'Pre-ride maintenance'         },
    { label: 'Nutrition for Endurance Rides',     url: 'https://www.velopress.com',                     description: 'Fuelling on the road'         },
    { label: 'Hydration strategy guide',          url: 'https://www.runnersworld.com',                  description: 'What to drink and when'       },
  ],
  marathon: [
    { label: 'AIMS Marathon Training Plans',      url: 'https://www.aimsworldrunning.org',              description: 'Official marathon prep'        },
    { label: 'Race Day Nutrition & Hydration',    url: 'https://www.runnersworld.com',                  description: 'What to eat & drink'           },
    { label: 'Strength training for runners',     url: 'https://www.runnersworld.com',                  description: 'Injury prevention'             },
  ],
  walkathon: [
    { label: '10 km Walkathon Guide',             url: 'https://www.walkingforhealth.org.uk',           description: 'Prepare for 10 km'             },
    { label: 'Walking Technique & Posture',       url: 'https://www.nhs.uk/live-well/exercise',         description: 'Pace and form tips'            },
  ],
  zumba: [
    { label: 'Zumba Basics — Official',           url: 'https://www.zumba.com',                         description: 'Get familiar with the moves'   },
  ],
  yoga: [
    { label: 'Sunrise Flow — Beginner Sequence',  url: 'https://www.yogajournal.com',                   description: 'Morning flow for all levels'   },
  ],
  community_walk: [
    { label: 'Community Walk Tips',               url: 'https://www.walkingforhealth.org.uk',           description: 'Everyone can join'             },
  ],
}

interface Props { activitySlug?: ActivitySlug | null }

export function TrainingResources({ activitySlug }: Props) {
  if (!activitySlug) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-white px-5 py-10 text-center">
        <p className="text-sm text-navy/50">
          Register for an activity to see your personalised training resources.
        </p>
      </div>
    )
  }

  const resources = RESOURCES[activitySlug] ?? []

  if (!resources.length) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-white px-5 py-10 text-center">
        <p className="text-sm text-navy/50">
          Resources coming soon — check back closer to the event.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-navy/12 bg-white overflow-hidden">
      {resources.map((r, i) => (
        <a
          key={r.url + i}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 px-5 py-4
                     border-b border-navy/8 last:border-0
                     hover:bg-[#F7F6F3] transition-colors group"
        >
          <div className="min-w-0">
            <p className="text-sm font-bold text-navy group-hover:text-gold transition-colors truncate">
              {r.label}
            </p>
            <p className="text-xs text-navy/45 mt-0.5">{r.description}</p>
          </div>
          <ExternalLink
            size={15}
            className="text-navy/25 group-hover:text-gold shrink-0 transition-colors"
          />
        </a>
      ))}
    </div>
  )
}
