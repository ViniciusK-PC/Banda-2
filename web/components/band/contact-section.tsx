import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send, Instagram, Youtube, Facebook, Music, Loader2, MessageSquare, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, apiMessages } from '@/lib/api'
import { toast } from 'sonner'

interface ContactSectionProps {
  settings: Settings;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [sending, setSending] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('banda_token')
      const storedUser = localStorage.getItem('banda_user')
      if (token && storedUser) {
        setIsLoggedIn(true)
        try {
          const parsed = JSON.parse(storedUser)
          setFormData(prev => ({
            ...prev,
            name: parsed.name || '',
            email: parsed.email || ''
          }))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Preencha todos os campos.')
      return
    }

    try {
      setSending(true)
      const res = await apiMessages.send(formData)
      toast.success('Sua mensagem foi enviada com sucesso! Você pode acompanhar e conversar conosco pelo chat.')
      if (res && res.data && res.data._id) {
        setTicketId(res.data._id)
      }
      
      // Clear only subject and message, keeping registered name and email
      setFormData(prev => ({
        ...prev,
        subject: '',
        message: ''
      }))
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao enviar a mensagem. Tente novamente mais tarde.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contato" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Contato</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 text-balance">
            Vamos Conversar
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Para contratações, parcerias ou apenas para dizer oi, entre em contato conosco.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-6">Informações de Contato</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">E-mail</p>
                  <a href={`mailto:${settings.contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Telefone / WhatsApp</p>
                  <a href={`tel:${settings.contactPhone.replace(/\D/g, '')}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Localização</p>
                  <p className="text-muted-foreground">{settings.contactAddress}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <h4 className="font-medium text-foreground mb-4">Redes Sociais</h4>
              <div className="flex gap-3">
                {settings.instagramUrl && (
                  <a 
                    href={settings.instagramUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a 
                    href={settings.youtubeUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {settings.spotifyUrl && (
                  <a 
                    href={settings.spotifyUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                    aria-label="Spotify"
                  >
                    <Music className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Management */}
            <div className="mt-10 p-6 rounded-2xl bg-card border border-border">
              <h4 className="font-medium text-foreground mb-2">Assessoria & Management</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Para contratações e eventos corporativos:
              </p>
              <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline text-sm">
                {settings.contactEmail}
              </a>
            </div>
          </div>

          {/* Contact Form or Login CTA */}
          {isLoggedIn ? (
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-serif text-2xl font-bold mb-6">Envie uma Mensagem</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Nome
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      disabled={true}
                      className="bg-secondary/40 border-border opacity-75 cursor-not-allowed text-muted-foreground font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      disabled={true}
                      className="bg-secondary/40 border-border opacity-75 cursor-not-allowed text-muted-foreground font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Assunto
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Assunto da mensagem"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-secondary border-border"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Escreva sua mensagem..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>

                <Button type="submit" disabled={sending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer disabled:opacity-75">
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando Mensagem...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border/80 p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] relative overflow-hidden shadow-xl">
              {/* Background decorative gradient */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                <MessageSquare className="w-8 h-8" />
              </div>
              
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Entre em contato</h3>
                <p className="text-muted-foreground text-xs max-w-sm leading-relaxed mt-2.5">
                  Para enviar uma mensagem e iniciar um chat direto de atendimento com a banda, é necessário fazer login com sua Conta de Fã.
                </p>
              </div>
              
              <div className="w-full pt-2">
                <Link 
                  href="/login" 
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/20 text-xs uppercase tracking-wider"
                >
                  Fazer Login ou Cadastrar-se
                </Link>
                <p className="text-[10px] text-muted-foreground mt-3">
                  Cadastro gratuito em menos de 1 minuto.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Ticket Success Modal */}
      {ticketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-card/95 border border-border/80 p-8 rounded-3xl shadow-2xl text-center overflow-hidden">
            {/* Background decorative element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            
            <button 
              onClick={() => setTicketId(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-bounce">
              <MessageSquare className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold mb-3">Mensagem Recebida!</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Obrigado! Sua mensagem foi enviada. Criamos um canal de chat exclusivo para falarmos diretamente pelo site.
            </p>

            <div className="space-y-3">
              <Link 
                href={`/contato/ticket/${ticketId}`}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                <MessageSquare className="w-4 h-4" />
                Abrir Chat de Contato
              </Link>
              <button 
                onClick={() => setTicketId(null)}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer py-2"
              >
                Voltar ao site
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
