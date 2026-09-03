'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { getMyOrders } from '@/lib/supabase/queries/participant'
import { Badge } from '@/components/ui/Badge'
import { cn, formatTSh } from '@/lib/utils'

type DBOrder = {
  id: string
  status: string
  total_tsh: number
  created_at: string
}

const STATUS_BADGE: Record<string, {
  label: string
  variant: 'success' | 'warning' | 'navy' | 'error' | 'neutral' | 'gold' | 'magenta'
}> = {
  pending:    { label: 'Pending',    variant: 'warning' },
  paid:       { label: 'Paid',       variant: 'success' },
  processing: { label: 'Processing', variant: 'navy'    },
  shipped:    { label: 'Shipped',    variant: 'gold'    },
  delivered:  { label: 'Delivered',  variant: 'success' },
  cancelled:  { label: 'Cancelled',  variant: 'error'   },
}

export default function OrdersPage() {
  const { user }                  = useUser()
  const [orders,  setOrders]      = useState<DBOrder[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!user) return
    getMyOrders(user.id).then(({ data }) => {
      setOrders((data as DBOrder[]) ?? [])
      setLoading(false)
    })
  }, [user])

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-display-sm font-black text-navy mb-1">Orders</h1>
        <p className="text-navy/50 text-sm">Your merch order history.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-navy/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-navy/10 bg-white">
          <p className="text-navy/50 text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-navy/12 bg-white overflow-hidden">
          {orders.map((order, i) => {
            const cfg = STATUS_BADGE[order.status] ?? { label: order.status, variant: 'neutral' as const }
            return (
              <div
                key={order.id}
                className={cn(
                  'flex items-center justify-between px-5 py-4',
                  i !== 0 && 'border-t border-navy/8'
                )}
              >
                <div>
                  <p className="text-sm font-bold text-navy font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-navy/40 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-navy">{formatTSh(order.total_tsh)}</p>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
