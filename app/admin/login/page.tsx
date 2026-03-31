"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center px-6">
      <style
        dangerouslySetInnerHTML={{
          __html:
            ".site-chrome-top,.site-chrome-bottom{display:none!important}.site-main{padding:0!important}",
        }}
      />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="https://fdlbespoke.co.uk/wp-content/uploads/2025/06/cropped-cropped-FDL-UK-Logo-White-Sq.png"
            alt="FDL Bespoke"
            width={80}
            height={80}
            className="h-16 w-auto opacity-60"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none transition-colors rounded-none"
              placeholder="admin@fdlbespoke.co.uk"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none transition-colors rounded-none"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-black font-bold uppercase tracking-widest text-xs py-3.5 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-[10px] uppercase tracking-widest mt-8">
          FDL Bespoke Admin
        </p>
      </div>
    </div>
  );
}
