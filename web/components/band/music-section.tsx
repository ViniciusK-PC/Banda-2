"use client"

import { useState, useEffect } from 'react'
import { Play, Pause, Clock, Disc3, Loader2, Music } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiAlbums, Album } from '@/lib/api'

export function MusicSection() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)

  useEffect(() => {
    apiAlbums.getAll()
      .then((data) => {
        setAlbums(data)
        if (data.length > 0) setSelectedAlbum(data[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const togglePlay = (trackId: string) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId)
  }

  const streamingLinks = selectedAlbum ? [
    { label: 'Spotify', url: selectedAlbum.spotifyUrl },
    { label: 'Apple Music', url: selectedAlbum.appleMusicUrl },
    { label: 'Deezer', url: selectedAlbum.deezerUrl },
    { label: 'YouTube Music', url: selectedAlbum.youtubeMusicUrl },
  ].filter(l => l.url) : []

  return (
    <section id="musica" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Discografia</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 text-balance">
            Ouça Nossas Músicas
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Explore a discografia completa de Mariana Maciel e deixe-se envolver por melodias inesquecíveis.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Carregando discografia...</p>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Music className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Nenhum álbum cadastrado</h3>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
              Adicione álbuns e faixas pelo painel de administração.
            </p>
          </div>
        ) : (
          <>
            {/* Album Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {albums.map((album) => (
                <button
                  key={album._id}
                  onClick={() => { setSelectedAlbum(album); setPlayingTrack(null) }}
                  className={cn(
                    "px-6 py-3 rounded-full border transition-all duration-300",
                    selectedAlbum?._id === album._id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground hover:border-primary/50"
                  )}
                >
                  <span className="font-medium">{album.title}</span>
                  <span className="text-xs ml-2 opacity-70">({album.year})</span>
                </button>
              ))}
            </div>

            {selectedAlbum && (
              <div className="grid lg:grid-cols-[300px_1fr] gap-8 max-w-5xl mx-auto">
                {/* Album Cover */}
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-card border border-border overflow-hidden">
                    {selectedAlbum.coverUrl ? (
                      <img
                        src={selectedAlbum.coverUrl}
                        alt={selectedAlbum.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Disc3 className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                          <p className="text-muted-foreground text-sm">Capa do Álbum</p>
                          <p className="font-serif text-xl font-bold text-foreground mt-2">{selectedAlbum.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Track List */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h3 className="font-serif text-2xl font-bold">{selectedAlbum.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Lançado em {selectedAlbum.year}
                      {selectedAlbum.tracks.length > 0 && ` · ${selectedAlbum.tracks.length} faixas`}
                    </p>
                  </div>

                  {selectedAlbum.tracks.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      Nenhuma faixa cadastrada para este álbum.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {[...selectedAlbum.tracks]
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((track, index) => {
                          const tId = track._id || String(index)
                          return (
                            <div
                              key={tId}
                              className={cn(
                                "flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer group",
                                playingTrack === tId && "bg-primary/10"
                              )}
                              onClick={() => togglePlay(tId)}
                            >
                              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                {playingTrack === tId ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <>
                                    <span className="text-sm font-medium group-hover:hidden">
                                      {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <Play className="w-4 h-4 hidden group-hover:block" />
                                  </>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn("font-medium truncate", playingTrack === tId && "text-primary")}>
                                  {track.title}
                                </p>
                                <p className="text-sm text-muted-foreground">Mariana Maciel</p>
                              </div>
                              {track.duration && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0">
                                  <Clock className="w-4 h-4" />
                                  {track.duration}
                                </div>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Streaming Links */}
            {streamingLinks.length > 0 && (
              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">Disponível em:</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {streamingLinks.map(({ label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2 rounded-full bg-secondary border border-border text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
