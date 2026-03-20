"use client";

import { useRouter } from "next/navigation";

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-[#0a0a14]/80 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-xl shadow-purple-600/20 text-xl font-black italic">
          B
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-white leading-none">Bidyut Solutions</span>
          <span className="text-[10px] font-black uppercase text-purple-400 tracking-[0.3em] leading-none mt-1">Enterprise Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-4 py-2 px-5 bg-white/5 border border-white/5 rounded-2xl">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-white leading-tight">{user?.email}</span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${user?.role === 'admin' ? 'text-purple-400' : 'text-emerald-400'}`}>
                {user?.role === 'admin' ? '🛡️ Administrator' : '👤 Operator'}
            </span>
          </div>
          <div className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-purple-500 animate-pulse' : 'bg-emerald-500'}`} />
        </div>
        
        <button 
            onClick={handleLogout} 
            className="p-3 text-slate-500 hover:text-white transition-all transform hover:scale-110 active:scale-95"
            title="Secure Logout"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
