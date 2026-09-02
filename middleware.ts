import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// ── Protected route map ────────────────────────────────────────────────────
// Group prefix → required role (or 'authenticated' for any logged-in user)
const PROTECTED_ROUTES: Record<string, string> = {
  '/dashboard':   'participant',
  '/register':    'participant',
  '/ticket':      'participant',
  '/training':    'participant',
  '/orders':      'participant',
  '/collectibles':'participant',
  '/referrals':   'participant',
  '/settings':    'participant',
  '/volunteer':   'volunteer',
  '/sponsor':     'sponsor',
  '/partner':     'partner',
  '/command':     'hq_admin',
  '/participants':'hq_admin',
  '/registrations':'hq_admin',
  '/inventory':   'hq_admin',
  '/volunteers':  'hq_admin',
  '/sponsors':    'hq_admin',
  '/partners':    'hq_admin',
  '/communications':'hq_admin',
  '/phase':       'hq_admin',
  '/reports':     'hq_admin',
  '/audit':       'hq_admin',
}

// Auth pages — redirect to dashboard if already logged in
const AUTH_ROUTES = ['/login', '/signup', '/reset-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  // Build Supabase server client (reads cookies, doesn't need secret on edge)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ── Auth route guard ─────────────────────────────────────────────────────
  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // ── Protected route guard ────────────────────────────────────────────────
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find(r =>
    pathname.startsWith(r)
  )

  if (matchedRoute) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const requiredRole = PROTECTED_ROUTES[matchedRoute]

    if (requiredRole !== 'authenticated') {
      // Fetch role from DB (edge-compatible via RLS-safe anon key)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const userRole = profile?.role ?? null

      if (userRole !== requiredRole && userRole !== 'hq_admin') {
        // Wrong role → redirect to their actual portal
        const portalMap: Record<string, string> = {
          participant: '/dashboard',
          volunteer:   '/volunteer/dashboard',
          sponsor:     '/sponsor/dashboard',
          partner:     '/partner/dashboard',
          hq_admin:    '/command',
        }
        const redirect = portalMap[userRole ?? ''] ?? '/'
        return NextResponse.redirect(new URL(redirect, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|assets).*)',
  ],
}
