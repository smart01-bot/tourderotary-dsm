import { CommunicationPanel } from '@/components/hq/CommunicationPanel'

export default function CommunicationsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Communications</h1>
        <p className="text-navy/50 font-medium mt-1">
          Send bulk email or SMS to participants and volunteers.
        </p>
      </div>
      <CommunicationPanel />
    </div>
  )
}
