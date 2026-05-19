"use client"

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Camera, Play, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiMedia, Media, resolveMediaUrl } from '@/lib/api'

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'IMAGE', label: 'Fotos' },
  { id: 'VIDEO', label: 'Vídeos' },
]

export function GallerySection() {
  const [mediaItems, setMediaItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // Mongoose _id

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true)
        const data = await apiMedia.getAll()
        setMediaItems(data)
      } catch (err: any) {
        console.error('Error fetching media:', err)
        setError('Não foi possível carregar a galeria no momento.')
      } finally {
        setLoading(false)
      }
    }
    fetchMedia()
  }, [])

  const filteredItems = selectedCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === selectedCategory)

  const currentIndex = selectedImage !== null 
    ? filteredItems.findIndex(item => item._id === selectedImage) 
    : -1

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1]._id)
    }
  }

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1]._id)
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
      const match = url.match(regExp)
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      }
      return null
    } catch (e) {
      return null
    }
  }

  const currentItem = mediaItems.find(i => i._id === selectedImage)

  return (
    <section id="galeria" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Galeria</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 text-balance">
            Momentos Especiais
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Reviva os melhores momentos dos shows, bastidores e sessões fotográficas.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Loading / Error / Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Carregando mídias...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 p-6 bg-card border border-border rounded-2xl text-muted-foreground max-w-md mx-auto">
            <p>{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 p-6 bg-card border border-border rounded-2xl max-w-md mx-auto">
            <Camera className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="font-medium text-foreground text-lg">Nenhuma mídia encontrada</p>
            <p className="text-muted-foreground text-sm mt-2">Novas fotos e vídeos serão adicionados em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedImage(item._id)}
                className="group relative aspect-square bg-card rounded-xl overflow-hidden cursor-pointer border border-border hover:border-primary/50 transition-all shadow-md"
              >
                {/* Media Content */}
                {item.type === 'IMAGE' ? (
                  <img 
                    src={resolveMediaUrl(item.url)} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full h-full bg-secondary/20">
                    <img 
                      src={resolveMediaUrl(item.thumbnail || 'https://images.unsplash.com/photo-1540039155732-6761b33fa439?q=80&w=600&auto=format&fit=crop')} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                    <span className="text-xs text-primary font-medium">{item.type === 'IMAGE' ? 'FOTO' : 'VÍDEO'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage !== null && currentItem && (
          <div 
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-card border border-border hover:bg-secondary transition-colors z-50 cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {currentIndex > 0 && (
              <button 
                className="absolute left-4 md:left-8 p-3 rounded-full bg-card border border-border hover:bg-secondary transition-colors z-50 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentIndex < filteredItems.length - 1 && (
              <button 
                className="absolute right-4 md:right-8 p-3 rounded-full bg-card border border-border hover:bg-secondary transition-colors z-50 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Lightbox Media */}
            <div 
              className="max-w-4xl max-h-[85vh] bg-card rounded-2xl overflow-hidden border border-border shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-secondary/30 border-b border-border flex justify-between items-center">
                <h4 className="font-serif text-lg font-bold truncate pr-8">{currentItem.title}</h4>
                <span className="text-xs bg-primary/20 text-primary px-2.5 py-1 rounded-full font-medium">
                  {currentItem.type === 'IMAGE' ? 'Foto' : 'Vídeo'}
                </span>
              </div>
              
              <div className="flex items-center justify-center bg-black/90 p-1 min-w-[280px] md:min-w-[600px] aspect-video max-h-[70vh]">
                {currentItem.type === 'IMAGE' ? (
                  <img 
                    src={resolveMediaUrl(currentItem.url)} 
                    alt={currentItem.title} 
                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md"
                  />
                ) : (
                  (() => {
                    const embedUrl = getYouTubeEmbedUrl(currentItem.url)
                    if (embedUrl) {
                      return (
                        <iframe 
                          src={embedUrl} 
                          title={currentItem.title}
                          className="w-full h-full aspect-video border-0 rounded-lg" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        />
                      )
                    }
                    return (
                      <video 
                        src={resolveMediaUrl(currentItem.url)} 
                        controls 
                        autoPlay
                        className="w-full max-h-[60vh] rounded-lg" 
                      />
                    )
                  })()
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

