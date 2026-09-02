import type { NavLink } from '@/types'
import { SOCIAL } from '@/lib/constants'

export const SITE = {
  name:        'Tour de Rotary DSM',
  shortName:   'TdR DSM',
  tagline:     'Ride Together',
  description: 'A charity cycling and multi-activity event in Dar es Salaam, Tanzania — raising funds for cancer care for Tanzanian families. Organised by Rotaract 4 Compassion.',
  url:         'https://tourderotarydsm.co.tz',
  organiser:   'Rotaract 4 Compassion',
  eventDate:   '1 November 2026',
  location:    'Dar es Salaam, Tanzania',
  social:      SOCIAL,

  // Open Graph / SEO
  ogImage: '/assets/marketing/og-image.jpg',
  twitterHandle: '@rotaract4compassion',
} as const

// ── Public navigation ──────────────────────────────────────────────────────
export const PUBLIC_NAV: NavLink[] = [
  { label: 'About',      href: '/about'      },
  { label: 'Activities', href: '/activities' },
  { label: 'Merch',      href: '/merch'      },
  { label: 'Sponsors',   href: '/sponsors'   },
  { label: 'Contact',    href: '/contact'    },
]

// ── Footer link groups ─────────────────────────────────────────────────────
export const FOOTER_LINKS = {
  event: [
    { label: 'About the Event', href: '/about'      },
    { label: 'Activities',      href: '/activities' },
    { label: 'Sponsors',        href: '/sponsors'   },
    { label: 'Contact',         href: '/contact'    },
  ],
  participate: [
    { label: 'Register Now',    href: '/signup'     },
    { label: 'Merch Store',     href: '/merch'      },
    { label: 'Social Frame',    href: '/frame'      },
    { label: 'My Dashboard',    href: '/dashboard'  },
  ],
  legal: [
    { label: 'Privacy Policy',  href: '/privacy'    },
    { label: 'Terms of Use',    href: '/terms'      },
    { label: 'Refund Policy',   href: '/refunds'    },
  ],
} as const
