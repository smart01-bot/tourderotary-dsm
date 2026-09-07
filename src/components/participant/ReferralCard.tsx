'use client'

import { useState } from 'react'
import { Copy, Check, Share2, Link2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { referralSlug } from '@/lib/utils'
import { SITE } from '@/config/site'

interface Props { userId: string }

export function ReferralCard({ userId }: Props) {
  const code    = referralSlug(userId)
  const link    = `${SITE.url}/signup?ref=${code}`
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      await navigator.share({
        title: 'Join Tour de Rotary DSM',
        text: "I'm taking part in Tour de Rotary DSM — a charity event raising funds for cancer care in Tanzania. Come join me!",
        url: link,
      })
    } else {
      handleCopy()
    }
  }

  return (
    <div className="space-y-4 max-w-md">

      {/* Link card */}
      <div className="rounded-2xl border border-navy/12 bg-white p-5">
        <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-3">
          Your referral link
        </p>
        <div className="flex gap-2 mb-5">
          <div className="flex-1 bg-[#F7F6F3] rounded-xl px-3.5 py-3 border border-navy/10">
            <p className="text-xs font-mono text-navy/65 truncate">{link}</p>
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 px-4 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 border"
            style={{
              background: copied ? '#22c55e' : '#0D1B3D',
              color: '#fff',
              borderColor: copied ? '#22c55e' : '#0D1B3D',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Share channels */}
        <p className="text-[10px] font-semibold text-navy/40 uppercase tracking-widest mb-3">
          Share via
        </p>
        <div className="flex gap-2">
          {['WhatsApp', 'X / Twitter', 'Facebook', 'Email'].map(ch => (
            <button
              key={ch}
              className="flex-1 py-2.5 rounded-xl border border-navy/12 text-xs font-bold text-navy/70 hover:border-navy/30 hover:text-navy transition-colors"
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: '0',      label: 'Link clicks'     },
          { value: '0',      label: 'Signed up'        },
          { value: 'TSh 0',  label: 'Raised via refs'  },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-navy/10 bg-white p-4 text-center">
            <p className="text-xl font-black text-navy mb-1">{s.value}</p>
            <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-wide leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleCopy}
          leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
          fullWidth
        >
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          leftIcon={<Share2 size={14} />}
          fullWidth
        >
          Share
        </Button>
      </div>
    </div>
  )
}
