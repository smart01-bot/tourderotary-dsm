'use client'

import { createContext, useState, useCallback, type ReactNode } from 'react'
import type { CartItem } from '@/types'
import type { CartContextValue } from '@/hooks/useCart'

export const CartContext = createContext<CartContextValue | null>(null)

function itemKey(productId: string, size?: string) {
  return size ? `${productId}::${size}` : productId
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const key = itemKey(item.productId, item.size)
      const existing = prev.find(i => itemKey(i.productId, i.size) === key)

      if (existing) {
        return prev.map(i =>
          itemKey(i.productId, i.size) === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((productId: string, size?: string) => {
    const key = itemKey(productId, size)
    setItems(prev => prev.filter(i => itemKey(i.productId, i.size) !== key))
  }, [])

  const updateQty = useCallback((productId: string, qty: number, size?: string) => {
    const key = itemKey(productId, size)
    if (qty <= 0) {
      setItems(prev => prev.filter(i => itemKey(i.productId, i.size) !== key))
    } else {
      setItems(prev =>
        prev.map(i => itemKey(i.productId, i.size) === key ? { ...i, quantity: qty } : i)
      )
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
