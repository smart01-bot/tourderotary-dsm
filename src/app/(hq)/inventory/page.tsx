'use client'

import { useEffect, useState } from 'react'
import { getAllProducts, updateProductStock, type AdminProduct } from '@/lib/supabase/queries/admin'
import { cn, formatTSh } from '@/lib/utils'

export default function InventoryPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState<Record<string, number>>({})
  const [saving,   setSaving]   = useState<string | null>(null)

  useEffect(() => {
    getAllProducts().then(({ data }) => {
      setProducts(data ?? [])
      setLoading(false)
    })
  }, [])

  const handleSaveStock = async (id: string) => {
    const newStock = editing[id]
    if (newStock === undefined) return
    setSaving(id)
    await updateProductStock(id, newStock)
    setProducts(p => p.map(pr => pr.id === id ? { ...pr, stock: newStock } : pr))
    setEditing(e => { const n = { ...e }; delete n[id]; return n })
    setSaving(null)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-display-sm font-black text-navy">Inventory</h1>
        <p className="text-navy/50 font-medium mt-1">Manage product stock levels.</p>
      </div>

      {loading ? (
        <div className="h-64 bg-navy-50 rounded-2xl animate-pulse" />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy-100 p-10 text-center shadow-card-navy">
          <p className="text-sm text-navy/30 font-medium">No products configured yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-navy-100 shadow-card-navy overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-50">
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Product</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Category</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Price (Participant)</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Price (Public)</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Sizes</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-navy/40">Stock</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {products.map(pr => {
                  const isEditing = editing[pr.id] !== undefined
                  const stockVal  = isEditing ? editing[pr.id] : pr.stock
                  const lowStock  = pr.stock <= 10
                  return (
                    <tr key={pr.id} className="hover:bg-navy-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-black text-navy">{pr.name}</p>
                        <p className="text-xs text-navy/30 font-mono">{pr.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-navy/50 font-medium capitalize">
                        {pr.category ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-navy">
                        {formatTSh(pr.price_participant)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-navy">
                        {formatTSh(pr.price_public)}
                      </td>
                      <td className="px-4 py-3 text-xs text-navy/50 font-medium">
                        {pr.sizes.length > 0 ? pr.sizes.join(', ') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={stockVal}
                          onChange={e => setEditing(ed => ({ ...ed, [pr.id]: Number(e.target.value) }))}
                          className={cn(
                            'w-20 px-2 py-1 text-sm font-black rounded-lg border text-navy',
                            'focus:outline-none focus:ring-2 focus:ring-gold/40',
                            lowStock && !isEditing
                              ? 'border-magenta bg-magenta-50 text-magenta'
                              : 'border-navy-100 bg-white'
                          )}
                        />
                      </td>
                      <td className="px-4 py-3">
                        {isEditing && (
                          <button
                            onClick={() => handleSaveStock(pr.id)}
                            disabled={saving === pr.id}
                            className="px-3 py-1 rounded-lg bg-navy text-white text-xs font-black
                                       hover:bg-navy-700 transition-colors disabled:opacity-50"
                          >
                            {saving === pr.id ? 'Saving…' : 'Save'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
