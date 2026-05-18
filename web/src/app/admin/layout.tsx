"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Calendar, Image as ImageIcon, Users, Settings, Home, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-black">Carregando...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black border-r border-white/5 flex-shrink-0 p-6 flex flex-col h-auto md:h-[calc(100vh-80px)] md:sticky md:top-20">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-1">Painel Admin</h2>
          <p className="text-sm text-muted">Bem-vindo, <span className="text-primary">{session.user?.name}</span></p>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
            <LayoutDashboard size={20} className="text-primary" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/shows" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/5 hover:text-white transition-colors">
            <Calendar size={20} />
            <span>Agenda de Shows</span>
          </Link>
          <Link href="/admin/media" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/5 hover:text-white transition-colors">
            <ImageIcon size={20} />
            <span>Mídias</span>
          </Link>
          {/* @ts-ignore */}
          {session.user?.role === "ADMIN" && (
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/5 hover:text-white transition-colors">
              <Users size={20} />
              <span>Usuários</span>
            </Link>
          )}
        </nav>

        <div className="mt-8 pt-6 border-t border-white/5">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut size={20} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>

      <style jsx>{`
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}
