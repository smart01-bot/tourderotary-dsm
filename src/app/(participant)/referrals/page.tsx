'use client'

import { useUser } from '@/hooks/useUser'
import { ReferralCard } from '@/components/participant/ReferralCard'

export default function ReferralsPage() {
  const { user } = useUser()

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h1 className="text-display-sm font-black text-navy mb-1">Referrals</h1>
        <p className="text-navy/50 text-sm">
          Invite others to join and grow the impact of Tour de Rotary DSM.
        </p>
      </div>

      {user && <ReferralCard userId={user.id} />}
    </div>
  )
}
