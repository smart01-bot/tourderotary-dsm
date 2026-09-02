import { Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "Riding for a cause makes every kilometre feel like it counts double. Tour de Rotary DSM is the event I'll talk about for years.",
    name: 'Amina M.',
    role: 'Cyclathon participant, 2025',
    initials: 'AM',
    color: 'bg-gold text-navy',
  },
  {
    quote: "My family has been touched by cancer. Being part of this event was healing in a way I didn't expect. I'll be back in 2026.",
    name: 'Joash K.',
    role: 'Marathon finisher, 2025',
    initials: 'JK',
    color: 'bg-magenta text-white',
  },
  {
    quote: "The Zumba session was the most fun I've had at any charity event. Rotaract knows how to bring Dar es Salaam together.",
    name: 'Fatuma N.',
    role: 'Zumba participant, 2025',
    initials: 'FN',
    color: 'bg-navy text-white',
  },
]

export function Testimonials() {
  return (
    <section
      className="bg-white py-section"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-site">

        <div className="text-center mb-12">
          <p className="text-eyebrow text-gold mb-3">What participants say</p>
          <h2
            id="testimonials-heading"
            className="text-section-heading text-navy"
          >
            The ride speaks for itself.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <figure
              key={t.name}
              className="p-6 rounded-card border border-navy/8 hover:border-gold/25 hover:shadow-md transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-gold/30 mb-4" aria-hidden />
              <blockquote className="text-navy/70 text-sm leading-relaxed mb-5 italic">
                "{t.quote}"
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-navy font-semibold text-sm">{t.name}</p>
                  <p className="text-navy/45 text-xs">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}