'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2, X, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Seu Carrinho</h2>
            <span className="text-sm text-muted-foreground">({items.length} itens)</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione produtos ao seu carrinho para continuar comprando.
              </p>
              <Button onClick={toggleCart}>Continuar Comprando</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                  <div className="relative w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      Imagem
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.selectedSize && <span>Tamanho: {item.selectedSize}</span>}
                      {item.selectedSize && item.selectedColor && <span> | </span>}
                      {item.selectedColor && <span>Cor: {item.selectedColor}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-semibold text-sm mt-2">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-accent">Grátis</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">{formatPrice(getTotalPrice())}</span>
            </div>
            <Button className="w-full" size="lg">
              Finalizar Compra
            </Button>
            <Button variant="outline" className="w-full" onClick={clearCart}>
              Limpar Carrinho
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
