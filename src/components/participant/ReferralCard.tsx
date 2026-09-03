'use client'

import { useState } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { referralSlug } from '@/lib/utils'
import { SITE } from '@/config/site'

interface Props { userId: string }

export function ReferralCard({ userId }: Props) {
  const code = referralSlug(userId)
  const link = `${SITE.url}/signup?ref=${code}`
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
    <div className="rounded-2xl border border-navy/12 bg-white p-5">
      <div className="flex items-center gap-2 mb-1">
        <Share2 size={16} className="text-gold" />
        <h3 className="font-bold text-navy">Your referral link</h3>
      </div>
      <p className="text-xs text-navy/50 mb-4">
        Share this with friends and family to invite them to join.
      </p>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-navy/4 border border-navy/10 mb-4">
        <p className="text-xs font-mono text-navy/65 flex-1 truncate">{link}</p>
        <button
          onClick={handleCopy}
          className="shrink-0 text-navy/35 hover:text-navy transition-colors"
          aria-label="Copy link"
        >
          {copied
            ? <Check size={16} className="text-green-600" />
            : <Copy size={16} />
          }
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleCopy}
          leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
        >
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleShare} leftIcon={<Share2 size={14} />}>
          Share
        </Button>
      </div>
    </div>
  )
}
