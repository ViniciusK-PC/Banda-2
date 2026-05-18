"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">FALE <span className="text-primary">CONOSCO</span></h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Quer a Vibe Band no seu evento? Tem alguma dúvida? Mande uma mensagem pra gente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="flex flex-col gap-8 animate-fade-in">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-muted text-sm">Email</p>
                    <p className="font-bold text-lg">contato@vibeband.com.br</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-muted text-sm">Telefone / WhatsApp</p>
                    <p className="font-bold text-lg">+55 (11) 99999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-muted text-sm">Escritório</p>
                    <p className="font-bold text-lg">São Paulo, SP - Brasil</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-bold text-primary mb-2">Assessoria de Imprensa</h3>
              <p className="text-muted mb-4">Para solicitações de entrevistas, material de imprensa e credenciamento.</p>
              <p className="font-bold">imprensa@vibeband.com.br</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold mb-6">Envie uma mensagem</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted">Assunto</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="" disabled>Selecione um assunto</option>
                  <option value="shows">Contratação para Shows</option>
                  <option value="imprensa">Imprensa</option>
                  <option value="parcerias">Parcerias</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted">Mensagem</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Escreva sua mensagem aqui..."
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full justify-center mt-2">
                <Send size={18} /> ENVIAR MENSAGEM
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}
