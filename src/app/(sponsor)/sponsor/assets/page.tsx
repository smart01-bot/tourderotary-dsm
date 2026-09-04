'use client'

import { useEffect, useState } from 'react'
import { Download, FileImage, FileText, Archive, ExternalLink, Inbox } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import {
  getSponsorProfile,
  getSponsorAssets,
  type SponsorProfile,
  type SponsorAsset,
} from '@/lib/supabase/queries/sponsor'
import { cn } from '@/lib/utils'

// ── File type display helpers ──────────────────────────────────────────────

function fileIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'pdf':  return <FileText  size={20} />
    case 'zip':  return <Archive   size={20} />
    case 'png':
    case 'jpg':
    case 'svg':  return <FileImage size={20} />
    default:     return <Download  size={20} />
  }
}

function fileIconAccent(type: string) {
  switch (type.toLowerCase()) {
    case 'pdf': return 'bg-magenta-50 text-magenta'
    case 'zip': return 'bg-gold-50 text-gold-700'
    default:    return 'bg-navy-50 text-navy'
  }
}

function formatBytes(bytes: number | null) {
  if (!bytes) return null
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function SponsorAssetsPage() {
  const { user }    = useUser()

  const [sponsor,  setSponsor]  = useState<SponsorProfile | null>(null)
  const [assets,   setAssets]   = useState<SponsorAsset[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data: sp } = await getSponsorProfile(user.id)
      setSponsor(sp)
      if (sp) {
        const { data: a } = await getSponsorAssets(sp.id)
        setAssets(a ?? [])
      }
      setLoading(false)
    })()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse max-w-3xl">
        <div className="h-8 w-48 bg-navy-50 rounded-xl" />
        {[0,1,2].map(i => <div key={i} className="h-20 bg-navy-50 rounded-2xl" />)}
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-display-sm font-black text-navy">Brand Assets</h1>
        <p className="text-navy/50 font-medium mt-1">
          Download your personalised event materials below.
        </p>
      </div>

      {/* Asset list */}
      {assets.length === 0 ? (
        <EmptyAssets />
      ) : (
        <div className="space-y-3">
          {assets.map((asset) => (
            <AssetRow key={asset.id} asset={asset} />
          ))}
        </div>
      )}

      {/* Always-visible general assets */}
      <div>
        <h2 className="text-xs font-black text-navy/40 uppercase tracking-wider mb-3">
          General Event Assets
        </h2>
        <div className="space-y-3">
          <GeneralAssetRow
            label="Event Logo Kit"
            desc="Official Tour de Rotary DSM logos in PNG, SVG and PDF formats"
            type="zip"
          />
          <GeneralAssetRow
            label="Brand Guidelines"
            desc="Colour palette, typography rules and co-branding instructions"
            type="pdf"
          />
          <GeneralAssetRow
            label="Event Programme"
            desc="Full event schedule and activity details — share with your network"
            type="pdf"
          />
          <GeneralAssetRow
            label="Social Media Kit"
            desc="Banners and captions sized for Instagram, Facebook and LinkedIn"
            type="zip"
          />
        </div>
      </div>

      {/* Contact note */}
      <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5">
        <p className="text-sm font-semibold text-navy">
          Need custom assets?
        </p>
        <p className="text-sm text-navy/60 mt-1">
          Contact the Rotaract 4 Compassion marketing team at{' '}
          <a
            href="mailto:marketing@rotaract4compassion.or.tz"
            className="text-navy font-semibold underline underline-offset-2 hover:text-gold-700 transition-colors"
          >
            marketing@rotaract4compassion.or.tz
          </a>{' '}
          to request a co-branded banner or custom certificate.
        </p>
      </div>
    </div>
  )
}

// ── Asset row (sponsor-specific) ────────────────────────────────────────────

function AssetRow({ asset }: { asset: SponsorAsset }) {
  const size = formatBytes(asset.size_bytes)
  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-4 shadow-card-navy flex items-center gap-4">
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
        fileIconAccent(asset.file_type)
      )}>
        {fileIcon(asset.file_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-navy truncate">{asset.label}</p>
        {asset.description && (
          <p className="text-xs text-navy/50 font-medium mt-0.5 truncate">{asset.description}</p>
        )}
        {size && <p className="text-[11px] text-navy/30 font-medium mt-0.5">{size}</p>}
      </div>
      <a
        href={asset.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white
                   text-xs font-black hover:bg-navy-700 transition-colors shrink-0"
      >
        <Download size={13} />
        Download
      </a>
    </div>
  )
}

// ── General asset row (static / coming soon) ────────────────────────────────

function GeneralAssetRow({
  label, desc, type,
}: {
  label: string
  desc:  string
  type:  string
}) {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-4 shadow-card-navy flex items-center gap-4">
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
        fileIconAccent(type)
      )}>
        {fileIcon(type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-navy">{label}</p>
        <p className="text-xs text-navy/50 font-medium mt-0.5 leading-snug">{desc}</p>
      </div>
      <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-50 text-navy/40
                       text-xs font-black shrink-0 cursor-default select-none">
        <ExternalLink size={13} />
        Soon
      </span>
    </div>
  )
}

// ── Empty state ─────────────────────────────────────────────────────────────

function EmptyAssets() {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-10 flex flex-col items-center text-center shadow-card-navy">
      <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy/40 flex items-center justify-center mb-4">
        <Inbox size={24} />
      </div>
      <p className="font-black text-navy text-sm">No personalised assets yet</p>
      <p className="text-xs text-navy/40 font-medium mt-1 max-w-xs">
        Your custom assets will appear here once prepared by the team. General assets are available below.
      </p>
    </div>
  )
}
