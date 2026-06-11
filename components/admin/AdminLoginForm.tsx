"use client";

import { useState } from "react";
import Image from "next/image";
import { SITE_EMAIL, SITE_LOGO_PATH } from "@/lib/siteContent";

const LOGIN_TIMEOUT_MS = 20_000;

async function getLoginErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => null);
    if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
      return data.error;
    }
  } else {
    await response.text().catch(() => "");
  }

  if (response.status >= 500) {
    return "Login is temporarily unavailable. Please try again.";
  }

  return "Login failed. Please try again.";
}

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "submitting" | "redirecting">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setPhase("submitting");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        setError(await getLoginErrorMessage(res));
        setLoading(false);
        setPhase("idle");
        return;
      }

      setPhase("redirecting");
      window.location.assign("/admin/dashboard");
    } catch (error) {
      clearTimeout(timeout);
      setPhase("idle");
      if (error instanceof DOMException && error.name === "AbortError") {
        setError("Login timed out on this connection. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
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
        <div className="flex justify-center mb-10">
          <Image
            src={SITE_LOGO_PATH}
            alt="FDL Bespoke"
            width={140}
            height={46}
            className="h-12 w-auto opacity-70"
          />
        </div>

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
              placeholder={SITE_EMAIL}
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

          {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-black font-bold uppercase tracking-widest text-xs py-3.5 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {phase === "redirecting"
              ? "Opening dashboard..."
              : phase === "submitting"
                ? "Signing in..."
                : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-[10px] uppercase tracking-widest mt-8">
          FDL Bespoke Admin
        </p>
      </div>
    </div>
  );
}
