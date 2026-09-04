'use client'

import { useState } from 'react'
import { Send, Users, Filter, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type Audience = 'all_participants' | 'paid_only' | 'unpaid_only' | 'all_volunteers' | 'custom'
type Channel  = 'email' | 'sms' | 'both'

const AUDIENCE_OPTS: { value: Audience; label: string; desc: string }[] = [
  { value: 'all_participants', label: 'All Participants',    desc: 'Everyone with a registration' },
  { value: 'paid_only',        label: 'Paid Only',           desc: 'Confirmed, paid registrations' },
  { value: 'unpaid_only',      label: 'Unpaid / Pending',    desc: 'Registered but not yet paid'  },
  { value: 'all_volunteers',   label: 'All Volunteers',      desc: 'All volunteer accounts'        },
]

export function CommunicationPanel() {
  const [audience,  setAudience]  = useState<Audience>('all_participants')
  const [channel,   setChannel]   = useState<Channel>('email')
  const [subject,   setSubject]   = useState('')
  const [body,      setBody]      = useState('')
  const [sending,   setSending]   = useState(false)
  const [sent,      setSent]      = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and message are required.')
      return
    }
    setSending(true)
    setError(null)
    // Stubbed — wired to Resend (email) and Textify Africa (SMS) in Build #9
    // Will call: POST /api/communications/send via lib/api.ts
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
    setSubject('')
    setBody('')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Integration notice */}
      <div className="flex items-start gap-3 bg-gold-50 border border-gold-200 rounded-2xl p-4">
        <Info size={16} className="text-gold-600 shrink-0 mt-0.5" />
        <p className="text-xs text-navy/60 font-medium">
          Email delivery uses <span className="font-bold text-navy">Resend</span>.
          SMS uses <span className="font-bold text-navy">Textify Africa</span>.
          Both are wired in Build #9 — sending is stubbed until then.
        </p>
      </div>

      {/* Audience */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-navy/40 mb-3">
          <Filter size={12} className="inline mr-1.5" />
          Audience
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AUDIENCE_OPTS.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setAudience(value)}
              className={cn(
                'text-left px-4 py-3 rounded-xl border-2 transition-all duration-150',
                audience === value
                  ? 'border-navy bg-navy text-white'
                  : 'border-navy-100 bg-white text-navy hover:border-navy/30'
              )}
            >
              <p className={cn('text-sm font-black', audience === value ? 'text-white' : 'text-navy')}>
                {label}
              </p>
              <p className={cn('text-xs font-medium mt-0.5', audience === value ? 'text-white/60' : 'text-navy/40')}>
                {desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Channel */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-navy/40 mb-3">
          <Users size={12} className="inline mr-1.5" />
          Channel
        </label>
        <div className="flex gap-2">
          {(['email', 'sms', 'both'] as Channel[]).map(c => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={cn(
                'px-4 py-2 rounded-xl border-2 text-sm font-black capitalize transition-all duration-150',
                channel === c
                  ? 'border-gold bg-gold text-navy'
                  : 'border-navy-100 bg-white text-navy/60 hover:border-navy/30 hover:text-navy'
              )}
            >
              {c === 'both' ? 'Email + SMS' : c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Subject */}
      {(channel === 'email' || channel === 'both') && (
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-navy/40 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="e.g. Important update — Tour de Rotary DSM"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-navy-100 bg-white
                       text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>
      )}

      {/* Body */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-navy/40 mb-2">
          Message
        </label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={6}
          placeholder={channel === 'sms'
            ? 'Keep under 160 characters for a single SMS…'
            : 'Write your message here…'}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-navy-100 bg-white
                     text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none"
        />
        {channel === 'sms' && (
          <p className={cn(
            'text-xs font-semibold mt-1',
            body.length > 160 ? 'text-magenta' : 'text-navy/30'
          )}>
            {body.length}/160 characters
          </p>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-sm text-magenta font-semibold">{error}</p>}

      {/* Success */}
      {sent && (
        <div className="text-sm text-green-700 font-semibold bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          Message queued for delivery.
        </div>
      )}

      {/* Send */}
      <button
        onClick={handleSend}
        disabled={sending || !subject.trim() || !body.trim()}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-navy text-white text-sm font-black
                   hover:bg-navy-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send size={15} />
        {sending ? 'Sending…' : 'Send Message'}
      </button>
    </div>
  )
}
