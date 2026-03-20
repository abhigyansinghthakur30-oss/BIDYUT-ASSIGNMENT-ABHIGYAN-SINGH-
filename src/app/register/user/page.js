"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserRegisterPage() {
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "user" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Internal error");
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
            Join the Team
          </h1>
          <p className="text-slate-400">Create your user account to track tasks</p>
        </div>

        <div className="p-8 border glass-card border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Your Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">New Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 text-sm font-medium border rounded-xl bg-red-500/10 border-red-500/20 text-red-400">
                ❌ {error}
              </div>
            )}

            <button type="submit" className="w-full py-4 btn-primary !from-emerald-600 !to-teal-600" disabled={loading}>
              {loading ? "Joining..." : "Create My Account"}
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-slate-500">
            Already a member? <Link href="/login/user" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
