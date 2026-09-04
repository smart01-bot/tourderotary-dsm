import type { ReactNode } from 'react'
import { Sidebar } from '@/components/sponsor/Sidebar'

export default function SponsorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <Sidebar />
      <div className="lg:pl-60">
        <div className="h-16 lg:hidden" />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
