'use client'

import { useContext } from 'react'
import { CartContext } from '@/context/CartContext'
import type { CartItem } from '@/types'

export interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string) => void
  updateQty: (productId: string, qty: number, size?: string) => void
  clearCart: () => void
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)

  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return ctx
}
