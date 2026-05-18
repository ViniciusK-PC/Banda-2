'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter text-white">
          VIBE<span className="text-primary">BAND</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/shows" className="hover:text-primary transition-colors">AGENDA</Link>
          <Link href="/media" className="hover:text-primary transition-colors">MEDIA</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">CONTATO</Link>
          <Link href="/auth/login" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all">
            <User size={18} />
            <span>LOGIN</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 py-8 px-6 flex flex-col gap-6 animate-fade-in">
          <Link href="/shows" onClick={() => setIsOpen(false)} className="text-xl font-bold">AGENDA</Link>
          <Link href="/media" onClick={() => setIsOpen(false)} className="text-xl font-bold">MEDIA</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-xl font-bold">CONTATO</Link>
          <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-xl font-bold text-primary">LOGIN</Link>
        </div>
      )}

      <style jsx>{`
        .text-primary { color: var(--primary); }
      `}</style>
    </nav>
  );
};

export default Navbar;
