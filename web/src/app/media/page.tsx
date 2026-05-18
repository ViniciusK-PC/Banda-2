"use client";

import { Play, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function MediaPage() {
  const videos = [
    { id: 1, title: "Ao Vivo no Rock in Rio 2024", thumbnail: "https://images.unsplash.com/photo-1540039155732-6761b33fa439?q=80&w=600&auto=format&fit=crop" },
    { id: 2, title: "Bastidores da Turnê", thumbnail: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=600&auto=format&fit=crop" },
    { id: 3, title: "Nova Música (Oficial Video)", thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop" },
  ];

  const photos = [
    "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4b4?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520166012956-add9ba0ee3f4?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">MEDIA <span className="text-primary">&</span> GALERIA</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Assista aos nossos melhores momentos e veja as fotos exclusivas dos shows.
          </p>
        </div>

        {/* Videos Section */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <Play className="text-primary" size={28} />
            <h2 className="text-3xl font-bold">VÍDEOS RECENTES</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video, i) => (
              <div key={video.id} className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                    <Play fill="white" size={24} className="ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="font-bold text-lg">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Photos Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <ImageIcon className="text-primary" size={28} />
            <h2 className="text-3xl font-bold">GALERIA DE FOTOS</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden group cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <img src={url} alt="Band photo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}
