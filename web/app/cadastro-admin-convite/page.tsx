"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ShieldCheck, ShieldAlert, Loader2, User, Mail, Lock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function AdminInviteRegisterContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [checking, setChecking] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registering, setRegistering] = useState(false)
  const [success, setSuccess] = useState(false)

  // Verify the invitation token on mount
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setIsValid(false)
        setErrorMessage('Nenhum token de convite fornecido.')
        setChecking(false)
        return
      }

      try {
        const response = await fetch(`/express-api/api/auth/verify-invite/${token}`)
        const data = await response.json()
        if (response.ok && data.valid) {
          setIsValid(true)
        } else {
          setIsValid(false)
          setErrorMessage(data.message || 'Este link de convite é inválido ou expirou.')
        }
      } catch (err) {
        console.error(err)
        setIsValid(false)
        setErrorMessage('Erro ao verificar a validade do convite.')
      } finally {
        setChecking(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    try {
      setRegistering(true)
      const response = await fetch('/express-api/api/auth/register-admin-with-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          name,
          email,
          password
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Perfil de administrador criado!')
        setSuccess(true)
      } else {
        throw new Error(data.message || 'Erro ao realizar cadastro.')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao processar convite.')
      // Invalidate token locally immediately since it's already used on the server
      setIsValid(false)
      setErrorMessage(err.message || 'O link de convite expirou devido a um erro no cadastro.')
    } finally {
      setRegistering(false)
    }
  }

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground py-12">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <p className="text-sm">Verificando convite de segurança...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl relative z-10 shadow-2xl">
      {!isValid && !success ? (
        /* Invalid Invite Link State */
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-500/15 border border-red-500/30 mb-4 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">Convite Inválido</h1>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            {errorMessage}
          </p>
          <p className="text-xs text-red-400/80 mt-2 font-medium">
            Por segurança, cada link de convite é de uso único. Peça ao proprietário para gerar um novo convite.
          </p>
        </div>
      ) : success ? (
        /* Success Registration State */
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 mb-4 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">Cadastro Concluído!</h1>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Sua conta de administrador foi criada e ativada com sucesso.
          </p>
          <Button
            onClick={() => router.push('/login-exclusivo-mm')}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-xl font-medium shadow-lg mt-6 cursor-pointer text-xs"
          >
            Fazer Login no Painel
          </Button>
        </div>
      ) : (
        /* Registration Form State */
        <>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-500/15 border border-red-500/30 mb-4 text-red-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">Criar Conta Admin</h1>
            <p className="text-xs text-muted-foreground mt-2">
              Cadastre suas credenciais de acesso ao Painel de Controle Oficial.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-red-400" /> Nome Completo
              </label>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={registering}
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
                placeholder="seuemail@marianamaciel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={registering}
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={registering}
                className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-red-400" /> Confirmar Senha
              </label>
              <input
                type="password"
                placeholder="Confirme a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={registering}
                className="w-full bg-secondary/35 border border-border/50 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                required
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={registering}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-xl font-medium shadow-lg hover:shadow-red-600/20 transition-all mt-4 cursor-pointer text-xs"
            >
              {registering ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando Conta...
                </>
              ) : (
                'Concluir Cadastro'
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  )
}

export default function AdminInviteRegisterPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center relative p-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Suspense fallback={
        <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl relative z-10 shadow-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground py-12">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          <p className="text-sm">Carregando convite...</p>
        </div>
      }>
        <AdminInviteRegisterContent />
      </Suspense>
    </main>
  )
}
