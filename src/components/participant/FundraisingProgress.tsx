import { formatTSh } from '@/lib/utils'
import { FUNDRAISING_TARGET_TSH } from '@/lib/constants'

interface Props {
  raised: number
  target?: number
}

export function FundraisingProgress({ raised, target = FUNDRAISING_TARGET_TSH }: Props) {
  const pct = Math.min(100, Math.round((raised / target) * 100))

  return (
    <div className="rounded-2xl border border-navy/12 bg-white p-5">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-0.5">
            Total raised
          </p>
          <p className="text-2xl font-black text-navy">{formatTSh(raised, true)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-navy/40">of {formatTSh(target, true)} goal</p>
          <p className="text-xl font-black text-gold">{pct}%</p>
        </div>
      </div>

      <div
        className="h-3 bg-navy/8 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-gold-600 to-gold rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
