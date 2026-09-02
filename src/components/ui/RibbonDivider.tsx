import { cn } from '@/lib/utils'

type RibbonVariant = 'gold' | 'magenta' | 'navy'

interface RibbonDividerProps {
  variant?: RibbonVariant
  className?: string
  label?: string
}

const ribbonColors: Record<RibbonVariant, string> = {
  gold:    'from-transparent via-gold to-transparent',
  magenta: 'from-transparent via-magenta to-transparent',
  navy:    'from-transparent via-navy to-transparent',
}

const dotColors: Record<RibbonVariant, string> = {
  gold:    'bg-gold',
  magenta: 'bg-magenta',
  navy:    'bg-navy',
}

export function RibbonDivider({ variant = 'gold', className, label }: RibbonDividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className={cn('flex-1 h-px bg-gradient-to-r', ribbonColors[variant])} />
        <span className="text-eyebrow text-gold whitespace-nowrap">{label}</span>
        <div className={cn('flex-1 h-px bg-gradient-to-l', ribbonColors[variant])} />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      <div className={cn('h-px flex-1 bg-gradient-to-r max-w-40', ribbonColors[variant])} />
      <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} aria-hidden />
      <span className={cn('w-2.5 h-2.5 rounded-full', dotColors[variant])} aria-hidden />
      <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} aria-hidden />
      <div className={cn('h-px flex-1 bg-gradient-to-l max-w-40', ribbonColors[variant])} />
    </div>
  )
}
