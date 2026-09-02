import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { PhaseProvider } from '@/context/PhaseContext'
import { UserProvider }  from '@/context/UserContext'
import { CartProvider }  from '@/context/CartContext'
import { SITE } from '@/config/site'

// ── Montserrat font ────────────────────────────────────────────────────────
const montserrat = Montserrat({
  subsets:  ['latin'],
  variable: '--font-montserrat',
  display:  'swap',
  weight:   ['400', '500', '600', '700', '800', '900'],
})

// ── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    type:        'website',
    siteName:    SITE.name,
    title:       `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images:      [SITE.ogImage],
    creator:     SITE.twitterHandle,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor:        '#0D1B3D',
  colorScheme:       'light',
  initialScale:       1,
  width:             'device-width',
}

// ── Root Layout ────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-screen font-sans antialiased">
        <UserProvider>
          <PhaseProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </PhaseProvider>
        </UserProvider>
      </body>
    </html>
  )
}
