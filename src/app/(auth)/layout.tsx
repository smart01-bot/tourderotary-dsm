import type { ReactNode } from 'react'
import { AuthBrandPanel } from '@/components/forms/AuthBrandPanel'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[460px] xl:w-[500px] shrink-0">
        <AuthBrandPanel />
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-[#F7F6F3] min-h-screen">
        {children}
      </div>
    </div>
  )
}
