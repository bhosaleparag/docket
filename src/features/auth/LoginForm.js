"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Incorrect username or password.");
        setLoading(false);
        return;
      }

      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username" className="text-xs font-medium block mb-1.5">
        Username
      </label>
      <input
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border border-line rounded-md px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-forest/30"
        placeholder="you"
        autoFocus
      />

      <label htmlFor="password" className="text-xs font-medium block mb-1.5">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-line rounded-md px-3 py-2 text-sm mb-2 outline-none focus:ring-2 focus:ring-forest/30"
        placeholder="••••••••"
      />

      <p className={`text-xs mb-4 ${error ? "text-red-600" : "invisible"}`}>{error || "placeholder"}</p>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-forest text-white py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
