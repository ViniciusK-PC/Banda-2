"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Send, Loader2, MessageSquare, AlertCircle, Clock, 
  User, CheckCircle2, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiMessages, Message, Reply } from '@/lib/api'
import { toast } from 'sonner'

export default function TicketPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [ticket, setTicket] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const fetchTicket = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true)
      const data = await apiMessages.get(id)
      setTicket(data)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError('Não foi possível carregar o ticket de suporte. Verifique o link e tente novamente.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTicket()
      
      // Auto-poll ticket every 8 seconds to check for new admin replies
      const interval = setInterval(() => {
        fetchTicket(false)
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [id])

  useEffect(() => {
    // Scroll to the bottom when messages load or change
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket?.replies, loading])

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    try {
      setSending(true)
      const res = await apiMessages.reply(id, replyText)
      toast.success('Mensagem enviada!')
      setReplyText('')
      setTicket(res.ticket)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar a mensagem.')
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('pt-BR')
    } catch {
      return ''
    }
  }

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3 text-muted-foreground p-6">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <h2 className="font-semibold text-lg text-foreground mt-2">Carregando Chat...</h2>
        <p className="text-sm">Estabelecendo conexão segura com a caixa postal...</p>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Ticket não Encontrado</h2>
        <p className="text-muted-foreground text-sm max-w-md mb-6">
          {error || 'Não foi possível encontrar a conversa solicitada. Ela pode ter sido excluída ou o identificador é inválido.'}
        </p>
        <Link href="/" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-xl cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Premium Header */}
      <header className="border-b border-border/40 bg-card/10 backdrop-blur-md sticky top-0 z-10 px-4 py-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="w-10 h-10 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold leading-tight line-clamp-1">{ticket.subject}</h1>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                  ticket.read 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {ticket.read ? 'Respondido' : 'Pendente'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Canal direto com a Banda • Protocolo: {ticket._id}
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchTicket(true)}
            disabled={refreshing}
            className="w-10 h-10 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
            title="Atualizar conversa"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 flex flex-col min-h-0 bg-background">
        {/* Contact info overlay */}
        <div className="bg-card/25 border border-border/40 rounded-2xl p-4 mb-6 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-sm shrink-0">
          <div>
            <span className="font-medium text-foreground">{ticket.name}</span> • <span className="text-xs">{ticket.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            Enviado em {formatDate(ticket.createdAt)} às {formatTime(ticket.createdAt)}
          </div>
        </div>

        {/* Chat Balloon Window */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 mb-6 min-h-[300px]">
          {/* 1. Initial Message from the User */}
          <div className="flex items-start gap-3 justify-end">
            <div className="max-w-[80%] flex flex-col items-end">
              <div className="bg-primary/95 text-primary-foreground px-4.5 py-3 rounded-2xl rounded-tr-none shadow-md text-sm whitespace-pre-wrap font-sans">
                {ticket.message}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                {ticket.name} • {formatTime(ticket.createdAt)}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/25 border border-primary/40 flex items-center justify-center text-primary shrink-0 text-xs font-semibold uppercase">
              {ticket.name.charAt(0)}
            </div>
          </div>

          {/* 2. Replies log */}
          {ticket.replies && ticket.replies.map((reply, index) => {
            const isAdminReply = reply.sender === 'admin'
            return (
              <div 
                key={reply._id || index}
                className={`flex items-start gap-3 ${isAdminReply ? 'justify-start' : 'justify-end'}`}
              >
                {isAdminReply && (
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border/60 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                )}

                <div className={`max-w-[80%] flex flex-col ${isAdminReply ? 'items-start' : 'items-end'}`}>
                  <div className={`px-4.5 py-3 rounded-2xl shadow-md text-sm whitespace-pre-wrap font-sans ${
                    isAdminReply 
                      ? 'bg-secondary/80 text-foreground border border-border/60 rounded-tl-none' 
                      : 'bg-primary/95 text-primary-foreground rounded-tr-none'
                  }`}>
                    {reply.message}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                    {isAdminReply ? 'Mariana Maciel (Banda)' : ticket.name} • {formatTime(reply.createdAt)}
                  </span>
                </div>

                {!isAdminReply && (
                  <div className="w-8 h-8 rounded-full bg-primary/25 border border-primary/40 flex items-center justify-center text-primary shrink-0 text-xs font-semibold uppercase">
                    {ticket.name.charAt(0)}
                  </div>
                )}
              </div>
            )
          })}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar at the Bottom */}
        <form onSubmit={handleSendReply} className="border border-border/60 bg-card/30 p-2.5 rounded-2xl backdrop-blur-md flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Digite sua resposta aqui..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            disabled={sending}
            className="flex-1 bg-transparent border-0 px-3 py-2 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground text-foreground"
          />
          <Button 
            type="submit" 
            disabled={sending || !replyText.trim()} 
            className="bg-primary text-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center p-0 cursor-pointer shrink-0 hover:bg-primary/90 disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </main>
    </div>
  )
}
