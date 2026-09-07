import { formatTSh } from '@/lib/utils'
import { FUNDRAISING_TARGET_TSH } from '@/lib/constants'
import { Button } from '@/components/ui/Button'

interface Props {
  raised: number
  target?: number
}

export function FundraisingProgress({ raised, target = FUNDRAISING_TARGET_TSH }: Props) {
  const pct = Math.min(100, Math.round((raised / target) * 100))

  return (
    <div className="rounded-2xl border border-navy/12 bg-white p-5">
      <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-2">
        Total raised
      </p>
      <p className="text-3xl font-black text-navy mb-0.5">{formatTSh(raised, true)}</p>
      <p className="text-xs text-navy/45 mb-4">Local currency · TSh</p>

      <div
        className="h-1.5 bg-navy/8 rounded-full overflow-hidden mb-1.5"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gold rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between mb-5">
        <span className="text-[10px] font-semibold text-navy/45">{formatTSh(raised, true)} raised</span>
        <span className="text-[10px] font-semibold text-navy/45">Goal · {formatTSh(target, true)}</span>
      </div>

      <Button variant="magenta" size="sm" fullWidth>Start fundraising</Button>
    </div>
  )
}
