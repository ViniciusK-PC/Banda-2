'use client';

import Link from 'next/link';
import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-black tracking-tighter text-white mb-6 block">
              VIBE<span className="text-primary">BAND</span>
            </Link>
            <p className="text-muted max-w-md">
              Levando o melhor do rock e energia para todo o Brasil. Siga-nos nas redes sociais para não perder nenhum lançamento.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">LINKS RÁPIDOS</h4>
            <ul className="flex flex-col gap-4 text-muted">
              <li><Link href="/shows" className="hover:text-white transition-colors">Agenda de Shows</Link></li>
              <li><Link href="/media" className="hover:text-white transition-colors">Fotos & Vídeos</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contato para Shows</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">SOCIAL</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                <Youtube size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted">
          <p>© 2026 VIBE BAND. Todos os direitos reservados.</p>
          <p>Desenvolvido com Next.js & MongoDB</p>
        </div>
      </div>

      <style jsx>{`
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
      `}</style>
    </footer>
  );
};

export default Footer;
