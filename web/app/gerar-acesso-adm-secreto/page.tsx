"use client"

import { useState } from 'react'
import { ShieldAlert, Loader2, Key, User, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminGeneratorPage() {
  const [masterKey, setMasterKey] = useState('banda_super_secret_master_key_2026')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdUser, setCreatedUser] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !masterKey) {
      toast.error('Preencha todos os campos.')
      return
    }

    try {
      setLoading(true)
      setCreatedUser(null)

      // Use the relative path or base API URL
      const response = await fetch('/express-api/api/auth/register-admin-master', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          masterKey
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Novo administrador criado com sucesso!')
        setCreatedUser({ name, email, password })
        setName('')
        setEmail('')
        setPassword('')
      } else {
        throw new Error(data.message || 'Erro ao gerar acesso administrativo.')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center relative p-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-500/15 border border-red-500/30 mb-4 text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">Gerador de Admin</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Área de segurança para criação de novos perfis administrativos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Master Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Key className="w-3.5 h-3.5 text-red-400" /> Chave Mestra
            </label>
            <input
              type="password"
              placeholder="Chave secreta do sistema"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              disabled={loading}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              required
            />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-red-400" /> Nome do Admin
            </label>
            <input
              type="text"
              placeholder="Ex: Mariana Maciel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-red-400" /> Email de Acesso
            </label>
            <input
              type="email"
              placeholder="admin@marianamaciel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-red-400" /> Senha
            </label>
            <input
              type="password"
              placeholder="Defina a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-xl font-medium shadow-lg hover:shadow-red-600/20 transition-all mt-4 cursor-pointer text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando Administrador...
              </>
            ) : (
              'Gerar Novo Admin'
            )}
          </Button>
        </form>

        {/* Success Card Details */}
        {createdUser && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-2 text-xs">
            <p className="text-emerald-400 font-bold text-center mb-1">Acesso Criado com Sucesso!</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nome:</span>
              <span className="font-mono text-foreground">{createdUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-mono text-foreground">{createdUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Senha:</span>
              <span className="font-mono text-foreground">{createdUser.password}</span>
            </div>
            <button
              onClick={() => {
                const text = `Credenciais Admin:\nNome: ${createdUser.name}\nEmail: ${createdUser.email}\nSenha: ${createdUser.password}`
                navigator.clipboard.writeText(text)
                toast.success('Credenciais copiadas!')
              }}
              className="w-full text-center mt-3 text-[10px] uppercase font-bold text-red-400 hover:underline cursor-pointer bg-transparent border-0"
            >
              Copiar Credenciais
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
