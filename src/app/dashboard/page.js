"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TaskPanel from "@/components/TaskPanel";
import ChatPanel from "@/components/ChatPanel";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a14] gap-6">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-800 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
        </div>
        <p className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase animate-pulse">
            Authenticating Session...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a14] relative overflow-hidden text-slate-200">
        {/* Subtle Background Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

        <Navbar user={user} />

        <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 md:p-10 max-w-[1920px] mx-auto w-full h-[calc(100vh-88px)] z-10">
            <section className="flex-1 min-w-[320px] lg:w-2/3 h-full animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <TaskPanel user={user} />
            </section>
            
            <section className="flex-1 min-w-[320px] lg:w-1/3 h-full animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <ChatPanel user={user} />
            </section>
        </main>
    </div>
  );
}
