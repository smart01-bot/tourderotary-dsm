'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@/hooks/useUser'
import { getOpenShifts, getMyShifts, claimShift, releaseShift } from '@/lib/supabase/queries/volunteer'
import { ShiftCard } from '@/components/volunteer/ShiftCard'

type Shift = {
  id: string
  title: string
  description: string | null
  location: string | null
  start_time: string
  end_time: string
  max_slots: number
  filled_slots: number
}

export default function ShiftsPage() {
  const { user }                          = useUser()
  const [allShifts,   setAllShifts]       = useState<Shift[]>([])
  const [claimedIds,  setClaimedIds]      = useState<Set<string>>(new Set())
  const [loading,     setLoading]         = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    const [{ data: all }, { data: mine }] = await Promise.all([
      getOpenShifts(),
      getMyShifts(user.id),
    ])
    setAllShifts((all as Shift[]) ?? [])
    const ids = new Set((mine ?? []).map((vs: any) => vs.shift_id as string))
    setClaimedIds(ids)
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const handleClaim = async (shiftId: string) => {
    if (!user) return
    await claimShift(user.id, shiftId)
    setClaimedIds(prev => new Set([...prev, shiftId]))
    // increment filled_slots locally
    setAllShifts(prev =>
      prev.map(s => s.id === shiftId ? { ...s, filled_slots: s.filled_slots + 1 } : s)
    )
  }

  const handleRelease = async (shiftId: string) => {
    if (!user) return
    await releaseShift(user.id, shiftId)
    setClaimedIds(prev => { const n = new Set(prev); n.delete(shiftId); return n })
    setAllShifts(prev =>
      prev.map(s => s.id === shiftId ? { ...s, filled_slots: Math.max(0, s.filled_slots - 1) } : s)
    )
  }

  const myShifts   = allShifts.filter(s => claimedIds.has(s.id))
  const openShifts = allShifts.filter(s => !claimedIds.has(s.id))

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-display-sm font-black text-navy mb-1">Shifts</h1>
        <p className="text-navy/50 text-sm">Claim shifts you can cover on event day.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-navy/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* My claimed shifts */}
          {myShifts.length > 0 && (
            <section className="space-y-3">
              <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest">
                My shifts ({myShifts.length})
              </p>
              {myShifts.map(shift => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                  claimed
                  onClaim={handleClaim}
                  onRelease={handleRelease}
                />
              ))}
            </section>
          )}

          {/* Available shifts */}
          <section className="space-y-3">
            <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest">
              Available shifts ({openShifts.length})
            </p>
            {openShifts.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-navy/10 bg-white">
                <p className="text-sm text-navy/50">
                  {allShifts.length === 0 ? 'No shifts posted yet.' : 'You\'ve claimed all available shifts!'}
                </p>
              </div>
            ) : (
              openShifts.map(shift => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                  claimed={false}
                  onClaim={handleClaim}
                  onRelease={handleRelease}
                />
              ))
            )}
          </section>
        </>
      )}
    </div>
  )
}
