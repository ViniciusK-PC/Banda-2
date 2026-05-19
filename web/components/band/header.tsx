"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Music, Instagram, Youtube, Facebook } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Settings } from '@/lib/api'

const navItems = [
  { name: 'Início', href: '#inicio' },
  { name: 'Sobre', href: '#sobre' },
  { name: 'Música', href: '#musica' },
  { name: 'Shows', href: '#shows' },
  { name: 'Galeria', href: '#galeria' },
  { name: 'Contato', href: '#contato' },
]

interface BandHeaderProps {
  settings?: Settings;
}

export function BandHeader({ settings }: BandHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
    )}>
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="#inicio" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-pink-500/30 transition-all">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">Mariana Maciel</span>
              <span className="text-xs text-pink-400 tracking-widest uppercase">Banda</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-pink-400 transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Social Icons & Fan Area - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transition-transform" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {settings?.youtubeUrl && (
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors hover:scale-105 transition-transform" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            )}
            <Link
              href="/login"
              className="text-xs font-semibold text-foreground bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/5"
            >
              Área do Fã
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden absolute left-0 right-0 top-20 bg-background/98 backdrop-blur-lg border-b border-border transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between gap-6 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-6">
                {settings?.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                {settings?.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                    <Youtube className="w-6 h-6" />
                  </a>
                )}
              </div>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-foreground bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Área do Fã
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
