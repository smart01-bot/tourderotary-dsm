import { ExternalLink } from 'lucide-react'
import type { ActivitySlug } from '@/types'

interface Resource { label: string; url: string; description: string }

const RESOURCES: Partial<Record<ActivitySlug, Resource[]>> = {
  cyclathon: [
    { label: 'Cycling for Beginners — Strava',        url: 'https://www.strava.com/features',                description: '8-week plan for 60 km'        },
    { label: 'Bike Safety Checks — Park Tool',         url: 'https://www.parktool.com/en-us/blog/repair-help', description: 'Pre-ride maintenance'          },
    { label: 'Nutrition for Endurance Rides',          url: 'https://www.velopress.com',                       description: 'Fuelling on the road'          },
  ],
  marathon: [
    { label: 'AIMS Marathon Training Plans',           url: 'https://www.aimsworldrunning.org',               description: 'Official marathon prep'        },
    { label: 'Race Day Nutrition & Hydration',         url: 'https://www.runnersworld.com',                   description: 'What to eat & drink'           },
  ],
  walkathon: [
    { label: '10 km Walkathon Guide',                  url: 'https://www.walkingforhealth.org.uk',            description: 'Prepare for 10 km'             },
    { label: 'Walking Technique & Posture',            url: 'https://www.nhs.uk/live-well/exercise',          description: 'Pace and form tips'            },
  ],
  zumba: [
    { label: 'Zumba Basics — Official',                url: 'https://www.zumba.com',                          description: 'Get familiar with the moves'   },
  ],
  yoga: [
    { label: 'Sunrise Flow — Beginner Sequence',       url: 'https://www.yogajournal.com',                    description: 'Morning flow for all levels'   },
  ],
  community_walk: [
    { label: 'Community Walk Tips',                    url: 'https://www.walkingforhealth.org.uk',            description: 'Everyone can join'             },
  ],
}

interface Props { activitySlug?: ActivitySlug | null }

export function TrainingResources({ activitySlug }: Props) {
  if (!activitySlug) {
    return (
      <p className="text-sm text-navy/50">
        Register for an activity to see your personalised training resources.
      </p>
    )
  }

  const resources = RESOURCES[activitySlug] ?? []

  if (!resources.length) {
    return <p className="text-sm text-navy/50">Resources coming soon — check back closer to the event.</p>
  }

  return (
    <ul className="space-y-3">
      {resources.map(r => (
        <li key={r.url}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-4 p-4 rounded-xl border border-navy/10 bg-white
                       hover:border-gold/40 hover:shadow-card-gold transition-all duration-150 group"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy group-hover:text-gold transition-colors truncate">
                {r.label}
              </p>
              <p className="text-xs text-navy/50 mt-0.5">{r.description}</p>
            </div>
            <ExternalLink size={15} className="text-navy/30 group-hover:text-gold shrink-0 mt-0.5 transition-colors" />
          </a>
        </li>
      ))}
    </ul>
  )
}
