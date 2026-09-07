'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, User, Shield } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { updateProfile } from '@/lib/supabase/queries/participant'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

export default function SettingsPage() {
  const { user, role }              = useUser()
  const [fullName,    setName]      = useState('')
  const [phone,       setPhone]     = useState('')
  const [emergency,   setEmergency] = useState('')
  const [shirtSize,   setShirt]     = useState<string>('M')
  const [loading,     setLoading]   = useState(false)
  const [saved,       setSaved]     = useState(false)
  const [error,       setError]     = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !fullName.trim()) return
    setError(null)
    setLoading(true)

    const { error: updateError } = await updateProfile(user.id, {
      full_name:        fullName.trim(),
      // phone and emergency stored in user_metadata / profile table extension
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-5 max-w-md">
      <div>
        <h1 className="text-2xl font-black text-navy mb-1">Settings</h1>
        <p className="text-navy/50 text-sm">Manage your profile and preferences.</p>
      </div>

      {/* Account info */}
      <div className="rounded-2xl border border-navy/12 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={15} className="text-navy/40" />
          <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest">Account</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-navy/8">
            <div>
              <p className="text-[10px] font-semibold text-navy/40 uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-sm font-medium text-navy">{user?.email ?? '—'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-[10px] font-semibold text-navy/40 uppercase tracking-wide mb-1">Role</p>
              {role ? <Badge variant="gold">{role}</Badge> : <span className="text-sm text-navy/40">—</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="rounded-2xl border border-navy/12 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <User size={15} className="text-navy/40" />
          <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest">Profile</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4" noValidate>
          <FormField
            label="Full name"
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
          <FormField
            label="Phone"
            type="tel"
            placeholder="+255 7XX XXX XXX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            autoComplete="tel"
          />
          <FormField
            label="Emergency contact"
            type="tel"
            placeholder="Name & phone number"
            value={emergency}
            onChange={e => setEmergency(e.target.value)}
          />

          {/* Shirt size */}
          <div>
            <p className="text-xs font-semibold text-navy/60 mb-2">T-shirt size</p>
            <div className="flex gap-2">
              {SHIRT_SIZES.map(sz => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setShirt(sz)}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all',
                    shirtSize === sz
                      ? 'border-gold bg-gold/12 text-gold-700'
                      : 'border-navy/12 text-navy/55 hover:border-navy/30'
                  )}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-medium">
              <CheckCircle size={16} /> Saved successfully
            </div>
          )}

          <Button
            type="submit"
            variant="secondary"
            loading={loading}
            disabled={!fullName.trim()}
            fullWidth
          >
            Save changes
          </Button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-100 bg-white p-5">
        <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest mb-3">
          Danger zone
        </p>
        <Button variant="danger" size="sm" fullWidth>
          Delete my account
        </Button>
      </div>
    </div>
  )
}
