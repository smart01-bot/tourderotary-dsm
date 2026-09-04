'use client'

import { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus, type AdminOrder } from '@/lib/supabase/queries/admin'
import { cn, formatTSh } from '@/lib/utils'

const STATUS_OPTS = ['pending', 'processing', 'fulfilled', 'cancelled']
const STATUS_BADGE: Record<string, string> = {
  pending:    'bg-gold-50 text-gold-700',
  processing: 'bg-navy-50 text-navy',
  fulfilled:  'bg-green-50 text-green-700',
  cancelled:  'bg-magenta-50 text-magenta',
}

export default function OrdersPage() {
  const [orders,  setOrders]  = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllOrders().then(({ data }) => {
      setOrders(data ?? [])
      setLoading(false)
    })
  }, [])

  const handleStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status)
    setOrders(o => o.map(ord => ord.id === id ? { ...ord, status } : ord))
  }

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total_tsh, 0)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Orders</h1>
        <p className="text-navy/50 font-medium mt-1">
          {orders.length} order{orders.length !== 1 ? 's' : ''} · {formatTSh(totalRevenue, true)} total
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-navy-50 rounded-2xl animate-pulse" />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy-100 p-10 text-center shadow-card-navy">
          <p className="text-sm text-navy/30 font-medium">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-navy-100 shadow-card-navy overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-50">
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Customer</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Items</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Total</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Date</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {orders.map(ord => (
                  <tr key={ord.id} className="hover:bg-navy-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy">{ord.profile?.full_name ?? '—'}</p>
                      <p className="text-xs text-navy/40">{ord.profile?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {ord.items.slice(0, 2).map((item, i) => (
                          <p key={i} className="text-xs text-navy/60 font-medium">
                            {item.quantity}× {item.product_name}
                            {item.size && <span className="text-navy/30"> ({item.size})</span>}
                          </p>
                        ))}
                        {ord.items.length > 2 && (
                          <p className="text-xs text-navy/30">+{ord.items.length - 2} more</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-black text-navy">{formatTSh(ord.total_tsh)}</td>
                    <td className="px-4 py-3 text-xs text-navy/40 font-medium whitespace-nowrap">
                      {new Date(ord.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={ord.status}
                        onChange={e => handleStatus(ord.id, e.target.value)}
                        className="text-xs font-black rounded-lg border border-navy-100 bg-white px-2 py-1
                                   text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
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
