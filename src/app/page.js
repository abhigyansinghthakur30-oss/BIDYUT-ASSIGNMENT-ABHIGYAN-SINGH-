"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a1a] text-white p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-4xl text-center animate-fade-in">
        <div className="inline-block px-4 py-2 mb-6 text-sm font-bold tracking-widest text-purple-400 uppercase border rounded-full border-purple-500/30 bg-purple-500/10">
          Welcome to Bidyut
        </div>
        
        <h1 className="mb-8 text-6xl font-black md:text-8xl tracking-tighter leading-none">
          Next-Gen <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
            Task Management
          </span>
        </h1>

        <p className="max-w-2xl mx-auto mb-12 text-lg text-slate-400 md:text-xl font-medium">
          The all-in-one solution for teams to assign tasks, track progress, 
          and collaborate in real-time. Choose your portal to begin.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link 
            href="/login/user" 
            className="group relative flex flex-col items-start w-full p-8 text-left transition-all duration-300 border h-[240px] sm:w-[320px] glass-card border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-6 font-bold text-white transition-transform duration-300 group-hover:scale-110 bg-emerald-600 rounded-xl">U</div>
            <h3 className="mb-2 text-2xl font-bold">User Portal</h3>
            <p className="text-sm text-slate-400">View tasks, mark completions, and chat with your team.</p>
            <div className="mt-auto font-bold text-emerald-400">Enter User Portal →</div>
          </Link>

          <Link 
            href="/login/admin" 
            className="group relative flex flex-col items-start w-full p-8 text-left transition-all duration-300 border h-[240px] sm:w-[320px] glass-card border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-6 font-bold text-white transition-transform duration-300 group-hover:scale-110 bg-purple-600 rounded-xl">A</div>
            <h3 className="mb-2 text-2xl font-bold">Admin Portal</h3>
            <p className="text-sm text-slate-400">Manage users, delegate tasks, and oversee team operations.</p>
            <div className="mt-auto font-bold text-purple-400">Enter Admin Portal →</div>
          </Link>
        </div>

        <div className="mt-16 text-xs font-semibold tracking-widest text-slate-600 uppercase">
          Powered by Next.js & Supabase
        </div>
      </div>
    </div>
  );
}
