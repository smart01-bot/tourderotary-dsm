import { SITE } from '@/config/site'

export function AuthBrandPanel() {
  return (
    <div className="relative flex flex-col justify-between w-full h-full min-h-screen bg-navy px-10 py-12 overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 bg-road-stripe opacity-40 pointer-events-none" />

      {/* Glow blobs */}
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-magenta/10 blur-3xl pointer-events-none" />

      {/* Wordmark */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shrink-0">
            <span className="text-navy font-black text-xl leading-none">T</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight">{SITE.shortName}</span>
        </div>
        <p className="text-gold text-eyebrow">{SITE.tagline}</p>
      </div>

      {/* Headline */}
      <div className="relative z-10">
        <h2 className="text-white font-black text-display-lg leading-tight mb-5">
          Ride.<br />Walk.<br />Change lives.
        </h2>
        <p className="text-white/55 text-sm leading-relaxed max-w-[280px]">
          {SITE.description}
        </p>
      </div>

      {/* Event badge */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-3 bg-white/8 border border-white/12 rounded-xl px-4 py-3">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">{SITE.eventDate}</p>
            <p className="text-white/45 text-xs">{SITE.location}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
