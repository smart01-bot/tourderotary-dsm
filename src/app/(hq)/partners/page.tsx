'use client'

import { useEffect, useState } from 'react'
import { getAllPartners, updatePartnerStatus } from '@/lib/supabase/queries/admin'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/supabase/queries/partner'

type PartnerRow = {
  id:           string
  name:         string
  category:     string
  status:       string
  contact_name: string | null
  user:         { email: string } | null
  deliverables: { id: string; status: string }[]
}

const STATUS_OPTS = ['active', 'pending', 'inactive']

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerRow[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getAllPartners().then(({ data }) => {
      setPartners((data as PartnerRow[]) ?? [])
      setLoading(false)
    })
  }, [])

  const handleStatus = async (id: string, status: string) => {
    await updatePartnerStatus(id, status)
    setPartners(p => p.map(pt => pt.id === id ? { ...pt, status } : pt))
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Partners</h1>
        <p className="text-navy/50 font-medium mt-1">
          {partners.length} partner{partners.length !== 1 ? 's' : ''} onboarded.
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-navy-50 rounded-2xl animate-pulse" />
      ) : partners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy-100 p-10 text-center shadow-card-navy">
          <p className="text-sm text-navy/30 font-medium">No partners yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-navy-100 shadow-card-navy overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-50">
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Partner</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Category</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Deliverables</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Contact</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {partners.map(pt => {
                  const total     = pt.deliverables.length
                  const completed = pt.deliverables.filter(d => d.status === 'completed').length
                  const overdue   = pt.deliverables.filter(d => d.status === 'overdue').length
                  return (
                    <tr key={pt.id} className="hover:bg-navy-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-black text-navy">{pt.name}</p>
                        <p className="text-xs text-navy/40">{pt.user?.email ?? '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-navy/60">
                        {CATEGORY_LABELS[pt.category as keyof typeof CATEGORY_LABELS] ?? pt.category}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-navy">{completed}/{total}</span>
                          {overdue > 0 && (
                            <span className="text-xs font-black text-magenta">· {overdue} overdue</span>
                          )}
                        </div>
                        {total > 0 && (
                          <div className="mt-1 h-1.5 w-24 bg-navy-50 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full', overdue > 0 ? 'bg-magenta' : 'bg-gold')}
                              style={{ width: `${total > 0 ? Math.round((completed / total) * 100) : 0}%` }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-navy/50 font-medium">
                        {pt.contact_name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={pt.status}
                          onChange={e => handleStatus(pt.id, e.target.value)}
                          className="text-xs font-black rounded-lg border border-navy-100 bg-white px-2 py-1
                                     text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
                        >
                          {STATUS_OPTS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
