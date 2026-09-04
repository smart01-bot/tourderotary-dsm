'use client'

import { useEffect, useState } from 'react'
import { getFinancialBreakdown, type FinancialRow } from '@/lib/supabase/queries/admin'
import { FinancialSummary } from '@/components/hq/FinancialSummary'

export default function ReportsPage() {
  const [rows,    setRows]    = useState<FinancialRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFinancialBreakdown().then(({ data }) => {
      setRows(data ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Reports</h1>
        <p className="text-navy/50 font-medium mt-1">
          Financial breakdown from registration fees.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-navy-50 rounded-2xl" />
            <div className="h-28 bg-navy-50 rounded-2xl" />
          </div>
          <div className="h-64 bg-navy-50 rounded-2xl" />
        </div>
      ) : (
        <FinancialSummary rows={rows} />
      )}
    </div>
  )
}
