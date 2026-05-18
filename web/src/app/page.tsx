import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Play, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
          <Image 
            src="/band_hero.png" 
            alt="Vibe Band Live" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        <div className="container relative z-20 text-center">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 animate-fade-in">
            VIBE<span className="text-primary">BAND</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A experiência definitiva do rock ao vivo. 
            Sinta a energia, ouça o som, viva o momento.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/shows" className="btn-primary">
              <Calendar size={20} />
              VER AGENDA
            </Link>
            <Link href="/media" className="flex items-center gap-2 px-8 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-all font-semibold">
              <Play size={20} />
              ASSISTIR VÍDEOS
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-1 h-12 bg-gradient-to-b from-primary to-transparent rounded-full" />
        </div>
      </section>

      {/* Shows Teaser */}
      <section className="py-24 bg-black">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-title mb-2">PRÓXIMOS SHOWS</h2>
              <p className="text-muted">Garanta seu ingresso antes que esgote.</p>
            </div>
            <Link href="/shows" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
              VER TODOS <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { date: '22 MAI', venue: 'Espaço das Américas', city: 'São Paulo, SP' },
              { date: '28 MAI', venue: 'Circo Voador', city: 'Rio de Janeiro, RJ' },
              { date: '05 JUN', venue: 'Opinião', city: 'Porto Alegre, RS' }
            ].map((show, i) => (
              <div key={i} className="glass-card flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="text-2xl font-black text-primary w-20">{show.date}</div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{show.venue}</h3>
                    <p className="text-muted">{show.city}</p>
                  </div>
                </div>
                <button className="btn-primary w-full md:w-auto text-sm py-2">
                  INGRESSOS
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Teaser */}
      <section className="py-24 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="container text-center">
          <h2 className="section-title">QUER A VIBE NO SEU EVENTO?</h2>
          <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
            Levamos toda a estrutura e energia para festivais, eventos corporativos e festas particulares.
          </p>
          <Link href="/contact" className="btn-primary px-12 py-4 text-lg">
            SOLICITAR ORÇAMENTO
          </Link>
        </div>
      </section>

      <style jsx>{`
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
      `}</style>
    </div>
  );
}
