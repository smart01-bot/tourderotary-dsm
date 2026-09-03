'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckInScanner } from '@/components/volunteer/CheckInScanner'
import { getRecentCheckIns } from '@/lib/supabase/queries/volunteer'
import { ACTIVITY_MAP } from '@/config/activities'

type CheckIn = {
  id: string
  activity_slug: string
  bib_number: string | null
  updated_at: string
  profile: { full_name: string | null } | null
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function CheckInPage() {
  const [recent,  setRecent]  = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)

  const loadRecent = useCallback(async () => {
    const { data } = await getRecentCheckIns(10)
    setRecent((data as CheckIn[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadRecent() }, [loadRecent])

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <h1 className="text-display-sm font-black text-navy mb-1">Check-in</h1>
        <p className="text-navy/50 text-sm">Look up a participant by QR code or BIB number.</p>
      </div>

      {/* Scanner */}
      <CheckInScanner />

      {/* Refresh recent log */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest">
            Recent check-ins
          </p>
          <button
            onClick={loadRecent}
            className="text-xs font-semibold text-gold hover:text-gold-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-navy/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="py-10 text-center rounded-2xl border border-navy/10 bg-white">
            <p className="text-sm text-navy/50">No check-ins yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-navy/12 bg-white overflow-hidden">
            {recent.map((ci, i) => (
              <div
                key={ci.id}
                className={`flex items-center justify-between px-5 py-3 ${i !== 0 ? 'border-t border-navy/8' : ''}`}
              >
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {ci.profile?.full_name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-navy/45">
                    {ACTIVITY_MAP[ci.activity_slug]?.name ?? ci.activity_slug}
                    {ci.bib_number ? ` · BIB #${ci.bib_number}` : ''}
                  </p>
                </div>
                <p className="text-xs font-mono text-navy/35">{fmtTime(ci.updated_at)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
