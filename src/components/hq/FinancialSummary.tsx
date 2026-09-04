import { formatTSh } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { FinancialRow } from '@/lib/supabase/queries/admin'

const ACTIVITY_LABELS: Record<string, string> = {
  cyclathon:      'Cyclathon',
  marathon:       'Marathon',
  walkathon:      'Walkathon',
  zumba:          'Zumba',
  yoga:           'Yoga',
  community_walk: 'Community Walk',
}

interface FinancialSummaryProps {
  rows:       FinancialRow[]
  className?: string
}

export function FinancialSummary({ rows, className }: FinancialSummaryProps) {
  const totalRevenue = rows.reduce((s, r) => s + r.revenue_tsh, 0)
  const totalRegs    = rows.reduce((s, r) => s + r.registrations, 0)
  const maxRevenue   = Math.max(...rows.map(r => r.revenue_tsh), 1)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-navy rounded-2xl p-6 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-gold mb-2">Total Revenue</p>
          <p className="text-3xl font-black">{formatTSh(totalRevenue)}</p>
          <p className="text-white/40 text-xs font-medium mt-1">From paid registrations</p>
        </div>
        <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-card-navy">
          <p className="text-xs font-black uppercase tracking-widest text-navy/40 mb-2">Total Registrations</p>
          <p className="text-3xl font-black text-navy">{totalRegs.toLocaleString()}</p>
          <p className="text-navy/30 text-xs font-medium mt-1">Across all activities</p>
        </div>
      </div>

      {/* By activity */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-card-navy">
        <h3 className="text-xs font-black uppercase tracking-wider text-navy/40 mb-5">
          Revenue by Activity
        </h3>
        {rows.length === 0 ? (
          <p className="text-sm text-navy/30 font-medium text-center py-4">No paid registrations yet.</p>
        ) : (
          <div className="space-y-5">
            {[...rows]
              .sort((a, b) => b.revenue_tsh - a.revenue_tsh)
              .map(row => {
                const pct = Math.round((row.revenue_tsh / maxRevenue) * 100)
                return (
                  <div key={row.activity_slug}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-navy">
                        {ACTIVITY_LABELS[row.activity_slug] ?? row.activity_slug}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-black text-navy">
                          {formatTSh(row.revenue_tsh)}
                        </span>
                        <span className="text-xs text-navy/30 font-medium ml-2">
                          ({row.registrations} reg{row.registrations !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* Charity note */}
      <div className="bg-navy-50 rounded-2xl p-4">
        <p className="text-xs text-navy/50 font-medium text-center">
          All registration revenue supports cancer care at{' '}
          <span className="text-navy font-semibold">Ocean Road Cancer Institute</span>,
          Dar es Salaam.
        </p>
      </div>
    </div>
  )
}
