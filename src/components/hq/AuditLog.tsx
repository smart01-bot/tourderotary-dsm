import { cn } from '@/lib/utils'
import type { AuditEvent } from '@/lib/supabase/queries/admin'

interface AuditLogProps {
  events:     AuditEvent[]
  className?: string
}

export function AuditLog({ events, className }: AuditLogProps) {
  if (events.length === 0) {
    return (
      <div className={cn(
        'bg-white rounded-2xl border border-navy-100 p-10 text-center shadow-card-navy',
        className
      )}>
        <p className="text-sm text-navy/30 font-medium">No audit events recorded yet.</p>
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-white rounded-2xl border border-navy-100 shadow-card-navy overflow-hidden',
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-50">
              <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Time</th>
              <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Actor</th>
              <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Action</th>
              <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Table</th>
              <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {events.map(e => (
              <tr key={e.id} className="hover:bg-navy-50/30 transition-colors">
                <td className="px-4 py-3 text-xs text-navy/40 font-medium whitespace-nowrap">
                  {new Date(e.created_at).toLocaleString('en-GB', {
                    day:    '2-digit',
                    month:  'short',
                    hour:   '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs font-semibold text-navy truncate max-w-[160px]">
                    {e.actor_email ?? '—'}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'inline-flex px-2 py-0.5 rounded-full text-xs font-black',
                    actionColor(e.action)
                  )}>
                    {e.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-navy/50 font-mono">
                  {e.table_name ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-navy/30 font-mono truncate max-w-[120px]">
                  {e.record_id ? e.record_id.slice(0, 8) + '…' : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function actionColor(action: string): string {
  if (action.startsWith('phase'))    return 'bg-magenta-50 text-magenta'
  if (action.startsWith('create'))   return 'bg-green-50 text-green-700'
  if (action.startsWith('update'))   return 'bg-gold-50 text-gold-700'
  if (action.startsWith('delete'))   return 'bg-magenta-50 text-magenta'
  if (action.startsWith('send'))     return 'bg-navy-50 text-navy'
  return 'bg-navy-50 text-navy/50'
}
