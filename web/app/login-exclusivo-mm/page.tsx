"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, Loader2, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiAuth } from '@/lib/api'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Preencha todos os campos.')
      return
    }

    try {
      setLoading(true)
      const data = await apiAuth.login(email, password)
      
      // Verify role to secure route
      if (data.user.role?.toUpperCase() !== 'ADMIN') {
        // Clear any stored unauthorized data
        localStorage.removeItem('banda_token')
        localStorage.removeItem('banda_user')
        toast.error('Acesso não autorizado. Esta página é restrita para administradores.')
        setLoading(false)
        return
      }

      // Save auth details for admin
      localStorage.setItem('banda_token', data.token)
      localStorage.setItem('banda_user', JSON.stringify(data.user))
      
      toast.success(`Bem-vindo ao Painel, ${data.user.name}!`)
      router.push('/painel-exclusivo-mm')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Credenciais administrativas inválidas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center relative p-4 overflow-hidden">
      {/* Dynamic Background Glow - Admin Red/Purple Theme */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

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
      <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-500/15 border border-red-500/30 mb-4 text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">Portal Administrativo</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Acesso restrito a administradores autorizados.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-red-400/80" /> Email Administrativo
            </label>
            <input
              type="email"
              placeholder="admin@marianamaciel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-red-400/80" /> Senha de Acesso
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-xl font-medium shadow-lg hover:shadow-red-600/20 transition-all mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Autenticando...
              </>
            ) : (
              'Entrar no Painel'
            )}
          </Button>
        </form>
      </div>
    </main>
  )
}
