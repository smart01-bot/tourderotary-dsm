'use client'

import { useState, useRef } from 'react'
import { Search, CheckCircle, XCircle, ScanLine } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { getRegistrationByCode, checkInParticipant } from '@/lib/supabase/queries/volunteer'
import { ACTIVITY_MAP } from '@/config/activities'
import type { RegistrationStatus } from '@/types'

type LookupResult = {
  id: string
  status: RegistrationStatus
  activity_slug: string
  bib_number: string | null
  profile: { full_name: string | null; email: string } | null
}

const BLOCKABLE: RegistrationStatus[] = ['cancelled', 'checked_in']

export function CheckInScanner() {
  const [code,    setCode]    = useState('')
  const [result,  setResult]  = useState<LookupResult | null>(null)
  const [searching, setSearching] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [lookupErr, setLookupErr] = useState<string | null>(null)
  const [checkErr,  setCheckErr]  = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setCode('')
    setResult(null)
    setCheckedIn(false)
    setLookupErr(null)
    setCheckErr(null)
    inputRef.current?.focus()
  }

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLookupErr(null)
    setResult(null)
    setCheckedIn(false)
    setSearching(true)

    const { data, error } = await getRegistrationByCode(code.trim())

    if (error || !data) {
      setLookupErr('No registration found for that code.')
    } else {
      setResult(data as LookupResult)
    }
    setSearching(false)
  }

  const handleCheckIn = async () => {
    if (!result) return
    setCheckErr(null)
    setSearching(true)

    const { error } = await checkInParticipant(result.id)

    if (error) {
      setCheckErr(error.message)
    } else {
      setCheckedIn(true)
      setResult(prev => prev ? { ...prev, status: 'checked_in' } : prev)
    }
    setSearching(false)
  }

  const activity = result ? ACTIVITY_MAP[result.activity_slug] : null

  return (
    <div className="space-y-5 max-w-md">
      {/* Search form */}
      <form onSubmit={handleLookup} className="flex gap-2">
        <div className="relative flex-1">
          <ScanLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/35 pointer-events-none" />
          <input
            ref={inputRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="BIB number or QR code…"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-navy/20 bg-white text-sm font-medium
                       text-navy placeholder:text-navy/35 outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            autoFocus
          />
        </div>
        <Button type="submit" loading={searching} leftIcon={<Search size={15} />}>
          Look up
        </Button>
      </form>

      {/* Lookup error */}
      {lookupErr && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
          <XCircle size={16} className="shrink-0" />
          {lookupErr}
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className={cn(
          'rounded-2xl border p-5 space-y-4',
          checkedIn
            ? 'border-green-300 bg-green-50'
            : result.status === 'cancelled'
              ? 'border-red-200 bg-red-50'
              : 'border-navy/12 bg-white'
        )}>
          {/* Participant info */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-navy text-base">
                {result.profile?.full_name ?? 'Unknown'}
              </p>
              <p className="text-xs text-navy/50">{result.profile?.email}</p>
            </div>
            {result.bib_number && (
              <div className="text-right">
                <p className="text-[10px] text-navy/40 font-semibold uppercase tracking-wide">BIB</p>
                <p className="text-xl font-black text-navy">#{result.bib_number}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="gold">{activity?.name ?? result.activity_slug}</Badge>
            <Badge
              variant={
                result.status === 'paid'       ? 'success'  :
                result.status === 'checked_in' ? 'success'  :
                result.status === 'cancelled'  ? 'error'    : 'warning'
              }
              dot
            >
              {result.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Action */}
          {checkedIn ? (
            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
              <CheckCircle size={18} />
              Checked in successfully
            </div>
          ) : BLOCKABLE.includes(result.status) ? (
            <p className="text-sm font-semibold text-red-600">
              {result.status === 'checked_in' ? 'Already checked in.' : 'Registration cancelled — cannot check in.'}
            </p>
          ) : (
            <div className="space-y-2">
              {checkErr && (
                <p className="text-xs text-red-500 font-medium">{checkErr}</p>
              )}
              <div className="flex gap-2">
                <Button onClick={handleCheckIn} loading={searching} leftIcon={<CheckCircle size={15} />}>
                  Check in
                </Button>
                <Button variant="ghost" size="sm" onClick={reset}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* After check-in — scan next */}
      {checkedIn && (
        <Button variant="secondary" fullWidth onClick={reset}>
          Scan next participant
        </Button>
      )}
    </div>
  )
}
