import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  rightElement?: ReactNode
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, rightElement, className, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="block text-sm font-semibold text-navy">
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            className={cn(
              'w-full px-4 py-3 rounded-xl border bg-white',
              'text-sm font-medium text-navy placeholder:text-navy/35',
              'transition-all duration-150 outline-none',
              'focus:ring-2 focus:ring-gold/40 focus:border-gold',
              error
                ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
                : 'border-navy/20 hover:border-navy/40',
              rightElement && 'pr-12',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
            }
            {...props}
          />

          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p id={`${fieldId}-error`} role="alert" className="text-xs text-red-500 font-medium">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${fieldId}-hint`} className="text-xs text-navy/45">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
