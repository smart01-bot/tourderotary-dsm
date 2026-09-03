import { Badge } from '@/components/ui/Badge'
import type { RegistrationStatus } from '@/types'

interface Props {
  status: RegistrationStatus
  activityName: string
  bibNumber?: string | null
  className?: string
}

const STATUS: Record<RegistrationStatus, {
  label: string
  variant: 'success' | 'warning' | 'navy' | 'error' | 'gold' | 'magenta' | 'neutral'
  description: string
}> = {
  pending:    { label: 'Pending',    variant: 'warning', description: 'Awaiting payment to confirm your spot.'   },
  confirmed:  { label: 'Confirmed',  variant: 'navy',    description: 'Confirmed — complete payment to lock in.' },
  paid:       { label: 'Paid',       variant: 'success', description: 'All set! Your spot is secured.'           },
  cancelled:  { label: 'Cancelled',  variant: 'error',   description: 'This registration has been cancelled.'    },
  checked_in: { label: 'Checked In', variant: 'success', description: 'Welcome to Tour de Rotary DSM!'           },
}

export function RegistrationStatus({ status, activityName, bibNumber, className }: Props) {
  const cfg = STATUS[status]

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-sm font-semibold text-navy">{activityName}</span>
        <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
      </div>
      <p className="text-xs text-navy/50">{cfg.description}</p>
      {bibNumber && (
        <p className="text-xs font-bold text-navy mt-1.5">BIB #{bibNumber}</p>
      )}
    </div>
  )
}
