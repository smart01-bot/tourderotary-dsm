'use client'

import { useEffect, useState } from 'react'
import { getAuditLog, type AuditEvent } from '@/lib/supabase/queries/admin'
import { AuditLog } from '@/components/hq/AuditLog'

export default function AuditPage() {
  const [events,  setEvents]  = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuditLog(200).then(({ data }) => {
      setEvents(data ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Audit Log</h1>
        <p className="text-navy/50 font-medium mt-1">
          Last 200 admin actions — phase changes, status updates, and communications.
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-navy-50 rounded-2xl animate-pulse" />
      ) : (
        <AuditLog events={events} />
      )}
    </div>
  )
}
