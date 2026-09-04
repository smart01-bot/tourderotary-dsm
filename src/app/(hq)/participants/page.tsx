'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { getAllParticipants, type AdminParticipant } from '@/lib/supabase/queries/admin'
import { ParticipantRow } from '@/components/hq/ParticipantRow'

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<AdminParticipant[]>([])
  const [query,        setQuery]        = useState('')
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    getAllParticipants().then(({ data }) => {
      setParticipants(data ?? [])
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    if (!query) return participants
    const q = query.toLowerCase()
    return participants.filter(p =>
      p.full_name?.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    )
  }, [participants, query])

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Participants</h1>
        <p className="text-navy/50 font-medium mt-1">
          {participants.length} registered participant{participants.length !== 1 ? 's' : ''}.
        </p>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
        <input
          type="search"
          placeholder="Search by name or email…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-navy-100 bg-white
                     text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[0,1,2,3].map(i => <div key={i} className="h-16 bg-navy-50 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-navy/30 font-medium text-center py-10">No participants found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => <ParticipantRow key={p.id} participant={p} />)}
        </div>
      )}
    </div>
  )
}
