"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, ArrowLeft, Loader2, Lock, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiAuth } from '@/lib/api'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isRegister) {
      if (!name || !email || !password) {
        toast.error('Preencha todos os campos.')
        return
      }
      try {
        setLoading(true)
        const data = await apiAuth.register(name, email, password)
        toast.success('Cadastro realizado com sucesso! Faça login.')
        setIsRegister(false) // Toggle back to login
      } catch (err: any) {
        console.error(err)
        toast.error(err.message || 'Erro ao realizar cadastro.')
      } finally {
        setLoading(false)
      }
    } else {
      if (!email || !password) {
        toast.error('Preencha todos os campos.')
        return
      }
      try {
        setLoading(true)
        const data = await apiAuth.login(email, password)
        
        if (data.user.role?.toUpperCase() === 'ADMIN') {
          // Clear any stored data
          localStorage.removeItem('banda_token')
          localStorage.removeItem('banda_user')
          toast.error('Acesso administrativo restrito nesta página. Faça login pelo portal administrativo.')
          setLoading(false)
          return
        }

        // Save auth details
        localStorage.setItem('banda_token', data.token)
        localStorage.setItem('banda_user', JSON.stringify(data.user))
        
        toast.success(`Bem-vindo, ${data.user.name}!`)
        router.push('/dashboard')
      } catch (err: any) {
        console.error(err)
        toast.error(err.message || 'Credenciais inválidas. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center relative p-4 overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-8 left-8 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para o site
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-border/80 p-8 rounded-3xl relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Mariana Maciel</h1>
          <p className="text-xs text-muted-foreground mt-2">
            {isRegister ? 'Cadastre-se para acompanhar notícias e chats' : 'Faça login na sua Conta de Fã'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name (Only for Registration) */}
          {isRegister && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <User className="w-4 h-4" /> Nome Completo
              </label>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              placeholder="seu-email@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl font-medium shadow-lg hover:shadow-primary/20 transition-all mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              isRegister ? 'Criar Conta de Fã' : 'Entrar no Sistema'
            )}
          </Button>

          {/* Toggle between Register and Login */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setName('')
                setEmail('')
                setPassword('')
              }}
              className="text-xs text-primary hover:underline hover:text-primary/95 transition-all bg-transparent border-0 cursor-pointer"
            >
              {isRegister ? 'Já possui uma conta? Entre' : 'Não tem conta? Cadastre-se como Fã'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
