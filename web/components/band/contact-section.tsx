import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Instagram, Youtube, Facebook, Music, Loader2 } from 'lucide-react'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Preencha todos os campos.')
      return
    }

    try {
      setSending(true)
      await apiMessages.send(formData)
      toast.success('Sua mensagem foi enviada com sucesso! Responderemos em breve.')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
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

          {/* Contact Form */}
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-secondary border-border"
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-secondary border-border"
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
        </div>
      </div>
    </section>
  )
}
