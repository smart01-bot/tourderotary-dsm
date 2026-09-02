import { Heart, Shield, Users } from 'lucide-react'
import { RibbonDivider } from '@/components/ui/RibbonDivider'

const pillars = [
  {
    icon: Heart,
    title: 'The Need',
    body: 'Cancer is the leading cause of death among Tanzanians under 70. Most families face diagnosis with no financial safety net — treatment is simply out of reach.',
  },
  {
    icon: Shield,
    title: 'What We Fund',
    body: 'Every shilling raised goes directly to treatment costs, transport, and support for patients at Dar es Salaam\'s Ocean Road Cancer Institute and partnering clinics.',
  },
  {
    icon: Users,
    title: 'Who We Are',
    body: 'Rotaract 4 Compassion is a youth-led service club in Dar es Salaam, part of Rotary International, committed to health equity and community action in Tanzania.',
  },
]

export function CharityStory() {
  return (
    <section
      className="bg-white py-section"
      aria-labelledby="charity-story-heading"
    >
      <div className="container-site">

        {/* Eyebrow + heading */}
        <div className="max-w-3xl mb-12">
          <p className="text-eyebrow text-magenta mb-3">Why this matters</p>
          <h2
            id="charity-story-heading"
            className="text-section-heading text-navy mb-5"
          >
            Every kilometre is a{' '}
            <span className="text-magenta">lifeline.</span>
          </h2>
          <p className="text-navy/65 text-lg leading-relaxed">
            Tour de Rotary DSM was born from a simple truth: in Tanzania, a cancer
            diagnosis can destroy a family financially before it destroys them medically.
            We move — by bike, on foot, in dance — so others can afford to fight.
          </p>
        </div>

        <RibbonDivider variant="magenta" className="mb-12" />

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group p-6 rounded-card border border-navy/8 hover:border-magenta/25 hover:shadow-md transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-magenta/8 flex items-center justify-center mb-4 group-hover:bg-magenta/15 transition-colors">
                <Icon className="w-5 h-5 text-magenta" aria-hidden />
              </div>
              <h3 className="font-bold text-navy text-lg mb-2">{title}</h3>
              <p className="text-navy/60 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <blockquote className="mt-14 border-l-4 border-gold pl-6 py-2 max-w-2xl">
          <p className="text-navy text-xl font-semibold italic leading-snug">
            "No one should have to choose between paying rent and treating cancer.
            That is the injustice we are riding to change."
          </p>
          <footer className="mt-3 text-navy/50 text-sm font-medium">
            — Rotaract 4 Compassion, Dar es Salaam
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
