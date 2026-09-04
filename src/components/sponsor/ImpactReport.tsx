import { Users, CheckCircle2, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ImpactStats } from '@/lib/supabase/queries/sponsor'

const ACTIVITY_LABELS: Record<string, string> = {
  cyclathon:      'Cyclathon',
  marathon:       'Marathon',
  walkathon:      'Walkathon',
  zumba:          'Zumba',
  yoga:           'Yoga',
  community_walk: 'Community Walk',
}

interface ImpactReportProps {
  stats:      ImpactStats
  className?: string
}

export function ImpactReport({ stats, className }: ImpactReportProps) {
  const { total_registrations, paid_registrations, by_activity } = stats

  const conversionPct = total_registrations > 0
    ? Math.round((paid_registrations / total_registrations) * 100)
    : 0

  const maxCount = Math.max(...by_activity.map(a => a.count), 1)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Top stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox
          icon={<Users size={18} />}
          label="Total Registered"
          value={total_registrations.toLocaleString()}
          accent="navy"
        />
        <StatBox
          icon={<CheckCircle2 size={18} />}
          label="Paid Participants"
          value={paid_registrations.toLocaleString()}
          accent="gold"
        />
        <StatBox
          icon={<TrendingUp size={18} />}
          label="Conversion Rate"
          value={`${conversionPct}%`}
          accent="magenta"
        />
      </div>

      {/* Activity breakdown */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-card-navy">
        <h3 className="text-sm font-black text-navy uppercase tracking-wider mb-5">
          Participation by Activity
        </h3>
        <div className="space-y-4">
          {by_activity.length === 0 ? (
            <p className="text-sm text-navy/40 font-medium text-center py-4">
              Registration data will appear here once the event opens.
            </p>
          ) : (
            by_activity
              .sort((a, b) => b.count - a.count)
              .map(({ activity_slug, count }) => {
                const pct = Math.round((count / maxCount) * 100)
                return (
                  <div key={activity_slug}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-navy">
                        {ACTIVITY_LABELS[activity_slug] ?? activity_slug}
                      </span>
                      <span className="text-sm font-black text-navy">
                        {count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
          )}
        </div>
      </div>
    </div>
  )
}

// ── Internal stat box ───────────────────────────────────────────────────────

interface StatBoxProps {
  icon:   React.ReactNode
  label:  string
  value:  string
  accent: 'navy' | 'gold' | 'magenta'
}

const ACCENT_MAP = {
  navy:    { icon: 'text-navy bg-navy-50',     value: 'text-navy'    },
  gold:    { icon: 'text-gold-600 bg-gold-50', value: 'text-gold-700' },
  magenta: { icon: 'text-magenta bg-magenta-50', value: 'text-magenta' },
}

function StatBox({ icon, label, value, accent }: StatBoxProps) {
  const styles = ACCENT_MAP[accent]
  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-5 shadow-card-navy">
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', styles.icon)}>
        {icon}
      </div>
      <p className="text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">{label}</p>
      <p className={cn('text-2xl font-black', styles.value)}>{value}</p>
    </div>
  )
}
