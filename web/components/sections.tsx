'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { categories } from '@/lib/store'

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-secondary">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <p className="text-accent font-medium mb-4 tracking-wider uppercase text-sm">
                Nova Coleção 2024
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Estilo que define
                <br />
                <span className="text-accent">quem você é</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              Descubra nossa coleção exclusiva de jaquetas, chuteiras, sapatos e bolsas. 
              Qualidade premium com design único para quem busca sofisticação.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/categoria/jaquetas">
                  Explorar Coleção
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/novidades">
                  Ver Novidades
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] bg-muted rounded-2xl flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium mb-2">Imagem Hero</p>
                <p className="text-sm">Adicione sua imagem principal aqui</p>
              </div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                  20%
                </div>
                <div>
                  <p className="font-semibold text-sm">Desconto Especial</p>
                  <p className="text-xs text-muted-foreground">Na primeira compra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Nossas Categorias</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore nossa seleção premium de produtos cuidadosamente escolhidos para você.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.id}`}
              className="group relative aspect-[3/4] bg-secondary rounded-2xl overflow-hidden"
            >
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Imagem {category.name}</p>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-primary-foreground">
                <h3 className="font-serif text-xl md:text-2xl font-bold mb-1">{category.name}</h3>
                <p className="text-sm text-primary-foreground/80 mb-3 hidden md:block">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span>{category.count} produtos</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: '🚚',
      title: 'Frete Grátis',
      description: 'Em compras acima de R$ 299',
    },
    {
      icon: '🔒',
      title: 'Pagamento Seguro',
      description: 'Seus dados sempre protegidos',
    },
    {
      icon: '↩️',
      title: 'Troca Fácil',
      description: 'Até 30 dias para trocar',
    },
    {
      icon: '💬',
      title: 'Suporte 24h',
      description: 'Estamos aqui para ajudar',
    },
  ]

  return (
    <section className="py-12 border-y border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Maria Silva',
      location: 'São Paulo, SP',
      text: 'Qualidade excepcional! A jaqueta que comprei superou todas as expectativas. Entrega rápida e embalagem impecável.',
      rating: 5,
    },
    {
      name: 'João Santos',
      location: 'Rio de Janeiro, RJ',
      text: 'As chuteiras são incríveis! Confortáveis e com ótimo acabamento. Já é minha terceira compra na LUXE.',
      rating: 5,
    },
    {
      name: 'Ana Oliveira',
      location: 'Belo Horizonte, MG',
      text: 'Amei a bolsa! Elegante e prática. O atendimento ao cliente também é excelente. Recomendo!',
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-accent font-medium mb-2 uppercase text-sm tracking-wider">Depoimentos</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold">O que nossos clientes dizem</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-card p-6 rounded-2xl">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-accent">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                &quot;{testimonial.text}&quot;
              </p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
