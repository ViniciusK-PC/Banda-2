'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product, useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem, toggleCart } = useCartStore()

  const handleAddToCart = () => {
    addItem(product, product.sizes?.[0], product.colors?.[0])
    toggleCart()
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-4">
        {/* Placeholder for image */}
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="text-xs">Adicione sua imagem</p>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground">Novo</Badge>
          )}
          {discount && (
            <Badge className="bg-accent text-accent-foreground">-{discount}%</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Quick Actions */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex gap-2">
            <Button
              className="flex-1"
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
            <Button variant="secondary" size="icon" asChild>
              <Link href={`/produto/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <Link href={`/produto/${product.id}`}>
          <h3 className="font-medium text-sm hover:text-accent transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.colors && product.colors.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {product.colors.length} {product.colors.length === 1 ? 'cor disponível' : 'cores disponíveis'}
          </p>
        )}
      </div>
    </div>
  )
}
