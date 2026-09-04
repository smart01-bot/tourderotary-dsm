import { Users, CheckCircle2, Banknote, HeartHandshake, Building2, Handshake, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatTSh } from '@/lib/utils'
import type { HQStats } from '@/lib/supabase/queries/admin'

interface StatsOverviewProps {
  stats:      HQStats
  className?: string
}

export function StatsOverview({ stats, className }: StatsOverviewProps) {
  const conversionPct = stats.total_registrations > 0
    ? Math.round((stats.paid_registrations / stats.total_registrations) * 100)
    : 0

  const CARDS = [
    {
      label:  'Total Registered',
      value:  stats.total_registrations.toLocaleString(),
      sub:    `${conversionPct}% paid`,
      icon:   <Users size={18} />,
      accent: 'navy',
    },
    {
      label:  'Paid Participants',
      value:  stats.paid_registrations.toLocaleString(),
      sub:    'Confirmed revenue',
      icon:   <CheckCircle2 size={18} />,
      accent: 'green',
    },
    {
      label:  'Total Revenue',
      value:  formatTSh(stats.total_revenue_tsh, true),
      sub:    'Registration fees',
      icon:   <Banknote size={18} />,
      accent: 'gold',
    },
    {
      label:  'Volunteers',
      value:  stats.total_volunteers.toLocaleString(),
      sub:    'Registered accounts',
      icon:   <HeartHandshake size={18} />,
      accent: 'navy',
    },
    {
      label:  'Active Sponsors',
      value:  stats.total_sponsors.toLocaleString(),
      sub:    'By tier',
      icon:   <Building2 size={18} />,
      accent: 'gold',
    },
    {
      label:  'Active Partners',
      value:  stats.total_partners.toLocaleString(),
      sub:    'Delivery partners',
      icon:   <Handshake size={18} />,
      accent: 'navy',
    },
    {
      label:  'Merch Orders',
      value:  stats.total_orders.toLocaleString(),
      sub:    'All statuses',
      icon:   <ShoppingBag size={18} />,
      accent: 'magenta',
    },
  ]

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {CARDS.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  )
}

// ── Accent map ──────────────────────────────────────────────────────────────

const ACCENT: Record<string, { icon: string; value: string }> = {
  navy:    { icon: 'bg-navy-50 text-navy',          value: 'text-navy'     },
  green:   { icon: 'bg-green-50 text-green-600',    value: 'text-green-700' },
  gold:    { icon: 'bg-gold-50 text-gold-600',      value: 'text-gold-700'  },
  magenta: { icon: 'bg-magenta-50 text-magenta',    value: 'text-magenta'   },
}

function StatCard({
  label, value, sub, icon, accent,
}: {
  label:  string
  value:  string
  sub:    string
  icon:   React.ReactNode
  accent: string
}) {
  const a = ACCENT[accent] ?? ACCENT.navy
  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-4 shadow-card-navy">
      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', a.icon)}>
        {icon}
      </div>
      <p className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider mb-1">{label}</p>
      <p className={cn('text-2xl font-black', a.value)}>{value}</p>
      <p className="text-[11px] text-navy/30 font-medium mt-0.5">{sub}</p>
    </div>
  )
}
