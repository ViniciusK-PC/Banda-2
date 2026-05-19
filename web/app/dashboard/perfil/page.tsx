"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Music, LogOut, Loader2, ArrowLeft, Camera, User as UserIcon, Mail, Lock, CheckCircle2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiAuth, apiUpload, resolveMediaUrl } from '@/lib/api'
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [authorized, setAuthorized] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Form fields state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  
  // Loading states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

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
        setAuthorized(true)
        setUser(parsed)
        
        // Prefill fields
        setName(parsed.name || '')
        setEmail(parsed.email || '')
        setAvatarUrl(parsed.avatarUrl || '')
        setLoading(false)
      }
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('banda_token')
    localStorage.removeItem('banda_user')
    toast.success('Desconectado com sucesso.')
    router.push('/')
  }

  // Handle avatar photo selection & upload
  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.')
      return
    }

    try {
      setUploading(true)
      toast.loading('Enviando imagem...', { id: 'upload-toast' })
      const res = await apiUpload.uploadFile(file)
      setAvatarUrl(res.url)
      toast.success('Foto enviada com sucesso!', { id: 'upload-toast' })
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao enviar imagem.', { id: 'upload-toast' })
    } finally {
      setUploading(false)
    }
  }

  // Save updated profile details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast.error('Nome e e-mail são obrigatórios.')
      return
    }

    try {
      setSaving(true)
      const res = await apiAuth.updateProfile({
        name,
        email,
        password: password || undefined,
        avatarUrl,
      })

      // Update local storage user session
      localStorage.setItem('banda_user', JSON.stringify(res.user))
      setUser(res.user)
      toast.success('Perfil atualizado com sucesso!')
      setPassword('')
      
      // Delay redirect to allow user to see success
      setTimeout(() => {
        router.push(res.user.role?.toUpperCase() === 'ADMIN' ? '/painel-exclusivo-mm' : '/dashboard')
      }, 1000)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao atualizar perfil.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !authorized || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Autenticando sessão...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-foreground font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-border/40 bg-card/20 backdrop-blur-md sticky top-0 z-50 px-4 py-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-all">
                <Music className="w-5 h-5" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight">Mariana Maciel</span>
            </Link>
            <span className="hidden sm:inline text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-secondary/80 border border-border/40">
              {user.role === 'ADMIN' ? 'Painel Administrativo' : 'Área do Fã'}
            </span>
          </div>

          <div className="flex items-center gap-4">
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
      <main className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        
        {/* Back Link */}
        <Link 
          href={user.role === 'ADMIN' ? '/painel-exclusivo-mm' : '/dashboard'}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Painel
        </Link>

        {/* Profile Card */}
        <div className="relative overflow-hidden bg-card/40 border border-border/60 rounded-3xl p-8 shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl font-bold text-foreground">Editar Meu Perfil</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Personalize sua foto, altere suas credenciais de login e mantenha sua conta atualizada.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-8 relative">
            
            {/* Avatar Photo Editor */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div 
                onClick={handlePhotoClick}
                className="relative group w-28 h-28 rounded-full border-2 border-primary/30 hover:border-primary cursor-pointer overflow-hidden transition-all shadow-lg"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={resolveMediaUrl(avatarUrl)} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary/80 flex items-center justify-center text-muted-foreground">
                    <UserIcon className="w-10 h-10" />
                  </div>
                )}
                
                {/* Photo hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-white">
                  <Camera className="w-5 h-5 text-primary" />
                  <span>Alterar Foto</span>
                </div>

                {uploading && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <button 
                type="button"
                onClick={handlePhotoClick}
                className="text-[11px] font-bold text-primary hover:underline transition-all"
              >
                Enviar nova imagem
              </button>
            </div>

            {/* Input fields */}
            <div className="space-y-5">
              
              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-primary" />
                  Nome Completo
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full rounded-xl bg-secondary border border-border/80 px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  Endereço de E-mail
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full rounded-xl bg-secondary border border-border/80 px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  Nova Senha (deixe vazio para não alterar)
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-secondary border border-border/80 px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>

            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button 
                type="submit" 
                disabled={saving || uploading} 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center text-xs"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando Alterações...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>

              <Link 
                href={user.role === 'ADMIN' ? '/painel-exclusivo-mm' : '/dashboard'}
                className="w-full inline-flex items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer py-3 text-center"
              >
                Cancelar
              </Link>
            </div>

          </form>
        </div>

      </main>
    </div>
  )
}
