"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, Camera, LogOut, Plus, Edit2, Trash2, Globe, Music, Disc3,
  MapPin, Clock, Ticket, Loader2, ArrowLeft, Image as ImageIcon, Video, Link as LinkIcon,
  Settings as SettingsIcon, Save, CheckSquare, Square, X as XIcon, GripVertical, Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiShows, apiMedia, apiSettings, apiAlbums, apiUpload, resolveMediaUrl, Show, Media, Settings, Album, Track } from '@/lib/api'
import { toast } from 'sonner'

export default function AdminPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'shows' | 'media' | 'music' | 'settings'>('shows')
  
  // Loading states
  const [loadingShows, setLoadingShows] = useState(true)
  const [loadingMedia, setLoadingMedia] = useState(true)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [loadingAlbums, setLoadingAlbums] = useState(true)
  const [settingsSaving, setSettingsSaving] = useState(false)
  
  // Data states
  const [shows, setShows] = useState<Show[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [albums, setAlbums] = useState<Album[]>([])

  // Bulk selection states
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  // Album modal states
  const [albumModal, setAlbumModal] = useState(false)
  const [albumModalType, setAlbumModalType] = useState<'create' | 'edit'>('create')
  const [albumSubmitLoading, setAlbumSubmitLoading] = useState(false)
  const [albumId, setAlbumId] = useState('')
  const [albumTitle, setAlbumTitle] = useState('')
  const [albumYear, setAlbumYear] = useState('')
  const [albumCoverUrl, setAlbumCoverUrl] = useState('')
  const [albumOrder, setAlbumOrder] = useState('0')
  const [albumSpotify, setAlbumSpotify] = useState('')
  const [albumAppleMusic, setAlbumAppleMusic] = useState('')
  const [albumDeezer, setAlbumDeezer] = useState('')
  const [albumYoutubeMusic, setAlbumYoutubeMusic] = useState('')
  const [albumTracks, setAlbumTracks] = useState<{ title: string; duration: string; order: number }[]>([])

  // Modal / Form States
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit'>('create')
  const [dataType, setDataType] = useState<'show' | 'media'>('show')
  const [submitLoading, setSubmitLoading] = useState(false)

  // Show form fields
  const [showId, setShowId] = useState('')
  const [showDate, setShowDate] = useState('')
  const [showTime, setShowTime] = useState('')
  const [showVenue, setShowVenue] = useState('')
  const [showCity, setShowCity] = useState('')
  const [showState, setShowState] = useState('')
  const [showCountry, setShowCountry] = useState('Brasil')
  const [showTicketLink, setShowTicketLink] = useState('')
  const [showStatus, setShowStatus] = useState<'CONFIRMADO' | 'CANCELADO' | 'ENCERRADO'>('CONFIRMADO')

  // Media form fields
  const [mediaId, setMediaId] = useState('')
  const [mediaTitle, setMediaTitle] = useState('')
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaThumbnail, setMediaThumbnail] = useState('')
  const [mediaSourceType, setMediaSourceType] = useState<'upload' | 'url'>('upload')
  const [uploadingFile, setUploadingFile] = useState(false)

  // Settings form fields
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroBadge, setHeroBadge] = useState('')
  const [bioText1, setBioText1] = useState('')
  const [bioText2, setBioText2] = useState('')
  const [stat1Value, setStat1Value] = useState('')
  const [stat1Label, setStat1Label] = useState('')
  const [stat2Value, setStat2Value] = useState('')
  const [stat2Label, setStat2Label] = useState('')
  const [stat3Value, setStat3Value] = useState('')
  const [stat3Label, setStat3Label] = useState('')
  const [card1Title, setCard1Title] = useState('')
  const [card1Sub, setCard1Sub] = useState('')
  const [card2Title, setCard2Title] = useState('')
  const [card2Sub, setCard2Sub] = useState('')
  const [card3Title, setCard3Title] = useState('')
  const [card3Sub, setCard3Sub] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactAddress, setContactAddress] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [spotifyUrl, setSpotifyUrl] = useState('')

  // Verify authorization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('banda_token')
      const storedUser = localStorage.getItem('banda_user')
      if (!token || !storedUser) {
        toast.error('Acesso restrito. Faça login primeiro.')
        router.push('/login')
      } else {
        setAuthorized(true)
        setUser(JSON.parse(storedUser))
      }
    }
  }, [router])

  // Fetch all data
  const fetchShows = async () => {
    try {
      setLoadingShows(true)
      const data = await apiShows.getAll()
      setShows(data)
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao buscar shows do servidor.')
    } finally {
      setLoadingShows(false)
    }
  }

  const fetchMedia = async () => {
    try {
      setLoadingMedia(true)
      const data = await apiMedia.getAll()
      setMedia(data)
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao buscar mídias do servidor.')
    } finally {
      setLoadingMedia(false)
    }
  }

  const fetchSettings = async () => {
    try {
      setLoadingSettings(true)
      const data = await apiSettings.get()
      setSettings(data)
      setHeroSubtitle(data.heroSubtitle || '')
      setHeroBadge(data.heroBadge || '')
      setBioText1(data.bioText1 || '')
      setBioText2(data.bioText2 || '')
      setStat1Value(data.stat1Value || '')
      setStat1Label(data.stat1Label || '')
      setStat2Value(data.stat2Value || '')
      setStat2Label(data.stat2Label || '')
      setStat3Value(data.stat3Value || '')
      setStat3Label(data.stat3Label || '')
      setCard1Title(data.card1Title || '')
      setCard1Sub(data.card1Sub || '')
      setCard2Title(data.card2Title || '')
      setCard2Sub(data.card2Sub || '')
      setCard3Title(data.card3Title || '')
      setCard3Sub(data.card3Sub || '')
      setContactEmail(data.contactEmail || '')
      setContactPhone(data.contactPhone || '')
      setContactAddress(data.contactAddress || '')
      setInstagramUrl(data.instagramUrl || '')
      setYoutubeUrl(data.youtubeUrl || '')
      setSpotifyUrl(data.spotifyUrl || '')
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao buscar configurações do site.')
    } finally {
      setLoadingSettings(false)
    }
  }

  const fetchAlbums = async () => {
    try {
      setLoadingAlbums(true)
      const data = await apiAlbums.getAll()
      setAlbums(data)
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao buscar álbuns.')
    } finally {
      setLoadingAlbums(false)
    }
  }

  useEffect(() => {
    if (authorized) {
      fetchShows()
      fetchMedia()
      fetchSettings()
      fetchAlbums()
    }
  }, [authorized])

  const openNewAlbumModal = () => {
    setAlbumModalType('create')
    setAlbumId('')
    setAlbumTitle('')
    setAlbumYear(String(new Date().getFullYear()))
    setAlbumCoverUrl('')
    setAlbumOrder('0')
    setAlbumSpotify('')
    setAlbumAppleMusic('')
    setAlbumDeezer('')
    setAlbumYoutubeMusic('')
    setAlbumTracks([])
    setAlbumModal(true)
  }

  const openEditAlbumModal = (album: Album) => {
    setAlbumModalType('edit')
    setAlbumId(album._id)
    setAlbumTitle(album.title)
    setAlbumYear(album.year)
    setAlbumCoverUrl(album.coverUrl || '')
    setAlbumOrder(String(album.order ?? 0))
    setAlbumSpotify(album.spotifyUrl || '')
    setAlbumAppleMusic(album.appleMusicUrl || '')
    setAlbumDeezer(album.deezerUrl || '')
    setAlbumYoutubeMusic(album.youtubeMusicUrl || '')
    setAlbumTracks(album.tracks.map(t => ({ title: t.title, duration: t.duration, order: t.order })))
    setAlbumModal(true)
  }

  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!albumTitle || !albumYear) {
      toast.error('Título e ano são obrigatórios.')
      return
    }
    try {
      setAlbumSubmitLoading(true)
      const payload = {
        title: albumTitle,
        year: albumYear,
        coverUrl: albumCoverUrl,
        order: Number(albumOrder) || 0,
        spotifyUrl: albumSpotify,
        appleMusicUrl: albumAppleMusic,
        deezerUrl: albumDeezer,
        youtubeMusicUrl: albumYoutubeMusic,
        tracks: albumTracks.map((t, i) => ({ ...t, order: i })),
      }
      if (albumModalType === 'create') {
        await apiAlbums.create(payload)
        toast.success('Álbum criado com sucesso!')
      } else {
        await apiAlbums.update(albumId, payload)
        toast.success('Álbum atualizado com sucesso!')
      }
      setAlbumModal(false)
      fetchAlbums()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar álbum.')
    } finally {
      setAlbumSubmitLoading(false)
    }
  }

  const handleDeleteAlbum = async (id: string, title: string) => {
    if (!confirm(`Excluir o álbum "${title}"? Esta ação não pode ser desfeita.`)) return
    try {
      await apiAlbums.delete(id)
      toast.success('Álbum excluído com sucesso!')
      fetchAlbums()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir álbum.')
    }
  }

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSettingsSaving(true)
      const payload = {
        heroSubtitle,
        heroBadge,
        bioText1,
        bioText2,
        stat1Value,
        stat1Label,
        stat2Value,
        stat2Label,
        stat3Value,
        stat3Label,
        card1Title,
        card1Sub,
        card2Title,
        card2Sub,
        card3Title,
        card3Sub,
        contactEmail,
        contactPhone,
        contactAddress,
        instagramUrl,
        youtubeUrl,
        spotifyUrl
      }
      await apiSettings.update(payload)
      toast.success('Configurações atualizadas com sucesso!')
      fetchSettings()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao salvar configurações.')
    } finally {
      setSettingsSaving(false)
    }
  }

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('banda_token')
    localStorage.removeItem('banda_user')
    toast.success('Desconectado com sucesso.')
    router.push('/')
  }

  const openNewShowModal = () => {
    setDataType('show')
    setModalType('create')
    setShowId('')
    setShowDate('')
    setShowTime('20:00')
    setShowVenue('')
    setShowCity('')
    setShowState('')
    setShowCountry('Brasil')
    setShowTicketLink('')
    setShowStatus('CONFIRMADO')
    setShowModal(true)
  }

  const openEditShowModal = (show: Show) => {
    setDataType('show')
    setModalType('edit')
    setShowId(show._id)
    
    // Parse ISO date
    try {
      const d = new Date(show.date)
      const datePart = d.toISOString().split('T')[0]
      const timePart = d.toTimeString().split(' ')[0].substring(0, 5)
      setShowDate(datePart)
      setShowTime(timePart)
    } catch (e) {
      setShowDate('')
      setShowTime('20:00')
    }
    
    setShowVenue(show.venue)
    setShowCity(show.city)
    setShowState(show.state)
    setShowCountry(show.country || 'Brasil')
    setShowTicketLink(show.ticketLink || '')
    setShowStatus(show.status)
    setShowModal(true)
  }

  const openNewMediaModal = () => {
    setDataType('media')
    setModalType('create')
    setMediaId('')
    setMediaTitle('')
    setMediaType('IMAGE')
    setMediaUrl('')
    setMediaThumbnail('')
    setMediaSourceType('upload')
    setShowModal(true)
  }

  const openEditMediaModal = (m: Media) => {
    setDataType('media')
    setModalType('edit')
    setMediaId(m._id)
    setMediaTitle(m.title)
    setMediaType(m.type)
    setMediaUrl(m.url)
    setMediaThumbnail(m.thumbnail || '')
    if (m.url && m.url.startsWith('/uploads/')) {
      setMediaSourceType('upload')
    } else {
      setMediaSourceType('url')
    }
    setShowModal(true)
  }

  const handleShowSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showDate || !showTime || !showVenue || !showCity || !showState) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }

    try {
      setSubmitLoading(true)
      const combinedDate = new Date(`${showDate}T${showTime}`)
      const payload = {
        date: combinedDate.toISOString(),
        venue: showVenue,
        city: showCity,
        state: showState,
        country: showCountry,
        ticketLink: showTicketLink || undefined,
        status: showStatus
      }

      if (modalType === 'create') {
        await apiShows.create(payload)
        toast.success('Show cadastrado com sucesso!')
      } else {
        await apiShows.update(showId, payload)
        toast.success('Show atualizado com sucesso!')
      }
      
      setShowModal(false)
      fetchShows()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao salvar show.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingFile(true)
      const data = await apiUpload.uploadFile(file)
      setMediaUrl(data.url)
      toast.success('Arquivo carregado com sucesso!')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao fazer upload do arquivo.')
    } finally {
      setUploadingFile(false)
    }
  }

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mediaTitle || !mediaUrl) {
      toast.error('Preencha o título e a URL.')
      return
    }

    try {
      setSubmitLoading(true)
      const payload = {
        title: mediaTitle,
        type: mediaType,
        url: mediaUrl,
        thumbnail: mediaType === 'VIDEO' ? (mediaThumbnail || undefined) : undefined
      }

      if (modalType === 'create') {
        await apiMedia.create(payload)
        toast.success('Mídia adicionada com sucesso!')
      } else {
        await apiMedia.update(mediaId, payload)
        toast.success('Mídia atualizada com sucesso!')
      }

      setShowModal(false)
      fetchMedia()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erro ao salvar mídia.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteShow = async (id: string, venue: string) => {
    if (confirm(`Tem certeza que deseja excluir o show em "${venue}"?`)) {
      try {
        await apiShows.delete(id)
        toast.success('Show excluído com sucesso!')
        fetchShows()
      } catch (err: any) {
        console.error(err)
        toast.error(err.message || 'Erro ao excluir show.')
      }
    }
  }

  const handleDeleteMedia = async (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir a mídia "${title}"?`)) {
      try {
        await apiMedia.delete(id)
        toast.success('Mídia excluída com sucesso!')
        fetchMedia()
      } catch (err: any) {
        console.error(err)
        toast.error(err.message || 'Erro ao excluir mídia.')
      }
    }
  }

  const formatDateString = (dateString: string) => {
    try {
      const d = new Date(dateString)
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch (e) {
      return '--/--/----'
    }
  }

  const formatTimeString = (dateString: string) => {
    try {
      const d = new Date(dateString)
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return '--:--'
    }
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Verificando credenciais...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-foreground relative pb-20">
      {/* Background design */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-border/80 bg-card/10 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold">Mariana Maciel</h1>
              <p className="text-xs text-muted-foreground">Painel de Controle Oficial</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              Ver Site
            </Link>
            <div className="h-4 w-px bg-border/80" />
            <span className="text-xs text-muted-foreground">Olá, <strong className="text-foreground">{user?.name}</strong></span>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm" 
              className="border-border hover:border-destructive hover:text-destructive text-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-12">
        {/* Navigation Tabs & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-card/25 backdrop-blur-md p-2 rounded-2xl border border-border/60">
          <div className="flex flex-wrap gap-2 flex-1">
            <button
              onClick={() => setActiveTab('shows')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'shows' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-secondary/40 text-muted-foreground'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Agenda de Shows
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'media' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-secondary/40 text-muted-foreground'
              }`}
            >
              <Camera className="w-4 h-4" />
              Galeria de Mídias
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'music' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-secondary/40 text-muted-foreground'
              }`}
            >
              <Disc3 className="w-4 h-4" />
              Discografia
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-secondary/40 text-muted-foreground'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Configurações do Site
            </button>
          </div>

          <div>
            {activeTab === 'shows' && (
              <Button onClick={openNewShowModal} className="w-full sm:w-auto bg-primary text-primary-foreground cursor-pointer shadow-lg hover:shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Novo Show
              </Button>
            )}
            {activeTab === 'media' && (
              <Button onClick={openNewMediaModal} className="w-full sm:w-auto bg-primary text-primary-foreground cursor-pointer shadow-lg hover:shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Nova Mídia
              </Button>
            )}
            {activeTab === 'music' && (
              <Button onClick={openNewAlbumModal} className="w-full sm:w-auto bg-primary text-primary-foreground cursor-pointer shadow-lg hover:shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Novo Álbum
              </Button>
            )}
          </div>
        </div>

        {/* Tab Contents: SHOWS */}
        {activeTab === 'shows' && (
          <div className="bg-card/20 border border-border/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
            {loadingShows ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Carregando shows do banco de dados...</p>
              </div>
            ) : shows.length === 0 ? (
              <div className="text-center py-20 px-4">
                <Calendar className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Nenhum show cadastrado</h3>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">Cadastre shows no painel para que apareçam na agenda do site oficial.</p>
                <Button onClick={openNewShowModal} className="mt-6 cursor-pointer bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Primeiro Show
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/20">
                      <th className="p-4 pl-6">Data & Hora</th>
                      <th className="p-4">Local (Venue)</th>
                      <th className="p-4">Cidade / Estado</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Ingressos</th>
                      <th className="p-4 pr-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm">
                    {shows.map((show) => {
                      let statusBadge = ''
                      if (show.status === 'CONFIRMADO') {
                        statusBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      } else if (show.status === 'CANCELADO') {
                        statusBadge = 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      } else {
                        statusBadge = 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }

                      return (
                        <tr key={show._id} className="hover:bg-secondary/15 transition-colors">
                          <td className="p-4 pl-6 font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary shrink-0" />
                              <span>{formatDateString(show.date)}</span>
                              <span className="text-xs text-muted-foreground ml-1.5 flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {formatTimeString(show.date)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold">{show.venue}</td>
                          <td className="p-4 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-primary/80" />
                              <span>{show.city}, {show.state}</span>
                              {show.country && show.country !== 'Brasil' && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-foreground uppercase">{show.country}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge}`}>
                              {show.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {show.ticketLink ? (
                              <a 
                                href={show.ticketLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium"
                              >
                                <Ticket className="w-3.5 h-3.5" />
                                Ver Link
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">Sem Link</span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button
                              onClick={() => openEditShowModal(show)}
                              className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all cursor-pointer text-muted-foreground"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteShow(show._id, show.venue)}
                              className="p-2 rounded-lg bg-secondary/50 hover:bg-destructive/20 hover:text-destructive transition-all cursor-pointer text-muted-foreground"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Contents: MEDIA */}
        {activeTab === 'media' && (
          <div className="bg-card/20 border border-border/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
            {loadingMedia ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Carregando mídias do banco de dados...</p>
              </div>
            ) : media.length === 0 ? (
              <div className="text-center py-20 px-4">
                <Camera className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Nenhuma mídia cadastrada</h3>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">Envie imagens ou links de vídeos para preencher a galeria do site oficial.</p>
                <Button onClick={openNewMediaModal} className="mt-6 cursor-pointer bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Primeira Mídia
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">

                {/* Bulk Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary/20 border border-border/50 rounded-2xl px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (selectedMedia.size === media.length) {
                          setSelectedMedia(new Set())
                        } else {
                          setSelectedMedia(new Set(media.map(m => m._id)))
                        }
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {selectedMedia.size === media.length && media.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground" />
                      )}
                      {selectedMedia.size === media.length && media.length > 0 ? 'Desmarcar Tudo' : 'Selecionar Tudo'}
                    </button>

                    {selectedMedia.size > 0 && (
                      <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">
                        {selectedMedia.size} {selectedMedia.size === 1 ? 'selecionada' : 'selecionadas'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedMedia.size > 0 && (
                      <>
                        <button
                          onClick={() => setSelectedMedia(new Set())}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                          Limpar seleção
                        </button>
                        <button
                          disabled={bulkDeleting}
                          onClick={async () => {
                            if (!confirm(`Tem certeza que deseja excluir ${selectedMedia.size} ${selectedMedia.size === 1 ? 'mídia' : 'mídias'}? Esta ação não pode ser desfeita.`)) return
                            try {
                              setBulkDeleting(true)
                              const ids = Array.from(selectedMedia)
                              await Promise.all(ids.map(id => apiMedia.delete(id)))
                              toast.success(`${ids.length} ${ids.length === 1 ? 'mídia excluída' : 'mídias excluídas'} com sucesso!`)
                              setSelectedMedia(new Set())
                              fetchMedia()
                            } catch (err: any) {
                              toast.error('Erro ao excluir mídias selecionadas.')
                            } finally {
                              setBulkDeleting(false)
                            }
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-destructive hover:bg-destructive/80 transition-colors cursor-pointer px-3 py-1.5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {bulkDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          {bulkDeleting ? 'Excluindo...' : `Excluir ${selectedMedia.size} ${selectedMedia.size === 1 ? 'mídia' : 'mídias'}`}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {media.map((m) => {
                    const isSelected = selectedMedia.has(m._id)
                    return (
                      <div 
                        key={m._id} 
                        className={`group bg-card/45 rounded-2xl border overflow-hidden flex flex-col shadow-lg transition-all ${
                          isSelected 
                            ? 'border-primary shadow-primary/20 ring-2 ring-primary/30' 
                            : 'border-border/85 hover:border-primary/40'
                        }`}
                      >
                        {/* Media Display with Checkbox */}
                        <div className="relative aspect-video bg-black/40 flex items-center justify-center overflow-hidden border-b border-border/50">
                          {m.type === 'IMAGE' ? (
                            <img 
                              src={resolveMediaUrl(m.url)} 
                              alt={m.title} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="relative w-full h-full">
                              <img 
                                src={resolveMediaUrl(m.thumbnail || 'https://images.unsplash.com/photo-1540039155732-6761b33fa439?q=80&w=600&auto=format&fit=crop')} 
                                alt={m.title} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Video className="w-8 h-8 text-primary fill-current" />
                              </div>
                            </div>
                          )}

                          {/* Type badge */}
                          <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.type === 'IMAGE' ? 'bg-primary/90 text-primary-foreground' : 'bg-violet-600/90 text-white'
                          }`}>
                            {m.type === 'IMAGE' ? 'FOTO' : 'VÍDEO'}
                          </span>

                          {/* Checkbox overlay */}
                          <button
                            onClick={() => {
                              const next = new Set(selectedMedia)
                              if (next.has(m._id)) next.delete(m._id)
                              else next.add(m._id)
                              setSelectedMedia(next)
                            }}
                            className={`absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-primary/80'
                            }`}
                            title={isSelected ? 'Desmarcar' : 'Selecionar'}
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>

                          {/* Selected overlay tint */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                          )}
                        </div>

                        {/* Content & Actions */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div className="mb-4">
                            <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{m.title}</h4>
                            <span className="text-[10px] text-muted-foreground break-all mt-1 line-clamp-1 flex items-center gap-1">
                              <LinkIcon className="w-3 h-3 text-muted-foreground shrink-0" />
                              {m.url}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-border/40">
                            <span className="text-[10px] text-muted-foreground">
                              {m.createdAt ? formatDateString(m.createdAt) : ''}
                            </span>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditMediaModal(m)}
                                className="p-1.5 rounded-lg bg-secondary/80 hover:bg-primary/20 hover:text-primary transition-all text-muted-foreground cursor-pointer"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMedia(m._id, m.title)}
                                className="p-1.5 rounded-lg bg-secondary/80 hover:bg-destructive/20 hover:text-destructive transition-all text-muted-foreground cursor-pointer"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Contents: MUSIC / DISCOGRAFIA */}
        {activeTab === 'music' && (
          <div className="bg-card/20 border border-border/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
            {loadingAlbums ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Carregando discografia...</p>
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-20 px-4">
                <Disc3 className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Nenhum álbum cadastrado</h3>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">Crie álbuns com faixas e links para as plataformas de streaming.</p>
                <Button onClick={openNewAlbumModal} className="mt-6 cursor-pointer bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Álbum
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {albums.map((album) => (
                  <div key={album._id} className="bg-card/40 border border-border/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/40 transition-colors">
                    {/* Cover */}
                    <div className="w-16 h-16 rounded-xl bg-secondary border border-border/60 overflow-hidden shrink-0 flex items-center justify-center">
                      {album.coverUrl ? (
                        <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <Disc3 className="w-7 h-7 text-primary/40" />
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base">{album.title}</h4>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{album.year}</span>
                        <span className="flex items-center gap-1"><Music className="w-3 h-3" />{album.tracks.length} {album.tracks.length === 1 ? 'faixa' : 'faixas'}</span>
                        {album.spotifyUrl && <span className="text-green-400">Spotify ✓</span>}
                        {album.appleMusicUrl && <span className="text-pink-400">Apple Music ✓</span>}
                        {album.deezerUrl && <span className="text-purple-400">Deezer ✓</span>}
                        {album.youtubeMusicUrl && <span className="text-red-400">YouTube Music ✓</span>}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => openEditAlbumModal(album)}
                        className="p-2 rounded-xl bg-secondary/80 hover:bg-primary/20 hover:text-primary transition-all text-muted-foreground cursor-pointer"
                        title="Editar álbum"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlbum(album._id, album.title)}
                        className="p-2 rounded-xl bg-secondary/80 hover:bg-destructive/20 hover:text-destructive transition-all text-muted-foreground cursor-pointer"
                        title="Excluir álbum"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALBUM MODAL */}
        {albumModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
            <div className="bg-card border border-border/80 rounded-3xl shadow-2xl w-full max-w-2xl my-auto">
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h3 className="font-semibold text-lg">
                  {albumModalType === 'create' ? 'Novo Álbum' : 'Editar Álbum'}
                </h3>
                <button onClick={() => setAlbumModal(false)} className="text-muted-foreground hover:text-foreground cursor-pointer p-1.5 rounded-lg hover:bg-secondary/60 transition-all">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAlbumSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Título *</label>
                    <input value={albumTitle} onChange={e => setAlbumTitle(e.target.value)} required placeholder="Ex: Escolhas" className="w-full bg-secondary/40 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ano *</label>
                    <input value={albumYear} onChange={e => setAlbumYear(e.target.value)} required placeholder="2024" maxLength={4} className="w-full bg-secondary/40 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">URL da Capa do Álbum</label>
                    <input value={albumCoverUrl} onChange={e => setAlbumCoverUrl(e.target.value)} placeholder="https://..." className="w-full bg-secondary/40 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ordem de Exibição</label>
                    <input type="number" value={albumOrder} onChange={e => setAlbumOrder(e.target.value)} min="0" className="w-full bg-secondary/40 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all" />
                  </div>
                </div>

                {/* Streaming Links */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Links de Streaming</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Spotify</label>
                      <input value={albumSpotify} onChange={e => setAlbumSpotify(e.target.value)} placeholder="https://open.spotify.com/..." className="w-full bg-secondary/40 border border-border/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Apple Music</label>
                      <input value={albumAppleMusic} onChange={e => setAlbumAppleMusic(e.target.value)} placeholder="https://music.apple.com/..." className="w-full bg-secondary/40 border border-border/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Deezer</label>
                      <input value={albumDeezer} onChange={e => setAlbumDeezer(e.target.value)} placeholder="https://www.deezer.com/..." className="w-full bg-secondary/40 border border-border/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">YouTube Music</label>
                      <input value={albumYoutubeMusic} onChange={e => setAlbumYoutubeMusic(e.target.value)} placeholder="https://music.youtube.com/..." className="w-full bg-secondary/40 border border-border/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-all" />
                    </div>
                  </div>
                </div>

                {/* Tracks */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Faixas do Álbum</h4>
                    <button
                      type="button"
                      onClick={() => setAlbumTracks([...albumTracks, { title: '', duration: '', order: albumTracks.length }])}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar Faixa
                    </button>
                  </div>
                  {albumTracks.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4 bg-secondary/20 rounded-xl">Nenhuma faixa adicionada ainda.</p>
                  ) : (
                    <div className="space-y-2">
                      {albumTracks.map((track, i) => (
                        <div key={i} className="flex items-center gap-2 bg-secondary/20 rounded-xl p-2.5">
                          <span className="text-xs text-muted-foreground w-5 text-center shrink-0">{String(i + 1).padStart(2, '0')}</span>
                          <input
                            value={track.title}
                            onChange={e => {
                              const updated = [...albumTracks]
                              updated[i] = { ...updated[i], title: e.target.value }
                              setAlbumTracks(updated)
                            }}
                            placeholder="Nome da faixa"
                            className="flex-1 bg-secondary/60 border border-border/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/60 transition-all"
                          />
                          <input
                            value={track.duration}
                            onChange={e => {
                              const updated = [...albumTracks]
                              updated[i] = { ...updated[i], duration: e.target.value }
                              setAlbumTracks(updated)
                            }}
                            placeholder="3:45"
                            className="w-16 bg-secondary/60 border border-border/40 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-primary/60 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setAlbumTracks(albumTracks.filter((_, idx) => idx !== i))}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer shrink-0"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2 border-t border-border/40">
                  <Button type="button" variant="outline" onClick={() => setAlbumModal(false)} className="flex-1 cursor-pointer">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={albumSubmitLoading} className="flex-1 bg-primary cursor-pointer">
                    {albumSubmitLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {albumSubmitLoading ? 'Salvando...' : 'Salvar Álbum'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab Contents: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-card/20 border border-border/80 rounded-3xl p-8 shadow-xl backdrop-blur-md">
            {loadingSettings ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Carregando configurações do banco...</p>
              </div>
            ) : (
              <form onSubmit={handleSettingsSubmit} className="space-y-8">
                {/* Hero Section */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2 pb-2 border-b border-border/40">
                    <Music className="w-5 h-5" />
                    Seção Inicial (Hero)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Texto do Balão de Destaque</label>
                      <input
                        type="text"
                        placeholder="Ex: Novo Single Disponível"
                        value={heroBadge}
                        onChange={(e) => setHeroBadge(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Subtítulo de Apresentação *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Descreva a artista ou banda de forma impactante..."
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground resize-none"
                    />
                  </div>
                </div>

                {/* Biografia & Destaques */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2 pb-2 border-b border-border/40">
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                    Biografia & Destaques (Sobre)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Parágrafo Biográfico 1 *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Primeiro parágrafo da história da artista..."
                        value={bioText1}
                        onChange={(e) => setBioText1(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Parágrafo Biográfico 2 *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Segundo parágrafo da história da artista..."
                        value={bioText2}
                        onChange={(e) => setBioText2(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="space-y-3 bg-secondary/20 p-4 rounded-2xl border border-border/40">
                      <h4 className="text-xs font-bold text-foreground">Destaque 1 (Esquerda)</h4>
                      <input
                        type="text"
                        placeholder="Título: Prêmio Revelação"
                        value={card1Title}
                        onChange={(e) => setCard1Title(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Subtítulo: 2018"
                        value={card1Sub}
                        onChange={(e) => setCard1Sub(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                    </div>

                    <div className="space-y-3 bg-secondary/20 p-4 rounded-2xl border border-border/40">
                      <h4 className="text-xs font-bold text-foreground">Destaque 2 (Meio)</h4>
                      <input
                        type="text"
                        placeholder="Título: 3 Álbuns"
                        value={card2Title}
                        onChange={(e) => setCard2Title(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Subtítulo: Lançados"
                        value={card2Sub}
                        onChange={(e) => setCard2Sub(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                    </div>

                    <div className="space-y-3 bg-secondary/20 p-4 rounded-2xl border border-border/40">
                      <h4 className="text-xs font-bold text-foreground">Destaque 3 (Direita)</h4>
                      <input
                        type="text"
                        placeholder="Título: Turnê Nacional"
                        value={card3Title}
                        onChange={(e) => setCard3Title(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Subtítulo: 2024"
                        value={card3Sub}
                        onChange={(e) => setCard3Sub(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2 pb-2 border-b border-border/40">
                    <Clock className="w-5 h-5" />
                    Números & Estatísticas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3 bg-secondary/20 p-4 rounded-2xl border border-border/40">
                      <h4 className="text-xs font-bold text-foreground">Métrica 1 (Ex: Anos)</h4>
                      <input
                        type="text"
                        placeholder="Valor: 10+"
                        value={stat1Value}
                        onChange={(e) => setStat1Value(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Legenda: Anos de Carreira"
                        value={stat1Label}
                        onChange={(e) => setStat1Label(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                    </div>

                    <div className="space-y-3 bg-secondary/20 p-4 rounded-2xl border border-border/40">
                      <h4 className="text-xs font-bold text-foreground">Métrica 2 (Ex: Shows)</h4>
                      <input
                        type="text"
                        placeholder="Valor: 500+"
                        value={stat2Value}
                        onChange={(e) => setStat2Value(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Legenda: Shows Realizados"
                        value={stat2Label}
                        onChange={(e) => setStat2Label(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                    </div>

                    <div className="space-y-3 bg-secondary/20 p-4 rounded-2xl border border-border/40">
                      <h4 className="text-xs font-bold text-foreground">Métrica 3 (Ex: Fãs)</h4>
                      <input
                        type="text"
                        placeholder="Valor: 50k"
                        value={stat3Value}
                        onChange={(e) => setStat3Value(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Legenda: Seguidores"
                        value={stat3Label}
                        onChange={(e) => setStat3Label(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-1.5 text-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Contatos & Redes Sociais */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2 pb-2 border-b border-border/40">
                    <MapPin className="w-5 h-5" />
                    Contatos & Redes Sociais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">E-mail de Contato *</label>
                      <input
                        type="email"
                        required
                        placeholder="contato@artista.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Telefone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        placeholder="+55 (11) 99999-9999"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Localização / Cidade *</label>
                      <input
                        type="text"
                        required
                        placeholder="São Paulo, Brasil"
                        value={contactAddress}
                        onChange={(e) => setContactAddress(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Link do Instagram</label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/perfil"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Link do YouTube</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/canal"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Link do Spotify</label>
                      <input
                        type="url"
                        placeholder="https://open.spotify.com/artist/..."
                        value={spotifyUrl}
                        onChange={(e) => setSpotifyUrl(e.target.value)}
                        className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-6 border-t border-border/40 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={settingsSaving} 
                    className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 cursor-pointer"
                  >
                    {settingsSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando Configurações...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Todas as Configurações
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* --- FORM DIALOG MODAL --- */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-card/95 border border-border/80 p-8 rounded-3xl relative shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-primary text-[10px] uppercase font-bold tracking-widest">
                  {dataType === 'show' ? 'Agenda de Shows' : 'Galeria de Mídias'}
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  {modalType === 'create' ? 'Cadastrar Novo' : 'Editar Registro'}
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* --- SHOW FORM --- */}
            {dataType === 'show' ? (
              <form onSubmit={handleShowSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Data *</label>
                    <input
                      type="date"
                      required
                      value={showDate}
                      onChange={(e) => setShowDate(e.target.value)}
                      disabled={submitLoading}
                      className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Horário *</label>
                    <input
                      type="time"
                      required
                      value={showTime}
                      onChange={(e) => setShowTime(e.target.value)}
                      disabled={submitLoading}
                      className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Local (Venue) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Arena Carioca, Parque Ibirapuera"
                    value={showVenue}
                    onChange={(e) => setShowVenue(e.target.value)}
                    disabled={submitLoading}
                    className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Cidade *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Rio de Janeiro, São Paulo"
                      value={showCity}
                      onChange={(e) => setShowCity(e.target.value)}
                      disabled={submitLoading}
                      className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Estado (Sigla) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: RJ, SP, BA"
                      maxLength={2}
                      value={showState}
                      onChange={(e) => setShowState(e.target.value.toUpperCase())}
                      disabled={submitLoading}
                      className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">País *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Brasil"
                      value={showCountry}
                      onChange={(e) => setShowCountry(e.target.value)}
                      disabled={submitLoading}
                      className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Status *</label>
                    <select
                      value={showStatus}
                      onChange={(e) => setShowStatus(e.target.value as any)}
                      disabled={submitLoading}
                      className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    >
                      <option value="CONFIRMADO">CONFIRMADO</option>
                      <option value="ENCERRADO">ENCERRADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Link do Ingresso (Opcional)</label>
                  <input
                    type="text"
                    placeholder="https://ticketlink.com/evento"
                    value={showTicketLink}
                    onChange={(e) => setShowTicketLink(e.target.value)}
                    disabled={submitLoading}
                    className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-border/40">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowModal(false)}
                    disabled={submitLoading}
                    className="flex-1 cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitLoading}
                    className="flex-1 cursor-pointer bg-primary"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Show'
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* --- MEDIA FORM --- */
              <form onSubmit={handleMediaSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Título da Mídia *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ensaio de Fotos 2024, Show de Lançamento"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    disabled={submitLoading}
                    className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Tipo de Mídia *</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaType('IMAGE')}
                      disabled={submitLoading}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                        mediaType === 'IMAGE'
                          ? 'bg-primary/25 border-primary text-primary'
                          : 'border-border/60 text-muted-foreground bg-secondary/20 hover:border-primary/50'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Imagem / Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('VIDEO')}
                      disabled={submitLoading}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                        mediaType === 'VIDEO'
                          ? 'bg-primary/25 border-primary text-primary'
                          : 'border-border/60 text-muted-foreground bg-secondary/20 hover:border-primary/50'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      Vídeo
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Origem do Arquivo *</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaSourceType('upload')}
                      disabled={submitLoading || uploadingFile}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        mediaSourceType === 'upload'
                          ? 'bg-primary/15 border-primary text-primary'
                          : 'border-border/60 text-muted-foreground bg-secondary/10 hover:border-primary/50'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Enviar do Dispositivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaSourceType('url')}
                      disabled={submitLoading || uploadingFile}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        mediaSourceType === 'url'
                          ? 'bg-primary/15 border-primary text-primary'
                          : 'border-border/60 text-muted-foreground bg-secondary/10 hover:border-primary/50'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      Link de Internet (URL)
                    </button>
                  </div>
                </div>

                {mediaSourceType === 'upload' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Selecionar {mediaType === 'IMAGE' ? 'Foto / Imagem' : 'Vídeo'} *
                    </label>
                    <div className="relative group border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl p-6 transition-all bg-secondary/10 flex flex-col items-center justify-center gap-3">
                      <input
                        type="file"
                        accept={mediaType === 'IMAGE' ? 'image/*' : 'video/*'}
                        onChange={handleFileChange}
                        disabled={submitLoading || uploadingFile}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                      />
                      
                      {uploadingFile ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          <p className="text-xs text-muted-foreground">Enviando arquivo ao servidor...</p>
                        </div>
                      ) : mediaUrl ? (
                        <div className="flex flex-col items-center gap-2 text-center">
                          {mediaType === 'IMAGE' ? (
                            <img
                              src={resolveMediaUrl(mediaUrl)}
                              alt="Pré-visualização"
                              className="w-20 h-20 object-cover rounded-xl border border-border shadow-md"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                              <Video className="w-8 h-8" />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-semibold text-emerald-400">Arquivo enviado com sucesso!</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[200px] mt-0.5">
                              {mediaUrl.split('/').pop()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">Clique para procurar no dispositivo</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {mediaType === 'IMAGE' ? 'Formatos suportados: PNG, JPG, GIF, WEBP' : 'Formatos suportados: MP4, WEBM, MOV'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">URL do Arquivo *</label>
                    <input
                      type="text"
                      required
                      placeholder={
                        mediaType === 'IMAGE' 
                          ? 'https://exemplo.com/fotos/imagem.jpg' 
                          : 'https://youtube.com/watch?v=id_do_video ou mp4 url'
                      }
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      disabled={submitLoading}
                      className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground"
                    />
                  </div>
                )}

                {mediaType === 'VIDEO' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">URL da Miniatura / Thumbnail (Opcional)</label>
                    <input
                      type="text"
                      placeholder="https://exemplo.com/videos/capa.jpg"
                      value={mediaThumbnail}
                      onChange={(e) => setMediaThumbnail(e.target.value)}
                      disabled={submitLoading}
                      className="w-full bg-secondary/55 border border-border/55 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-foreground"
                    />
                    <p className="text-[10px] text-muted-foreground">Se deixado em branco, uma capa padrão estilizada será utilizada.</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-border/40">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowModal(false)}
                    disabled={submitLoading}
                    className="flex-1 cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitLoading}
                    className="flex-1 cursor-pointer bg-primary"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Mídia'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
