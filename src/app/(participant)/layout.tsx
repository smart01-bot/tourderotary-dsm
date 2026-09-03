import type { ReactNode } from 'react'
import { Sidebar } from '@/components/participant/Sidebar'

export default function ParticipantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <Sidebar />
      {/* lg:pl-60 offsets the fixed sidebar on desktop */}
      <div className="lg:pl-60">
        {/* Mobile spacer so content clears the hamburger button */}
        <div className="h-16 lg:hidden" />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
