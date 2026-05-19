import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-serif text-2xl font-bold mb-2">Receba nossas novidades</h3>
            <p className="text-primary-foreground/70 mb-6">
              Cadastre-se para receber ofertas exclusivas e lançamentos em primeira mão.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button variant="secondary">Cadastrar</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/logo-k10.jpg" alt="K10 Store.outlet" className="h-10 w-auto rounded" />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-xl font-bold">K10 Store</span>
                <span className="text-xs text-primary-foreground/70 tracking-widest">.outlet</span>
              </div>
            </Link>
            <p className="mt-4 text-primary-foreground/70 text-sm leading-relaxed">
              K10 Store.outlet - Moda e estilo premium para quem busca qualidade e sofisticação. Descubra nossa coleção exclusiva.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/categoria/jaquetas" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Jaquetas
                </Link>
              </li>
              <li>
                <Link href="/categoria/chuteiras" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Chuteiras
                </Link>
              </li>
              <li>
                <Link href="/categoria/sapatos" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Sapatos
                </Link>
              </li>
              <li>
                <Link href="/categoria/bolsas" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Bolsas
                </Link>
              </li>
              <li>
                <Link href="/novidades" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Novidades
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                <span>contato@k10store.com.br</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Rua das Flores, 123<br />São Paulo - SP</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/70">
            <p>© 2024 K10 Store.outlet. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span>Pagamento seguro:</span>
              <div className="flex gap-2">
                <div className="bg-primary-foreground/10 px-2 py-1 rounded text-xs">Visa</div>
                <div className="bg-primary-foreground/10 px-2 py-1 rounded text-xs">Master</div>
                <div className="bg-primary-foreground/10 px-2 py-1 rounded text-xs">Pix</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
