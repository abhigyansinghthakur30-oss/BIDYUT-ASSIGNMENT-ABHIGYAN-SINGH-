"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(108,92,231,0.15) 0%, transparent 60%)",
      }}
    >
      <div className="animate-fade-in" style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 16px",
              background: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "800",
              color: "white",
              boxShadow: "0 8px 30px rgba(108,92,231,0.3)",
            }}
          >
            B
          </div>
          <h1
            className="gradient-text"
            style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "8px" }}
          >
            Bidyut Solutions
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Create your account
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card" style={{ padding: "32px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  color: "#94a3b8",
                }}
              >
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  color: "#94a3b8",
                }}
              >
                Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  color: "#94a3b8",
                }}
              >
                Role
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border:
                      role === "user"
                        ? "2px solid #6c5ce7"
                        : "1px solid rgba(108,92,231,0.2)",
                    background:
                      role === "user"
                        ? "rgba(108,92,231,0.15)"
                        : "var(--color-dark-800)",
                    color: role === "user" ? "#a29bfe" : "#64748b",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  👤 User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border:
                      role === "admin"
                        ? "2px solid #6c5ce7"
                        : "1px solid rgba(108,92,231,0.2)",
                    background:
                      role === "admin"
                        ? "rgba(108,92,231,0.15)"
                        : "var(--color-dark-800)",
                    color: role === "admin" ? "#a29bfe" : "#64748b",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  marginBottom: "20px",
                  background: "rgba(225,112,85,0.1)",
                  border: "1px solid rgba(225,112,85,0.3)",
                  borderRadius: "10px",
                  color: "#e17055",
                  fontSize: "0.85rem",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "14px" }}
            >
              {loading ? (
                <span
                  style={{
                    display: "inline-block",
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                  }}
                />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "0.9rem",
              color: "#64748b",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#a29bfe",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
