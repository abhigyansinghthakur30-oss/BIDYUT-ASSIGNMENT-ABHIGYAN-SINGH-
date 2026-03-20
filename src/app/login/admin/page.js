"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
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

      if (data.user.role !== "admin") {
        setError("Unauthorized: This access is for Admin only.");
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
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 font-extrabold text-white text-3xl shadow-2xl bg-gradient-to-tr from-purple-600 to-blue-500 rounded-2xl ring-4 ring-purple-500/20">
            A
          </div>
          <h1 className="mb-2 text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300">
            Admin Portal
          </h1>
          <p className="text-slate-400">Secure access for Bidyut Solutions Admins</p>
        </div>

        <div className="p-8 border glass-card border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Admin Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@bidyut.com"
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

            <button type="submit" className="w-full py-4 btn-primary" disabled={loading}>
              {loading ? "Authenticating..." : "Login to Admin Dashboard"}
            </button>
          </form>

          <div className="mt-8 space-y-4 text-center">
            <p className="text-sm text-slate-500">
              Not an admin? <Link href="/login/user" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">Sign in as User</Link>
            </p>
            <Link href="/register/admin" className="block text-xs font-medium uppercase tracking-widest text-slate-600 hover:text-slate-400">
              Create Admin Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
