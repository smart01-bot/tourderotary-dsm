import { Navbar }      from '@/components/layout/Navbar'
import { Footer }      from '@/components/layout/Footer'
import { PhaseBanner } from '@/components/layout/PhaseBanner'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PhaseBanner />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
