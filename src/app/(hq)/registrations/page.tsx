'use client'

import { useEffect, useState } from 'react'
import { getAllRegistrations, type AdminRegistration } from '@/lib/supabase/queries/admin'
import { RegistrationTable } from '@/components/hq/RegistrationTable'

export default function RegistrationsPage() {
  const [rows,    setRows]    = useState<AdminRegistration[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await getAllRegistrations()
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-sm font-black text-navy">Registrations</h1>
          <p className="text-navy/50 font-medium mt-1">All participant registrations across activities.</p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl border border-navy-100 bg-white text-sm font-semibold
                     text-navy/60 hover:text-navy hover:border-navy/30 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-10 bg-navy-50 rounded-xl" />
          <div className="h-64 bg-navy-50 rounded-2xl" />
        </div>
      ) : (
        <RegistrationTable rows={rows} onRefresh={load} />
      )}
    </div>
  )
}
