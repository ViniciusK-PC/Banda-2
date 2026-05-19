"use client"

import { Play, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Settings } from '@/lib/api'

interface HeroSectionProps {
  settings: Settings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-secondary/50" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-24">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          {settings.heroBadge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 mb-8">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              <span className="text-sm text-pink-400 font-medium">{settings.heroBadge}</span>
            </div>
          )}

          {/* Main Title */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance">
            <span className="text-foreground">Mariana</span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">Maciel</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
            {settings.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2 px-8 bg-pink-500 text-white hover:bg-pink-600">
              <Play className="w-5 h-5" />
              Ouvir Músicas
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-blue-500 text-blue-400 hover:bg-blue-500/10">
              Agenda de Shows
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            <div className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-bold text-pink-500">{settings.stat1Value}</div>
              <div className="text-sm text-muted-foreground mt-1">{settings.stat1Label}</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-bold text-blue-500">{settings.stat2Value}</div>
              <div className="text-sm text-muted-foreground mt-1">{settings.stat2Label}</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-bold text-pink-500">{settings.stat3Value}</div>
              <div className="text-sm text-muted-foreground mt-1">{settings.stat3Label}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#sobre" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  )
}
