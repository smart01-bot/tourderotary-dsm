import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// Placeholder merch items — replaced by real product data in the merch build
const MERCH_TEASER = [
  { name: 'Event Jersey',         price: 65_000, tag: 'Bestseller', color: 'bg-navy'    },
  { name: 'Finisher Tee',         price: 35_000, tag: 'New',        color: 'bg-gold'    },
  { name: 'Water Bottle',         price: 25_000, tag: null,         color: 'bg-magenta' },
  { name: 'Commemorative Cap',    price: 30_000, tag: 'Limited',    color: 'bg-navy'    },
]

function formatTShLocal(n: number) {
  return `TSh ${n.toLocaleString('en-TZ')}`
}

export function MerchPreview() {
  return (
    <section
      className="bg-white py-section"
      aria-labelledby="merch-preview-heading"
    >
      <div className="container-site">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-eyebrow text-gold mb-3">Official merch</p>
            <h2
              id="merch-preview-heading"
              className="text-section-heading text-navy"
            >
              Wear the ride.
            </h2>
            <p className="text-navy/55 mt-2 max-w-md">
              Official Tour de Rotary DSM gear — available exclusively to registered participants
              and the public from the online store.
            </p>
          </div>

          <Link href="/merch">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<ShoppingBag className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Browse store
            </Button>
          </Link>
        </div>

        {/* Merch card grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MERCH_TEASER.map(item => (
            <div
              key={item.name}
              className={cn(
                'group relative rounded-card overflow-hidden',
                'border border-navy/8 hover:border-navy/20',
                'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-navy'
              )}
            >
              {/* Colour swatch placeholder — replace with <Image> when assets are ready */}
              <div className={cn('h-40 w-full flex items-center justify-center', item.color)}>
                <ShoppingBag className="w-8 h-8 text-white/30" aria-hidden />
              </div>

              {/* Tag */}
              {item.tag && (
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white text-navy">
                  {item.tag}
                </span>
              )}

              {/* Details */}
              <div className="p-3">
                <p className="text-navy font-semibold text-sm mb-0.5">{item.name}</p>
                <p className="text-gold font-bold text-sm">{formatTShLocal(item.price)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Participant note */}
        <p className="mt-6 text-center text-navy/40 text-sm">
          🎽 Registered participants get exclusive early access and participant-only pricing.
        </p>
      </div>
    </section>
  )
}
