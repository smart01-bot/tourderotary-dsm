import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ActivityCard } from '@/components/ui/ActivityCard'
import { ACTIVITIES } from '@/config/activities'

export function ActivityGrid() {
  return (
    <section
      className="bg-navy py-section"
      aria-labelledby="activity-grid-heading"
    >
      <div className="container-site">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <p className="text-eyebrow text-gold mb-3">Choose your challenge</p>
            <h2
              id="activity-grid-heading"
              className="text-section-heading text-white"
            >
              6 ways to make{' '}
              <span className="text-gold">an impact</span>
            </h2>
          </div>
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-400 transition-colors whitespace-nowrap group"
          >
            All activities
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        {/* Activity grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACTIVITIES.map(activity => (
            <ActivityCard
              key={activity.slug}
              activity={activity}
              showCta
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <p className="mt-8 text-center text-white/40 text-sm">
          Can't decide?{' '}
          <Link href="/activities" className="text-gold hover:underline font-medium">
            Compare all activities in detail →
          </Link>
        </p>
      </div>
    </section>
  )
}
