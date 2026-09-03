import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  accent?: 'gold' | 'magenta' | 'navy' | 'default'
  className?: string
}

const styles = {
  gold:    { card: 'border-gold/25 bg-gold/5',       value: 'text-gold-700',  icon: 'bg-gold/10 text-gold'       },
  magenta: { card: 'border-magenta/25 bg-magenta/5', value: 'text-magenta',   icon: 'bg-magenta/10 text-magenta' },
  navy:    { card: 'border-navy/15 bg-navy/5',       value: 'text-navy',      icon: 'bg-navy/8 text-navy'        },
  default: { card: 'border-navy/10 bg-white',        value: 'text-navy',      icon: 'bg-navy/5 text-navy/70'     },
}

export function StatCard({ label, value, sub, icon, accent = 'default', className }: StatCardProps) {
  const s = styles[accent]

  return (
    <div className={cn('rounded-2xl border p-5 flex items-start gap-4', s.card, className)}>
      {icon && (
        <div className={cn('p-2.5 rounded-xl shrink-0', s.icon)}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-1">{label}</p>
        <p className={cn('text-2xl font-black leading-tight', s.value)}>{value}</p>
        {sub && <p className="text-xs text-navy/45 mt-1">{sub}</p>}
      </div>
    </div>
  )
}
