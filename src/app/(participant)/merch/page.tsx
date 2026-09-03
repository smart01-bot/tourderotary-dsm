'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { useCart } from '@/hooks/useCart'
import { getProducts } from '@/lib/supabase/queries/participant'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn, formatTSh } from '@/lib/utils'

type DBProduct = {
  id: string
  name: string
  slug: string
  description: string | null
  price_participant: number
  price_public: number
  image_url: string | null
  category: string | null
  sizes: string[]
  stock: number
}

export default function MerchPage() {
  const { user }                               = useUser()
  const { addItem, items, totalItems }         = useCart()
  const [products,      setProducts]           = useState<DBProduct[]>([])
  const [loading,       setLoading]            = useState(true)
  const [selectedSizes, setSelectedSizes]      = useState<Record<string, string>>({})

  useEffect(() => {
    getProducts().then(({ data }) => {
      setProducts((data as DBProduct[]) ?? [])
      setLoading(false)
    })
  }, [])

  const handleAdd = (product: DBProduct) => {
    const price = user ? product.price_participant : product.price_public
    addItem({
      productId: product.id,
      name:      product.name,
      price,
      quantity:  1,
      size:      selectedSizes[product.id] || undefined,
      imageUrl:  product.image_url ?? '',
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-display-sm font-black text-navy mb-1">Merch</h1>
          <p className="text-navy/50 text-sm">
            {user ? 'Participant pricing applied.' : 'Sign in for participant pricing.'}
          </p>
        </div>
        {totalItems > 0 && (
          <div className="flex items-center gap-2 bg-navy text-white px-3 py-1.5 rounded-xl text-sm font-semibold">
            <ShoppingCart size={16} />
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-navy/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-navy/10 bg-white">
          <p className="text-navy/50 text-sm">Merch coming soon — check back closer to the event.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => {
            const price        = user ? product.price_participant : product.price_public
            const hasSize      = product.sizes.length > 0
            const selectedSize = selectedSizes[product.id]
            const inCart       = items.filter(i => i.productId === product.id).reduce((n, i) => n + i.quantity, 0)

            return (
              <div key={product.id} className="rounded-2xl border border-navy/12 bg-white overflow-hidden flex flex-col">
                {/* Image */}
                <div className="h-40 bg-navy/5 flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👕</span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-navy text-sm">{product.name}</h3>
                    {product.category && <Badge variant="neutral" size="sm">{product.category}</Badge>}
                  </div>

                  {product.description && (
                    <p className="text-xs text-navy/50 mb-3 line-clamp-2">{product.description}</p>
                  )}

                  {/* Size pills */}
                  {hasSize && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                          className={cn(
                            'px-2 py-0.5 rounded-lg text-xs font-semibold border transition-all',
                            selectedSize === size
                              ? 'border-gold bg-gold/10 text-navy'
                              : 'border-navy/15 text-navy/55 hover:border-navy/30'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="font-bold text-navy text-sm">{formatTSh(price)}</p>
                      {inCart > 0 && <p className="text-[10px] text-navy/40">{inCart} in cart</p>}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(product)}
                      disabled={hasSize && !selectedSize}
                      title={hasSize && !selectedSize ? 'Select a size first' : undefined}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
