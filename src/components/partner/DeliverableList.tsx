import { CalendarDays, MessageSquare, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DELIVERABLE_STATUS_META,
  type PartnerDeliverable,
} from '@/lib/supabase/queries/partner'

interface DeliverableListProps {
  items:      PartnerDeliverable[]
  className?: string
}

export function DeliverableList({ items, className }: DeliverableListProps) {
  if (items.length === 0) {
    return (
      <div className={cn(
        'bg-white rounded-2xl border border-navy-100 p-10 flex flex-col items-center text-center shadow-card-navy',
        className
      )}>
        <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy/40 flex items-center justify-center mb-4">
          <Inbox size={24} />
        </div>
        <p className="font-black text-navy text-sm">No deliverables yet</p>
        <p className="text-xs text-navy/40 font-medium mt-1 max-w-xs">
          The HQ team will assign your deliverables here. Check back closer to the event.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <DeliverableRow key={item.id} item={item} />
      ))}
    </div>
  )
}

// ── Single deliverable row ──────────────────────────────────────────────────

function DeliverableRow({ item }: { item: PartnerDeliverable }) {
  const meta    = DELIVERABLE_STATUS_META[item.status]
  const dueDate = item.due_date ? formatDueDate(item.due_date) : null
  const isPast  = item.due_date ? new Date(item.due_date) < new Date() : false

  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-5 shadow-card-navy">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-sm font-black text-navy leading-snug">{item.title}</h3>
        <StatusBadge label={meta.label} color={meta.color} dot={meta.dot} />
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-sm text-navy/60 font-medium leading-relaxed mb-3">
          {item.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mt-2">
        {dueDate && (
          <span className={cn(
            'flex items-center gap-1.5 text-xs font-semibold',
            isPast && item.status !== 'completed'
              ? 'text-magenta'
              : 'text-navy/40'
          )}>
            <CalendarDays size={12} aria-hidden />
            {dueDate}
          </span>
        )}

        {item.hq_notes && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-navy/40">
            <MessageSquare size={12} aria-hidden />
            HQ note
          </span>
        )}
      </div>

      {/* HQ notes */}
      {item.hq_notes && (
        <div className="mt-3 bg-navy-50 rounded-xl p-3">
          <p className="text-[11px] font-black text-navy/40 uppercase tracking-wider mb-1">
            Note from HQ
          </p>
          <p className="text-xs text-navy/70 font-medium leading-relaxed">
            {item.hq_notes}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({
  label, color, dot,
}: {
  label: string
  color: string
  dot:   string
}) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black whitespace-nowrap shrink-0',
      color
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} aria-hidden />
      {label}
    </span>
  )
}

// ── Date formatting ─────────────────────────────────────────────────────────

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  })
}
