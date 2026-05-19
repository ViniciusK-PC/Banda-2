"use client"

import { Award, Mic2, Heart } from 'lucide-react'
import { Settings } from '@/lib/api'

interface AboutSectionProps {
  settings: Settings;
}

export function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="sobre" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-card border border-border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <Mic2 className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Foto da Artista</p>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-primary/30 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-widest">Sobre</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-6 text-balance">
              Uma Jornada Através da Música
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {settings.bioText1}
              </p>
              <p>
                {settings.bioText2}
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-foreground">{settings.card1Title}</div>
                <div className="text-xs text-muted-foreground mt-1">{settings.card1Sub}</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <Mic2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-foreground">{settings.card2Title}</div>
                <div className="text-xs text-muted-foreground mt-1">{settings.card2Sub}</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-foreground">{settings.card3Title}</div>
                <div className="text-xs text-muted-foreground mt-1">{settings.card3Sub}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
