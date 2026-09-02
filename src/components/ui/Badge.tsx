import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type BadgeVariant = 'gold' | 'navy' | 'magenta' | 'success' | 'warning' | 'error' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:    'bg-gold/15 text-gold-700 border border-gold/30',
  navy:    'bg-navy/10 text-navy border border-navy/20',
  magenta: 'bg-magenta/10 text-magenta border border-magenta/25',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error:   'bg-red-50 text-red-700 border border-red-200',
  neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
}

const dotColors: Record<BadgeVariant, string> = {
  gold:    'bg-gold',
  navy:    'bg-navy',
  magenta: 'bg-magenta',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error:   'bg-red-500',
  neutral: 'bg-gray-400',
}

export function Badge({ variant = 'neutral', size = 'sm', dot, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-pill',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden
        />
      )}
      {children}
    </span>
  )
}
