import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatTSh } from '@/lib/utils'
import type { ActivityConfig } from '@/types'

interface Props {
  activity: ActivityConfig
  tier?: 'standard' | 'vip'
}

export function PaymentSummary({ activity, tier = 'standard' }: Props) {
  const base      = tier === 'vip' && activity.priceMax ? activity.priceMax : activity.priceMin
  const processing = Math.round(base * 0.015)
  const total      = base + processing

  return (
    <div className="rounded-2xl border border-navy/12 bg-white p-5">
      <h3 className="font-bold text-navy mb-4">Payment summary</h3>

      <div className="space-y-2.5 mb-5">
        <Row label={`${activity.name} (${tier})`} value={base} />
        <Row label="Processing fee (1.5%)" value={processing} muted />
        <div className="border-t border-navy/8 pt-2.5">
          <Row label="Total" value={total} bold />
        </div>
      </div>

      {/* PayMe slot — wired in Build #8 */}
      <Button fullWidth size="lg" disabled className="mb-3">
        Pay {formatTSh(total)}
      </Button>

      <div className="flex items-start gap-2 text-xs text-navy/40">
        <AlertCircle size={13} className="shrink-0 mt-0.5" />
        <p>PayMe Africa gateway is configured in Build #8.</p>
      </div>
    </div>
  )
}

function Row({ label, value, muted, bold }: {
  label: string; value: number; muted?: boolean; bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${muted ? 'text-navy/40' : 'text-navy/65'}`}>{label}</span>
      <span className={`text-sm font-semibold ${bold ? 'font-bold text-navy' : muted ? 'text-navy/40' : 'text-navy'}`}>
        {formatTSh(value)}
      </span>
    </div>
  )
}
