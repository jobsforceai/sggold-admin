"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await adminLogin(username, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent shadow-lg shadow-accent/20">
            <span className="text-lg font-black text-bg">SG</span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-ink">Admin Panel</h1>
          <p className="mt-1 text-sm text-ink/50">Sign in to manage SG Gold</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-panel p-6">
          {error && (
            <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm text-ink/70">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-lg border border-border bg-panel-alt px-3 py-2.5 text-ink placeholder:text-ink/30 focus:border-accent focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-ink/70">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-border bg-panel-alt px-3 py-2.5 text-ink placeholder:text-ink/30 focus:border-accent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-2.5 font-medium text-bg transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-ink/30">SG Gold Administration</p>
      </div>
    </main>
  );
}
