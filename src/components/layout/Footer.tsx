import Link from 'next/link'
import { Instagram, Twitter, Facebook, Linkedin, Heart } from 'lucide-react'
import { SITE, FOOTER_LINKS } from '@/config/site'
import { RibbonDivider } from '@/components/ui/RibbonDivider'
import { cn } from '@/lib/utils'

const socialLinks = [
  { href: SITE.social.instagram, label: 'Instagram', Icon: Instagram },
  { href: SITE.social.twitter,   label: 'Twitter / X', Icon: Twitter },
  { href: SITE.social.facebook,  label: 'Facebook',  Icon: Facebook },
  { href: SITE.social.linkedin,  label: 'LinkedIn',  Icon: Linkedin },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white" aria-label="Site footer">
      {/* Gold ribbon divider */}
      <RibbonDivider className="px-8 pt-12" />

      {/* Main footer content */}
      <div className="container-site py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <p className="text-gold font-black text-sm tracking-widest uppercase mb-1">
              Tour de Rotary DSM
            </p>
            <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
              Ride Together
            </p>
            <p className="text-white/55 text-sm leading-relaxed mb-6">
              A charity event raising funds for cancer care for Tanzanian families.
              Organised by Rotaract 4 Compassion in Dar es Salaam.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    'p-2 rounded-lg text-white/40 hover:text-gold',
                    'hover:bg-white/8 transition-all duration-150'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          <div>
            <p className="text-eyebrow text-gold mb-4">Event</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.event.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-eyebrow text-gold mb-4">Participate</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.participate.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-eyebrow text-gold mb-4">Legal</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/35 text-xs text-center sm:text-left">
            © {year} {SITE.organiser}. All rights reserved. Dar es Salaam, Tanzania.
          </p>
          <p className="text-white/25 text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-magenta" aria-hidden /> for a cause that matters.
          </p>
        </div>
      </div>
    </footer>
  )
}
