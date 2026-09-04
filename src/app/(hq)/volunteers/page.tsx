'use client'

import { useEffect, useState } from 'react'
import { getAllVolunteers, type AdminVolunteer } from '@/lib/supabase/queries/admin'
import { VolunteerTable } from '@/components/hq/VolunteerTable'

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<AdminVolunteer[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    getAllVolunteers().then(({ data }) => {
      setVolunteers(data ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Volunteers</h1>
        <p className="text-navy/50 font-medium mt-1">
          {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''} registered.
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-navy-50 rounded-2xl animate-pulse" />
      ) : (
        <VolunteerTable rows={volunteers} />
      )}
    </div>
  )
}
