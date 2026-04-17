"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      const json = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(json.message || "Invalid credentials");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: "#F5F2EC" }}
    >
      <div className="w-full max-w-md">
        <div
          className="bg-white rounded-xl p-8 md:p-10"
          style={{
            boxShadow: "0 4px 24px rgba(15,14,13,0.08), 0 1px 4px rgba(15,14,13,0.04)",
            borderRadius: "12px",
          }}
        >
          {/* Wordmark */}
          <div className="text-center mb-8">
            <Link href="/">
              <span
                className="text-2xl text-sapphire"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Estate Liquidity
              </span>
            </Link>
            <p className="text-pewter text-sm mt-2">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-ruby-muted p-3 text-sm text-ruby border border-ruby/20">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-charcoal"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal placeholder:text-silver text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-charcoal"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal placeholder:text-silver text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver hover:text-pewter transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sapphire text-white py-2.5 rounded-lg text-sm font-medium hover:bg-sapphire-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-pewter">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-sapphire font-medium hover:text-sapphire-light transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
