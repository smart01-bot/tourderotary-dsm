'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdminRegistration } from '@/lib/supabase/queries/admin'

const ACTIVITY_LABELS: Record<string, string> = {
  cyclathon:      'Cyclathon',
  marathon:       'Marathon',
  walkathon:      'Walkathon',
  zumba:          'Zumba',
  yoga:           'Yoga',
  community_walk: 'Community Walk',
}

const PAYMENT_BADGE: Record<string, string> = {
  completed: 'bg-green-50 text-green-700',
  pending:   'bg-gold-50 text-gold-700',
  failed:    'bg-magenta-50 text-magenta',
  refunded:  'bg-navy-50 text-navy/60',
}

const STATUS_BADGE: Record<string, string> = {
  active:    'bg-green-50 text-green-700',
  pending:   'bg-gold-50 text-gold-700',
  cancelled: 'bg-magenta-50 text-magenta',
}

type SortKey = 'name' | 'activity' | 'payment_status' | 'created_at'
type SortDir = 'asc' | 'desc'

interface RegistrationTableProps {
  rows:       AdminRegistration[]
  onRefresh?: () => void
}

export function RegistrationTable({ rows, onRefresh }: RegistrationTableProps) {
  const [query,   setQuery]   = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [actFilter, setActFilter] = useState<string>('all')
  const [payFilter, setPayFilter] = useState<string>('all')

  const activities = useMemo(
    () => [...new Set(rows.map(r => r.activity_slug))],
    [rows]
  )

  const filtered = useMemo(() => {
    let out = rows
    if (query) {
      const q = query.toLowerCase()
      out = out.filter(r =>
        r.profile?.full_name?.toLowerCase().includes(q) ||
        r.profile?.email?.toLowerCase().includes(q) ||
        r.bib_number?.includes(q)
      )
    }
    if (actFilter !== 'all') out = out.filter(r => r.activity_slug === actFilter)
    if (payFilter !== 'all') out = out.filter(r => r.payment_status === payFilter)

    out = [...out].sort((a, b) => {
      let av = '', bv = ''
      if (sortKey === 'name')           { av = a.profile?.full_name ?? ''; bv = b.profile?.full_name ?? '' }
      if (sortKey === 'activity')       { av = a.activity_slug; bv = b.activity_slug }
      if (sortKey === 'payment_status') { av = a.payment_status; bv = b.payment_status }
      if (sortKey === 'created_at')     { av = a.created_at; bv = b.created_at }
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return out
  }, [rows, query, actFilter, payFilter, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronsUpDown size={13} className="text-navy/20" />
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-gold" />
      : <ChevronDown size={13} className="text-gold" />
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
          <input
            type="search"
            placeholder="Search name, email or bib…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-navy-100 bg-white
                       text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>
        <select
          value={actFilter}
          onChange={e => setActFilter(e.target.value)}
          className="text-sm rounded-xl border border-navy-100 bg-white px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="all">All activities</option>
          {activities.map(a => (
            <option key={a} value={a}>{ACTIVITY_LABELS[a] ?? a}</option>
          ))}
        </select>
        <select
          value={payFilter}
          onChange={e => setPayFilter(e.target.value)}
          className="text-sm rounded-xl border border-navy-100 bg-white px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="all">All payments</option>
          <option value="completed">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <span className="text-xs text-navy/40 font-semibold ml-auto">
          {filtered.length} of {rows.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-card-navy overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-50">
                {([
                  ['name',           'Name'],
                  ['activity',       'Activity'],
                  ['payment_status', 'Payment'],
                  ['created_at',     'Registered'],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider
                               text-navy/40 cursor-pointer hover:text-navy transition-colors select-none"
                  >
                    <span className="flex items-center gap-1">
                      {label} <SortIcon k={key} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Bib</th>
                <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-navy/30 font-medium">
                    No registrations match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map(row => (
                  <tr key={row.id} className="hover:bg-navy-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy">{row.profile?.full_name ?? '—'}</p>
                      <p className="text-xs text-navy/40">{row.profile?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">
                      {ACTIVITY_LABELS[row.activity_slug] ?? row.activity_slug}
                    </td>
                    <td className="px-4 py-3">
                      <Badge text={row.payment_status} cls={PAYMENT_BADGE[row.payment_status] ?? 'bg-navy-50 text-navy/50'} />
                    </td>
                    <td className="px-4 py-3 text-navy/50 text-xs">
                      {new Date(row.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 font-mono text-navy/60 text-xs">
                      {row.bib_number ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge text={row.status} cls={STATUS_BADGE[row.status] ?? 'bg-navy-50 text-navy/50'} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Badge({ text, cls }: { text: string; cls: string }) {
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-black capitalize', cls)}>
      {text.replace('_', ' ')}
    </span>
  )
}
