'use client'

import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import type { UserRole, UserContextValue } from '@/types'
import { supabase } from '@/lib/supabase/client'

export const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User | null>(null)
  const [role, setRole]   = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRole = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    setRole((data?.role as UserRole) ?? null)
  }, [])

  useEffect(() => {
    // Hydrate from existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchRole(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchRole(session.user.id)
        } else {
          setRole(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchRole])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }, [])

  return (
    <UserContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </UserContext.Provider>
  )
}
