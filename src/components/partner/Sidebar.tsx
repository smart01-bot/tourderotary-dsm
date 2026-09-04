'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ClipboardList, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { signOut } from '@/lib/supabase/auth'
import { SITE } from '@/config/site'

const NAV = [
  { href: '/partner/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/partner/deliverables', label: 'Deliverables', icon: ClipboardList   },
]

export function Sidebar() {
  const pathname              = usePathname()
  const router                = useRouter()
  const { user }              = useUser()
  const [open,    setOpen]    = useState(false)
  const [exiting, setExiting] = useState(false)

  const isActive = (href: string) => pathname === href

  const handleSignOut = async () => {
    setExiting(true)
    await signOut()
    router.replace('/login')
  }

  const panel = (
    <aside className="flex flex-col h-full w-60 bg-navy px-4 py-6">
      {/* Wordmark */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shrink-0">
          <span className="text-navy font-black text-sm">T</span>
        </div>
        <div className="min-w-0">
          <span className="text-white font-black text-base tracking-tight">{SITE.shortName}</span>
          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Partner</p>
        </div>
        <button
          className="ml-auto lg:hidden text-white/50 hover:text-white transition-colors"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive(href)
                ? 'bg-gold text-navy'
                : 'text-white/60 hover:bg-white/8 hover:text-white'
            )}
          >
            <Icon size={18} className="shrink-0" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="border-t border-white/10 pt-4 mt-4">
        {user?.email && (
          <p className="px-3 mb-3 text-white/40 text-xs truncate">{user.email}</p>
        )}
        <button
          onClick={handleSignOut}
          disabled={exiting}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold
                     text-white/50 hover:bg-white/8 hover:text-white transition-all duration-150
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LogOut size={18} className="shrink-0" aria-hidden />
          {exiting ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-navy text-white shadow-card-navy"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="hidden lg:flex fixed inset-y-0 left-0 z-40">{panel}</div>

      <div className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-smooth',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {panel}
      </div>
    </>
  )
}
