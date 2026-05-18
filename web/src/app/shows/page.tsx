"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Ticket } from "lucide-react";

export default function ShowsPage() {
  const [shows, setShows] = useState([
    { id: 1, date: "22 MAI", fullDate: "22 de Maio, 2026", venue: "Espaço das Américas", city: "São Paulo, SP", status: "CONFIRMADO" },
    { id: 2, date: "28 MAI", fullDate: "28 de Maio, 2026", venue: "Circo Voador", city: "Rio de Janeiro, RJ", status: "CONFIRMADO" },
    { id: 3, date: "05 JUN", fullDate: "05 de Junho, 2026", venue: "Opinião", city: "Porto Alegre, RS", status: "CONFIRMADO" },
    { id: 4, date: "12 JUN", fullDate: "12 de Junho, 2026", venue: "Pedreira Paulo Leminski", city: "Curitiba, PR", status: "ESGOTADO" },
    { id: 5, date: "20 JUN", fullDate: "20 de Junho, 2026", venue: "Classic Hall", city: "Recife, PE", status: "CONFIRMADO" },
  ]);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">AGENDA DE <span className="text-primary">SHOWS</span></h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Confira as datas da nossa nova turnê. Garanta seu ingresso antes que esgote!
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {shows.map((show, i) => (
            <div 
              key={show.id} 
              className="glass-card flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/5 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full md:w-auto text-center md:text-left">
                <div className="w-24 h-24 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10">
                  <span className="text-sm text-primary font-bold">{show.date.split(' ')[1]}</span>
                  <span className="text-3xl font-black">{show.date.split(' ')[0]}</span>
                </div>
                
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-2">{show.venue}</h3>
                  <div className="flex flex-col sm:flex-row gap-4 text-muted">
                    <span className="flex items-center gap-2"><Calendar size={16} /> {show.fullDate}</span>
                    <span className="flex items-center gap-2"><MapPin size={16} /> {show.city}</span>
                  </div>
                </div>
              </div>

              {show.status === "ESGOTADO" ? (
                <div className="px-6 py-3 rounded-lg border border-red-500/50 text-red-500 font-bold bg-red-500/10 w-full md:w-auto text-center">
                  ESGOTADO
                </div>
              ) : (
                <button className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
                  <Ticket size={20} /> INGRESSOS
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}
