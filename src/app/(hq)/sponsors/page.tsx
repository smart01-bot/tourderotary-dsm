'use client'

import { useEffect, useState } from 'react'
import { getAllSponsors, updateSponsorStatus, type AdminSponsor } from '@/lib/supabase/queries/admin'
import { cn } from '@/lib/utils'
import { formatTSh } from '@/lib/utils'

const TIER_BADGE: Record<string, string> = {
  platinum: 'bg-navy text-gold',
  gold:     'bg-gold text-navy',
  silver:   'bg-navy-100 text-navy',
  bronze:   'bg-gold-100 text-navy',
}

const STATUS_OPTS = ['active', 'pending', 'lapsed']

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<AdminSponsor[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getAllSponsors().then(({ data }) => {
      setSponsors(data ?? [])
      setLoading(false)
    })
  }, [])

  const handleStatus = async (id: string, status: string) => {
    await updateSponsorStatus(id, status)
    setSponsors(s => s.map(sp => sp.id === id ? { ...sp, status } : sp))
  }

  const totalRevenue = sponsors.reduce((s, sp) => s + sp.amount_tsh, 0)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-display-sm font-black text-navy">Sponsors</h1>
          <p className="text-navy/50 font-medium mt-1">
            {sponsors.length} sponsor{sponsors.length !== 1 ? 's' : ''} · {formatTSh(totalRevenue, true)} total
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 bg-navy-50 rounded-2xl animate-pulse" />
      ) : sponsors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy-100 p-10 text-center shadow-card-navy">
          <p className="text-sm text-navy/30 font-medium">No sponsors yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-navy-100 shadow-card-navy overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-50">
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Sponsor</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Tier</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Amount</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Contact</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {sponsors.map(sp => (
                  <tr key={sp.id} className="hover:bg-navy-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-black text-navy">{sp.name}</p>
                      <p className="text-xs text-navy/40">{sp.user?.email ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-black capitalize',
                        TIER_BADGE[sp.tier] ?? 'bg-navy-50 text-navy'
                      )}>
                        {sp.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-navy">
                      {formatTSh(sp.amount_tsh)}
                    </td>
                    <td className="px-4 py-3 text-xs text-navy/50 font-medium">
                      {sp.contact_name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={sp.status}
                        onChange={e => handleStatus(sp.id, e.target.value)}
                        className="text-xs font-black rounded-lg border border-navy-100 bg-white px-2 py-1
                                   text-navy focus:outline-none focus:ring-2 focus:ring-gold/40 capitalize"
                      >
                        {STATUS_OPTS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
