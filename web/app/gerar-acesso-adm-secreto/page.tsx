"use client"

import { useState } from 'react'
import { ShieldAlert, Loader2, Key, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminGeneratorPage() {
  const [masterKey, setMasterKey] = useState('banda_super_secret_master_key_2026')
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!masterKey) {
      toast.error('Preencha a chave mestra.')
      return
    }

    try {
      setLoading(true)
      setInviteLink('')

      const response = await fetch('/express-api/api/auth/generate-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          masterKey
        })
      })

      const data = await response.json()

      if (response.ok && data.token) {
        toast.success('Link de convite gerado com sucesso!')
        const baseUrl = window.location.origin
        setInviteLink(`${baseUrl}/cadastro-admin-convite?token=${data.token}`)
      } else {
        throw new Error(data.message || 'Erro ao gerar link de convite.')
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
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">Gerador de Link de Convite</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Gere um link temporário e de uso único para que outra pessoa cadastre suas credenciais de administrador.
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

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-xl font-medium shadow-lg hover:shadow-red-600/20 transition-all mt-4 cursor-pointer text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando Link...
              </>
            ) : (
              'Gerar Link de Cadastro'
            )}
          </Button>
        </form>

        {/* Success Invite Details */}
        {inviteLink && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-3 text-xs">
            <p className="text-emerald-400 font-bold text-center mb-1 flex items-center justify-center gap-1">
              <LinkIcon className="w-4 h-4" /> Link Criado com Sucesso!
            </p>
            <p className="text-muted-foreground text-[10px] text-center leading-relaxed">
              Envie este link para a pessoa criar a própria conta de administrador. O link é de uso único e expirará caso ocorra qualquer erro de cadastro ou após 24 horas.
            </p>
            <div className="bg-black/40 border border-border/30 rounded-xl p-3 select-all break-all font-mono text-[10px] text-foreground">
              {inviteLink}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteLink)
                toast.success('Link de convite copiado!')
              }}
              className="w-full text-center mt-2 text-[10px] uppercase font-bold text-red-400 hover:underline cursor-pointer bg-transparent border-0"
            >
              Copiar Link de Cadastro
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
