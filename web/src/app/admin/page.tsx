"use client";

import { useSession } from "next-auth/react";
import { Calendar, Users, Image as ImageIcon, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();

  const stats = [
    { label: "Próximos Shows", value: "5", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total de Fãs", value: "1.2K", icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Mídias Publicadas", value: "24", icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Visualizações", value: "45.8K", icon: TrendingUp, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Visão Geral</h1>
        <p className="text-muted">Acompanhe as métricas e gerencie o conteúdo da banda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-muted text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="text-primary" /> 
            Shows Próximos
          </h3>
          
          <div className="flex flex-col gap-4">
            {[
              { date: "22 Mai", name: "Espaço das Américas", status: "Confirmado" },
              { date: "28 Mai", name: "Circo Voador", status: "Confirmado" },
              { date: "05 Jun", name: "Opinião", status: "Pendente" },
            ].map((show, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 px-3 py-1 rounded text-sm font-bold">{show.date}</div>
                  <div className="font-medium">{show.name}</div>
                </div>
                <div className={`text-sm px-2 py-1 rounded ${show.status === 'Confirmado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {show.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Alerts */}
        <div className="glass-card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="text-primary" /> 
            Avisos
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="font-bold text-primary mb-1">Atualizar Repertório</p>
              <p className="text-sm text-muted">Lembre-se de adicionar a nova música ao setlist do próximo show.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <p className="font-bold mb-1">Fotos do Rock in Rio</p>
              <p className="text-sm text-muted">As fotos já estão prontas para serem publicadas na galeria.</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}
