'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Menu, X, User, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore, categories } from '@/lib/store'
import { CartDrawer } from './cart-drawer'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
        <p>Frete grátis para compras acima de R$ 299 | Parcele em até 10x sem juros</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-accent transition-colors">
                  Início
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categoria/${category.id}`}
                    className="text-lg font-medium hover:text-accent transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link href="/novidades" className="text-lg font-medium hover:text-accent transition-colors">
                  Novidades
                </Link>
                <Link href="/promocoes" className="text-lg font-medium hover:text-accent transition-colors">
                  Promoções
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-k10.jpg" alt="K10 Store.outlet" className="h-10 lg:h-12 w-auto rounded" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-serif text-xl lg:text-2xl font-bold tracking-tight">K10 Store</span>
              <span className="text-xs text-muted-foreground tracking-widest">.outlet</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
              Início
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.id}`}
                className="text-sm font-medium hover:text-accent transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/novidades" className="text-sm font-medium text-accent">
              Novidades
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Buscar produtos..."
                    className="w-64"
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Buscar</span>
                </Button>
              )}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>

            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favoritos</span>
            </Button>

            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
              <span className="sr-only">Conta</span>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Carrinho</span>
            </Button>
          </div>
        </div>
      </div>

      <CartDrawer />
    </header>
  )
}
