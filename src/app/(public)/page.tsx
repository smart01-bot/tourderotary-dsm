import type { Metadata } from 'next'
import { HeroSection }      from '@/components/sections/HeroSection'
import { CharityStory }     from '@/components/sections/CharityStory'
import { ActivityGrid }     from '@/components/sections/ActivityGrid'
import { ImpactNumbers }    from '@/components/sections/ImpactNumbers'
import { CountdownStrip }   from '@/components/sections/CountdownStrip'
import { MerchPreview }     from '@/components/sections/MerchPreview'
import { SponsorWall }      from '@/components/sections/SponsorWall'
import { Testimonials }     from '@/components/sections/Testimonials'
import { NewsletterSignup } from '@/components/sections/NewsletterSignup'
import { SITE } from '@/config/site'

// ── SEO ────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: {
    canonical: SITE.url,
  },
}

// ── Page ───────────────────────────────────────────────────────────────────
// SECTION ORDER — do not reorder without updating the design doc.
// 1  Hero          — conversion gateway: headline + countdown + primary CTA
// 2  CharityStory  — why this matters (emotional anchor)
// 3  ActivityGrid  — the 6 activities (product offering)
// 4  ImpactNumbers — proof of scale (social proof / credibility)
// 5  CountdownStrip— urgency reinforcement
// 6  MerchPreview  — secondary revenue stream, post-registration upsell
// 7  SponsorWall   — credibility via partner logos
// 8  Testimonials  — social proof from previous participants
// 9  Newsletter     — email capture for non-ready visitors
export default function LandingPage() {
  return (
    <>
      {/* 1 — Hero */}
      <HeroSection />

      {/* 2 — Why it matters */}
      <CharityStory />

      {/* 3 — The 6 activities */}
      <ActivityGrid />

      {/* 4 — Impact numbers */}
      <ImpactNumbers />

      {/* 5 — Countdown reinforcement */}
      <CountdownStrip />

      {/* 6 — Merch teaser */}
      <MerchPreview />

      {/* 7 — Sponsor wall */}
      <SponsorWall />

      {/* 8 — Testimonials */}
      <Testimonials />

      {/* 9 — Newsletter capture */}
      <NewsletterSignup />
    </>
  )
}
