"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-[#0a0a1f] via-[#12122b] to-[#0a0a1f]">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 font-extrabold text-white text-3xl shadow-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl ring-4 ring-emerald-500/20">
            U
          </div>
          <h1 className="mb-2 text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            User Portal
          </h1>
          <p className="text-slate-400">Sign in to manage your tasks</p>
        </div>

        <div className="p-8 border glass-card border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 text-sm font-medium border rounded-xl bg-red-500/10 border-red-500/20 text-red-400">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="w-full py-4 btn-primary !from-emerald-600 !to-teal-600" disabled={loading}>
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-slate-500">
            New here? <Link href="/register/user" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Create Account</Link>
          </p>
        </div>

        <div className="mt-6 text-center">
            <Link href="/login/admin" className="text-xs font-semibold text-slate-500 hover:text-slate-300 uppercase tracking-widest">
                Team Member? Switch to Admin Login
            </Link>
        </div>
      </div>
    </div>
  );
}
