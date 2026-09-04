import { cn } from '@/lib/utils'
import type { AdminVolunteer } from '@/lib/supabase/queries/admin'

interface VolunteerTableProps {
  rows: AdminVolunteer[]
}

export function VolunteerTable({ rows }: VolunteerTableProps) {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-navy-100 p-10 text-center shadow-card-navy">
        <p className="text-sm text-navy/30 font-medium">No volunteers registered yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-card-navy overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-50">
              <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Volunteer</th>
              <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Shifts</th>
              <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Checked In</th>
              <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {rows.map(v => {
              const checkedIn  = v.shifts.filter(s => s.checked_in).length
              const totalShifts = v.shifts.length
              return (
                <tr key={v.id} className="hover:bg-navy-50/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-navy">{v.full_name ?? '—'}</p>
                    <p className="text-xs text-navy/40">{v.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {totalShifts === 0 ? (
                      <span className="text-navy/30 text-xs font-medium">None assigned</span>
                    ) : (
                      <div className="space-y-0.5">
                        {v.shifts.slice(0, 2).map(s => (
                          <p key={s.id} className="text-xs text-navy/60 font-medium">
                            {s.shift?.title ?? 'Unnamed shift'}
                          </p>
                        ))}
                        {totalShifts > 2 && (
                          <p className="text-xs text-navy/30">+{totalShifts - 2} more</p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex px-2 py-0.5 rounded-full text-xs font-black',
                      checkedIn > 0
                        ? 'bg-green-50 text-green-700'
                        : 'bg-navy-50 text-navy/40'
                    )}>
                      {checkedIn}/{totalShifts}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-navy/40 font-medium">
                    {new Date(v.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
