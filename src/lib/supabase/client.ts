import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Singleton browser client — import this wherever you need Supabase in client components.
// Never create a second instance; Next.js HMR can create duplicate connections.
let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseClient() {
  if (client) return client

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}

// Convenience default export
export const supabase = getSupabaseClient()
