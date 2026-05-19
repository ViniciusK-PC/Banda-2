"use client"

import { useState, useEffect } from 'react'
import { BandHeader } from '@/components/band/header'
import { HeroSection } from '@/components/band/hero-section'
import { AboutSection } from '@/components/band/about-section'
import { MusicSection } from '@/components/band/music-section'
import { ShowsSection } from '@/components/band/shows-section'
import { GallerySection } from '@/components/band/gallery-section'
import { ContactSection } from '@/components/band/contact-section'
import { BandFooter } from '@/components/band/footer'
import { apiSettings, Settings } from '@/lib/api'

const defaultSettings: Settings = {
  heroSubtitle: 'Cantora e compositora natural de Pelotas/RS. Uma voz autêntica do sertanejo brasileiro que emociona palcos e corações por onde passa.',
  heroBadge: '🎵 "Escolhas" — Ouça Agora!',

  bioText1: 'Mariana Maciel é uma cantora e compositora natural de Pelotas, no Rio Grande do Sul. Desde criança fascinada pela música, iniciou sua carreira profissional aos 18 anos de forma autodidata, desenvolvendo uma voz única e um estilo próprio dentro do sertanejo brasileiro.',
  bioText2: 'Com trajetória construída na força da persistência, Mariana conquistou seu espaço nos palcos da região Sul do Brasil. Sua música fala de amor, superação e verdade — como em "Escolhas", composição própria que já emocionou milhares de fãs e consolidou sua identidade artística.',

  stat1Value: '7+',
  stat1Label: 'Anos de Carreira',
  stat2Value: '100+',
  stat2Label: 'Shows Realizados',
  stat3Value: '10k+',
  stat3Label: 'Seguidores',

  card1Title: 'Compositora',
  card1Sub: '"Escolhas" — autoral',
  card2Title: 'Pelotas/RS',
  card2Sub: 'Origem & Base',
  card3Title: 'Sertanejo',
  card3Sub: 'Gênero Musical',

  contactEmail: 'contato@marianamaciel.com.br',
  contactPhone: '+55 (53) 99999-9999',
  contactAddress: 'Pelotas, Rio Grande do Sul',
  instagramUrl: 'https://instagram.com/oficialmarianamaciel',
  youtubeUrl: 'https://www.youtube.com/watch?v=Ijyqi49kKg4',
  spotifyUrl: 'https://open.spotify.com/search/Mariana%20Maciel'
}

export default function BandPage() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiSettings.get()
        setSettings(data)
      } catch (e) {
        console.error('Error loading settings:', e)
      }
    }
    loadSettings()
  }, [])

  const currentSettings = settings || defaultSettings

  return (
    <main className="min-h-screen">
      <BandHeader settings={currentSettings} />
      <HeroSection settings={currentSettings} />
      <AboutSection settings={currentSettings} />
      <MusicSection />
      <ShowsSection />
      <GallerySection />
      <ContactSection settings={currentSettings} />
      <BandFooter settings={currentSettings} />
    </main>
  )
}

