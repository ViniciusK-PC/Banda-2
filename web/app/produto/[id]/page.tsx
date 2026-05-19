'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Truck, Shield, RefreshCw, Share2 } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { products, useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { use } from 'react'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return <ProductPageContent product={product} />
}

function ProductPageContent({ product }: { product: typeof products[0] }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const { addItem, toggleCart } = useCartStore()

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor)
    }
    toggleCart()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Início
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/categoria/${product.category}`}
              className="hover:text-foreground transition-colors capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary rounded-2xl flex items-center justify-center relative">
                <div className="text-center text-muted-foreground">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                  <p>Adicione sua imagem</p>
                </div>
                {product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    Novo
                  </Badge>
                )}
                {discount && (
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                    -{discount}%
                  </Badge>
                )}
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-secondary rounded-lg flex items-center justify-center text-xs text-muted-foreground cursor-pointer hover:ring-2 ring-primary transition-all"
                  >
                    Img {i}
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <p className="text-accent font-medium uppercase text-sm tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {discount && (
                    <Badge variant="secondary" className="text-accent">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ou 10x de {formatPrice(product.price / 10)} sem juros
                </p>
              </div>

              <Separator />

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="font-medium mb-3">
                    Cor: <span className="text-muted-foreground font-normal">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">
                      Tamanho: <span className="text-muted-foreground font-normal">{selectedSize}</span>
                    </p>
                    <button className="text-sm text-accent hover:underline">
                      Guia de tamanhos
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg border font-medium transition-all ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="font-medium mb-3">Quantidade</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">Frete Grátis</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">Compra Segura</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">Troca Fácil</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Descrição
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Detalhes
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Avaliações
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-8">
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Produto de alta qualidade, confeccionado com materiais premium selecionados. 
                  Design exclusivo desenvolvido por nossa equipe de estilistas, combinando 
                  elegância com conforto para o seu dia a dia.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Características</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Material de alta qualidade</li>
                    <li>• Acabamento premium</li>
                    <li>• Design exclusivo</li>
                    <li>• Confortável para uso diário</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Cuidados</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Lavar à mão ou máquina em ciclo delicado</li>
                    <li>• Não usar alvejante</li>
                    <li>• Secar à sombra</li>
                    <li>• Passar em temperatura média</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-8">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Este produto ainda não possui avaliações.
                </p>
                <Button variant="outline" className="mt-4">
                  Seja o primeiro a avaliar
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
