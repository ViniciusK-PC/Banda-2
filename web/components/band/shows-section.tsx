"use client"

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Ticket, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiShows, Show } from '@/lib/api'

const statusConfig = {
  CONFIRMADO: { label: 'Comprar Ingressos', className: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  ENCERRADO: { label: 'Encerrado', className: 'bg-muted text-muted-foreground cursor-not-allowed' },
  CANCELADO: { label: 'Cancelado', className: 'bg-destructive text-destructive-foreground cursor-not-allowed' }
}

export function ShowsSection() {
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchShows() {
      try {
        setLoading(true)
        const data = await apiShows.getAll()
        // Filter out past shows or show all sorted by date
        setShows(data)
      } catch (err: any) {
        console.error('Error fetching shows:', err)
        setError('Não foi possível carregar a agenda de shows no momento.')
      } finally {
        setLoading(false)
      }
    }
    fetchShows()
  }, [])

  const formatShowDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Account for timezones by checking if date is valid
      if (isNaN(date.getTime())) throw new Error('Data inválida')
      
      const day = String(date.getDate()).padStart(2, '0')
      const month = date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '')
      const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      return { day, month, time }
    } catch (e) {
      return { day: '--', month: '---', time: '--:--' }
    }
  }

  const handleTicketClick = (show: Show) => {
    if (show.status !== 'CONFIRMADO') return
    if (show.ticketLink) {
      window.open(show.ticketLink, '_blank', 'noopener,noreferrer')
    } else {
      // Default action or message
      alert('Ingressos estarão disponíveis em breve!')
    }
  }

  return (
    <section id="shows" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Agenda</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 text-balance">
            Próximos Shows
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Confira as próximas apresentações e garanta seu ingresso para viver uma experiência musical única.
          </p>
        </div>

        {/* Shows Loading / Error / List */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Carregando shows...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 p-6 bg-card border border-border rounded-2xl text-muted-foreground">
              <p>{error}</p>
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-16 p-6 bg-card border border-border rounded-2xl">
              <Calendar className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <p className="font-medium text-foreground text-lg">Nenhum show agendado no momento</p>
              <p className="text-muted-foreground text-sm mt-2">Fique ligado em nossas redes sociais para novidades em breve!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {shows.map((show) => {
                const { day, month, time } = formatShowDate(show.date)
                const config = statusConfig[show.status] || statusConfig.CONFIRMADO
                const hasLink = !!show.ticketLink

                return (
                  <div 
                    key={show._id}
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors"
                  >
                    {/* Date */}
                    <div className="flex md:flex-col items-center gap-2 md:gap-0 text-center min-w-[80px]">
                      <span className="font-serif text-4xl font-bold text-primary">{day}</span>
                      <span className="text-sm font-medium text-muted-foreground uppercase">{month}</span>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-16 bg-border" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-xl font-bold mb-2">{show.venue}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-primary" />
                          {show.city}, {show.state}{show.country && show.country !== 'Brasil' ? ` - ${show.country}` : ''}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-primary" />
                          {time}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => handleTicketClick(show)}
                      className={config.className}
                      disabled={show.status !== 'CONFIRMADO'}
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      {show.status === 'CONFIRMADO' && !hasLink ? 'Mais Informações' : config.label}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-border hover:border-primary" onClick={() => {
            const el = document.getElementById('shows');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Calendar className="w-5 h-5 mr-2" />
            Agenda Completa
          </Button>
        </div>
      </div>
    </section>
  )
}

