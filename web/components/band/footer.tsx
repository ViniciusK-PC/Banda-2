import Link from 'next/link'
import { Music, Instagram, Youtube, Facebook, Heart } from 'lucide-react'
import { Settings } from '@/lib/api'

interface BandFooterProps {
  settings: Settings;
}

export function BandFooter({ settings }: BandFooterProps) {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="#inicio" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-xl font-bold tracking-tight">Mariana Maciel</span>
                <span className="text-xs text-muted-foreground tracking-widest uppercase">Banda</span>
              </div>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-md">
              Música que emociona e transforma. Siga nossas redes sociais e fique por dentro de todas as novidades.
            </p>
            <div className="flex gap-3 mt-6">
              {settings.instagramUrl && (
                <a 
                  href={settings.instagramUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a 
                  href={settings.youtubeUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.spotifyUrl && (
                <a 
                  href={settings.spotifyUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                  aria-label="Spotify"
                >
                  <Music className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              {['Início', 'Sobre', 'Música', 'Shows', 'Galeria', 'Contato'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace('í', 'i')}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Streaming */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Ouça Agora</h4>
            <ul className="space-y-3">
              {['Spotify', 'Apple Music', 'Deezer', 'YouTube Music', 'Amazon Music'].map((platform) => (
                <li key={platform}>
                  <a 
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Mariana Maciel. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-primary" /> no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
