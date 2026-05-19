import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/store'

export default function PromocoesPage() {
  const discountedProducts = products.filter((p) => p.originalPrice)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-accent py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl text-accent-foreground">
              <p className="font-medium mb-2 uppercase text-sm tracking-wider opacity-80">
                Ofertas Especiais
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Promoções
              </h1>
              <p className="text-lg opacity-90">
                Aproveite descontos incríveis em produtos selecionados. 
                Ofertas por tempo limitado - não perca!
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {discountedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  Nenhuma promoção disponível no momento.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
