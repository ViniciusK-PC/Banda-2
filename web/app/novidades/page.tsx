import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/store'

export default function NovidadesPage() {
  const newProducts = products.filter((p) => p.isNew)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="text-accent font-medium mb-2 uppercase text-sm tracking-wider">
                Recém Chegados
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Novidades
              </h1>
              <p className="text-muted-foreground text-lg">
                Confira os produtos mais recentes da nossa coleção. Estilo e qualidade 
                em peças exclusivas que acabaram de chegar.
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {newProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  Nenhum produto novo no momento.
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
