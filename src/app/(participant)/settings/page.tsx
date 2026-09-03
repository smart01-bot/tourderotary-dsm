'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { updateProfile } from '@/lib/supabase/queries/participant'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function SettingsPage() {
  const { user, role }          = useUser()
  const [fullName,  setName]    = useState('')
  const [loading,   setLoading] = useState(false)
  const [saved,     setSaved]   = useState(false)
  const [error,     setError]   = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !fullName.trim()) return
    setError(null)
    setLoading(true)

    const { error: updateError } = await updateProfile(user.id, { full_name: fullName.trim() })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8 max-w-md">
      <div>
        <h1 className="text-display-sm font-black text-navy mb-1">Settings</h1>
        <p className="text-navy/50 text-sm">Manage your account details.</p>
      </div>

      {/* Account info */}
      <div className="rounded-2xl border border-navy/12 bg-white p-5 space-y-4">
        <h2 className="font-bold text-navy">Account</h2>
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest">Email</p>
          <p className="text-sm text-navy font-medium">{user?.email ?? '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-navy/50 uppercase tracking-widest">Role</p>
          {role ? <Badge variant="gold">{role}</Badge> : <span className="text-sm text-navy/40">—</span>}
        </div>
      </div>

      {/* Update name */}
      <div className="rounded-2xl border border-navy/12 bg-white p-5">
        <h2 className="font-bold text-navy mb-4">Update name</h2>
        <form onSubmit={handleSave} className="space-y-4" noValidate>
          <FormField
            label="Full name"
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
              <CheckCircle size={16} />
              Saved successfully
            </div>
          )}

          <Button type="submit" loading={loading} disabled={!fullName.trim()}>
            Save changes
          </Button>
        </form>
      </div>
    </div>
  )
}
