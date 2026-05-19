"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Music, LogOut, Loader2, ArrowRight, MessageSquare, AlertCircle, 
  Clock, Plus, CheckCircle2, Ticket, Award, Disc, Tag, Send, User as UserIcon, Edit, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiMessages, apiShows, apiAlbums, apiAuth, Message, Show, Album } from '@/lib/api'
import { toast } from 'sonner'

export default function DashboardPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Dashboard lists state
  const [tickets, setTickets] = useState<Message[]>([])
  const [shows, setShows] = useState<Show[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  
  // Loading states
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [loadingShows, setLoadingShows] = useState(true)
  const [loadingAlbums, setLoadingAlbums] = useState(true)

  // Expanded ticket conversation details
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})
  const [replyingIds, setReplyingIds] = useState<Record<string, boolean>>({})

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [updatingProfile, setUpdatingProfile] = useState(false)

  // Verification & Auth check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('banda_token')
      const storedUser = localStorage.getItem('banda_user')
      if (!token || !storedUser) {
        toast.error('Acesso restrito. Faça login como fã primeiro.')
        router.push('/login')
      } else {
        const parsed = JSON.parse(storedUser)
        if (parsed.role === 'ADMIN') {
          router.push('/admin') // Redirect admin users to their official dashboard
        } else {
          setAuthorized(true)
          setUser(parsed)
        }
      }
    }
  }, [router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('edit') === 'true') {
        setIsEditingProfile(true)
      }
    }
  }, [])

  // Initialize edit fields when user state is loaded
  useEffect(() => {
    if (user) {
      setEditName(user.name || '')
      setEditEmail(user.email || '')
    }
  }, [user])

  // Fetch all Fan Area data
  const fetchTickets = async () => {
    try {
      setLoadingTickets(true)
      const data = await apiMessages.getMyTickets()
      setTickets(data)
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao buscar seus chamados de chat.')
    } finally {
      setLoadingTickets(false)
    }
  }

  const fetchShows = async () => {
    try {
      setLoadingShows(true)
      const data = await apiShows.getAll()
      // Limit to 3 upcoming shows
      setShows(data.slice(0, 3))
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoadingShows(false)
    }
  }

  const fetchAlbums = async () => {
    try {
      setLoadingAlbums(true)
      const data = await apiAlbums.getAll()
      // Limit to 2 albums
      setAlbums(data.slice(0, 2))
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoadingAlbums(false)
    }
  }

  useEffect(() => {
    if (authorized) {
      fetchTickets()
      fetchShows()
      fetchAlbums()
    }
  }, [authorized])

  const handleLogout = () => {
    localStorage.removeItem('banda_token')
    localStorage.removeItem('banda_user')
    toast.success('Desconectado com sucesso.')
    router.push('/')
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim() || !editEmail.trim()) {
      toast.error('Nome e e-mail são obrigatórios.')
      return
    }

    try {
      setUpdatingProfile(true)
      const res = await apiAuth.updateProfile({
        name: editName,
        email: editEmail,
        password: editPassword || undefined,
      })

      localStorage.setItem('banda_user', JSON.stringify(res.user))
      setUser(res.user)
      toast.success('Perfil atualizado com sucesso!')
      setEditPassword('')
      setIsEditingProfile(false)
      router.push('/dashboard')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao atualizar perfil.')
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleSendReply = async (ticketId: string) => {
    const text = replyTexts[ticketId] || ''
    if (!text.trim()) return

    try {
      setReplyingIds(prev => ({ ...prev, [ticketId]: true }))
      await apiMessages.reply(ticketId, text)
      toast.success('Mensagem enviada com sucesso!')
      setReplyTexts(prev => ({ ...prev, [ticketId]: '' }))
      // Re-fetch tickets to update local list
      const updated = await apiMessages.getMyTickets()
      setTickets(updated)
    } catch (err: any) {
      toast.error('Erro ao enviar a mensagem.')
    } finally {
      setReplyingIds(prev => ({ ...prev, [ticketId]: false }))
    }
  }

  const formatDateString = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('pt-BR')
    } catch {
      return ''
    }
  }

  const formatTimeString = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  if (!authorized || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Autenticando sessão de fã...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-foreground font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-border/40 bg-card/20 backdrop-blur-md sticky top-0 z-50 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-all">
                <Music className="w-5 h-5" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight">Mariana Maciel</span>
            </Link>
            <span className="hidden sm:inline text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-secondary/80 border border-border/40">
              Área do Fã
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Olá, Fã Oficial</p>
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-rose-400 bg-secondary/60 hover:bg-rose-500/10 border border-border/50 hover:border-rose-500/20 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        
        {/* Welcome Header Hero */}
        <section className="relative overflow-hidden bg-gradient-to-r from-card/30 to-violet-950/10 border border-border/60 p-8 rounded-3xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-bold">Fã Clube Mariana Maciel</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1 text-foreground">Olá, {user.name}!</h1>
            <p className="text-muted-foreground text-sm mt-1.5 max-w-xl">
              Aqui você tem acesso a vantagens exclusivas, promoções em primeira mão e um canal de chat direto para conversar conosco.
            </p>
          </div>
          
          <Link 
            href="/#contato"
            className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all text-sm shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Enviar Nova Mensagem
          </Link>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT AREA: Live Support Chats & Tickets (Takes 2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Seus Chats & Chamados
              </h2>
              <span className="text-xs text-muted-foreground font-medium">
                {tickets.length} {tickets.length === 1 ? 'conversa' : 'conversas'}
              </span>
            </div>

            {loadingTickets ? (
              <div className="bg-card/25 border border-border/40 rounded-3xl p-12 text-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
                <p className="text-sm">Carregando histórico de conversas...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-card/25 border border-border/40 rounded-3xl p-12 text-center text-muted-foreground">
                <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/60 mb-3" />
                <h3 className="font-semibold text-foreground text-lg mb-1">Nenhum chat registrado</h3>
                <p className="text-sm max-w-sm mx-auto mb-6">
                  Você ainda não enviou mensagens pelo formulário de contato do site usando seu email ({user.email}).
                </p>
                <Link 
                  href="/#contato"
                  className="inline-flex items-center gap-2 bg-secondary/80 hover:bg-secondary border border-border/50 text-foreground text-xs font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Fazer Contato Agora
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => {
                  const isExpanded = expandedTicketId === ticket._id
                  return (
                    <div 
                      key={ticket._id}
                      className={`bg-card/35 hover:bg-card/45 border transition-all rounded-2xl overflow-hidden ${
                        isExpanded ? 'border-primary/50 shadow-md shadow-primary/5' : 'border-border/60'
                      }`}
                    >
                      {/* Accordion Trigger Header */}
                      <div 
                        onClick={() => setExpandedTicketId(isExpanded ? null : ticket._id)}
                        className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-serif font-bold text-lg text-foreground">{ticket.subject}</h3>
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full tracking-wider ${
                              ticket.read 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {ticket.read ? 'Respondido' : 'Aguardando'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Iniciado em {formatDateString(ticket.createdAt)} • Protocolo: {ticket._id}
                          </p>
                        </div>

                        <div className="text-xs font-bold text-primary flex items-center gap-1">
                          {isExpanded ? 'Recolher Conversa' : 'Abrir Chat'}
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      {/* Expanded Ticket Chat Room */}
                      {isExpanded && (
                        <div className="p-5 border-t border-border/40 bg-secondary/10 space-y-4">
                          
                          {/* Chat balloon logger */}
                          <div className="border border-border/60 bg-secondary/20 rounded-2xl p-4 space-y-4 max-h-[250px] overflow-y-auto">
                            
                            {/* Original Message */}
                            <div className="flex items-start gap-2.5 max-w-[85%] ml-auto justify-end">
                              <div className="flex flex-col items-end">
                                <div className="bg-primary/95 text-primary-foreground text-sm px-3.5 py-2 rounded-2xl rounded-tr-none font-sans">
                                  {ticket.message}
                                </div>
                                <span className="text-[9px] text-muted-foreground mt-1">
                                  Você • {formatTimeString(ticket.createdAt)}
                                </span>
                              </div>
                              <div className="w-7 h-7 rounded-full bg-primary/25 flex items-center justify-center text-xs font-semibold text-primary uppercase shrink-0 border border-primary/30">
                                U
                              </div>
                            </div>

                            {/* Additional replies */}
                            {ticket.replies && ticket.replies.map((reply, index) => {
                              const isAdmin = reply.sender === 'admin'
                              return (
                                <div 
                                  key={reply._id || index}
                                  className={`flex items-start gap-2.5 max-w-[85%] ${isAdmin ? 'justify-start' : 'ml-auto justify-end'}`}
                                >
                                  {isAdmin && (
                                    <div className="w-7 h-7 rounded-full bg-secondary border border-border/60 flex items-center justify-center text-primary shrink-0">
                                      <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                  )}

                                  <div className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                                    <div className={`text-sm px-3.5 py-2 rounded-2xl font-sans ${
                                      isAdmin 
                                        ? 'bg-secondary/80 text-foreground border border-border/60 rounded-tl-none' 
                                        : 'bg-primary/95 text-primary-foreground rounded-tr-none'
                                    }`}>
                                      {reply.message}
                                    </div>
                                    <span className="text-[9px] text-muted-foreground mt-1">
                                      {isAdmin ? 'Mariana Maciel (Banda)' : 'Você'} • {formatTimeString(reply.createdAt)}
                                    </span>
                                  </div>

                                  {!isAdmin && (
                                    <div className="w-7 h-7 rounded-full bg-primary/25 flex items-center justify-center text-xs font-semibold text-primary uppercase shrink-0 border border-primary/30">
                                      U
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Quick reply form */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Escreva sua resposta..."
                              value={replyTexts[ticket._id] || ''}
                              onChange={(e) => setReplyTexts({ ...replyTexts, [ticket._id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendReply(ticket._id)
                              }}
                              disabled={replyingIds[ticket._id]}
                              className="flex-1 bg-secondary/50 border border-border/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                            />
                            <button
                              onClick={() => handleSendReply(ticket._id)}
                              disabled={replyingIds[ticket._id] || !(replyTexts[ticket._id] || '').trim()}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              {replyingIds[ticket._id] ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              Responder
                            </button>
                          </div>

                          <div className="flex justify-between items-center pt-2 text-[11px] text-muted-foreground border-t border-border/20">
                            <span>Acompanhe live a qualquer momento</span>
                            <Link 
                              href={`/contato/ticket/${ticket._id}`}
                              className="text-primary hover:underline font-bold flex items-center gap-1"
                              target="_blank"
                            >
                              Ver Link do Ticket
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* RIGHT AREA: Fan Perks & Exclusives (Takes 1 Col) */}
          <div className="space-y-8">
            
            {/* VIP Club Perks Card */}
            <div className="bg-gradient-to-b from-card/40 to-card/10 border border-border/60 p-6 rounded-3xl space-y-6">
              <h2 className="font-serif text-xl font-bold flex items-center gap-2 text-primary border-b border-border/30 pb-3">
                <Award className="w-5 h-5" />
                Vantagens de Fã VIP
              </h2>

              {/* Promo code */}
              <div className="bg-secondary/40 border border-border/50 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Tag className="w-4 h-4" />
                  15% OFF NA LOJA OFICIAL
                </div>
                <p className="text-xs text-muted-foreground">
                  Use este cupom exclusivo para fãs na compra de camisetas, bonés e CDs no nosso e-commerce.
                </p>
                <div className="bg-black/40 border border-dashed border-primary/45 rounded-xl p-3 flex justify-between items-center text-sm font-mono tracking-wider font-bold text-foreground">
                  <span>FACLUB15OFF</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('FACLUB15OFF')
                      toast.success('Cupom copiado para a área de transferência!')
                    }}
                    className="text-[10px] text-primary hover:underline font-sans tracking-normal uppercase cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* VIP priority */}
              <div className="flex gap-3 items-start text-xs text-muted-foreground leading-relaxed">
                <Ticket className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Prioridade de Pré-venda</p>
                  <p className="mt-0.5">Você receberá emails prioritários com links de ingressos VIP 24h antes da liberação ao público geral.</p>
                </div>
              </div>
            </div>

            {/* Tour & Shows widget */}
            <div className="bg-card/25 border border-border/50 p-6 rounded-3xl space-y-4">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2 text-foreground">
                Próximos Shows da Tour
              </h3>
              
              {loadingShows ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : shows.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum show marcado no momento.</p>
              ) : (
                <div className="space-y-3.5">
                  {shows.map((show) => (
                    <div key={show._id} className="flex justify-between items-center text-xs pb-3 border-b border-border/20 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-foreground line-clamp-1">{show.venue}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{show.city}, {show.state}</p>
                      </div>
                      <span className="text-[10px] bg-secondary border border-border/60 text-muted-foreground px-2 py-1 rounded-lg shrink-0">
                        {new Date(show.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  ))}
                  
                  <Link 
                    href="/#agenda"
                    className="w-full inline-flex items-center justify-center gap-1 bg-secondary/80 hover:bg-secondary border border-border/60 text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Ver Agenda Completa
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Exclusive Listen widget */}
            <div className="bg-card/25 border border-border/50 p-6 rounded-3xl space-y-4">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2 text-foreground">
                Discografia
              </h3>
              
              {loadingAlbums ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : albums.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum álbum publicado no momento.</p>
              ) : (
                <div className="space-y-3">
                  {albums.map((album) => (
                    <div key={album._id} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Disc className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-foreground truncate">{album.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{album.year} • {album.tracks?.length || 0} faixas</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Floating Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-card/95 border border-border p-8 rounded-3xl shadow-2xl overflow-hidden">
            {/* Background decorative element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            
            <button 
              onClick={() => {
                setIsEditingProfile(false)
                router.push('/dashboard')
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5">
              <Edit className="w-5 h-5" />
            </div>

            <h3 className="font-serif text-2xl font-bold mb-1 text-center">Editar Perfil</h3>
            <p className="text-muted-foreground text-xs text-center mb-6 leading-relaxed">
              Atualize as informações do seu perfil do Fã Clube Oficial.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">E-mail</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Nova Senha (Deixe em branco para manter)</label>
                <input 
                  type="password" 
                  placeholder="Sua nova senha de acesso"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full rounded-lg bg-secondary border border-border px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2 pt-2">
                <Button 
                  type="submit" 
                  disabled={updatingProfile} 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center"
                >
                  {updatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando Alterações...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(false)
                    router.push('/dashboard')
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer py-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
