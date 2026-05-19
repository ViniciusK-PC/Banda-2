import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { products, categories } from '@/lib/store'
import { notFound } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.id,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.id === slug)

  if (!category) {
    notFound()
  }

  const categoryProducts = products.filter((p) => p.category === slug)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="text-accent font-medium mb-2 uppercase text-sm tracking-wider">
                Categoria
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                {category.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {category.description}. Explore nossa seleção de {categoryProducts.length} produtos.
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
              <p className="text-sm text-muted-foreground">
                Mostrando {categoryProducts.length} produtos
              </p>
              <div className="flex items-center gap-4">
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="price-asc">Menor preço</SelectItem>
                    <SelectItem value="price-desc">Maior preço</SelectItem>
                    <SelectItem value="newest">Mais recentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {categoryProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  Nenhum produto encontrado nesta categoria.
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
