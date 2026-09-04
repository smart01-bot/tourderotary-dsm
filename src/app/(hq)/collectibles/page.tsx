import { Medal, Construction } from 'lucide-react'

export default function CollectiblesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Collectibles</h1>
        <p className="text-navy/50 font-medium mt-1">
          Medals, finisher certificates, and event mementos.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 p-12 flex flex-col items-center text-center shadow-card-navy">
        <div className="w-14 h-14 rounded-2xl bg-gold-50 text-gold flex items-center justify-center mb-4">
          <Medal size={28} />
        </div>
        <p className="font-black text-navy text-sm mb-1">Coming in a later build</p>
        <p className="text-xs text-navy/40 font-medium max-w-xs leading-relaxed">
          Collectible management — medals inventory, finisher certificate generation,
          and digital memento dispatch — will be enabled post-event.
        </p>
        <div className="flex items-center gap-1.5 mt-4 text-xs text-navy/30 font-semibold">
          <Construction size={12} />
          Planned for post-event phase
        </div>
      </div>
    </div>
  )
}
