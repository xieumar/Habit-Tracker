"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sun, Mail, Lock, ArrowRight } from "lucide-react";
import { logIn } from "@/lib/auth"; 

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = logIn(email, password);
      
      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }
      
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-brand-orange/10 to-brand-orange/20 p-4 sm:p-8 font-sans">
      
      <div className="w-full max-w-5xl flex flex-col lg:flex-row lg:bg-card lg:rounded-[3rem] lg:shadow-sunrise overflow-hidden">
        
        <div className="hidden lg:flex w-1/2 relative bg-foreground">
          <img
            src="https://images.unsplash.com/photo-1494548162494-384bba4ab999?q=80&w=1200&auto=format&fit=crop"
            alt="Sunrise inspiration"
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/80 via-transparent to-transparent" />
          
          <div className="relative z-10 flex flex-col justify-end mb-12 p-12 text-white w-full">
            <Sun className="w-10 h-10 mb-6 text-white" strokeWidth={2} />
            <h1 className="text-4xl font-bold mb-3 leading-tight">
              Begin your journey of<br />quiet momentum.
            </h1>
            <p className="text-white/80 text-lg max-w-sm">
              Organize your day with the focused energy of a new dawn. Designed for clarity and purpose.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-6 lg:py-16 lg:px-12 relative">
          
          <div className="w-full max-w-[360px] lg:max-w-md">
            
            <div className="text-center mb-8 lg:mb-10">
              <div className="inline-flex items-center justify-center mb-3 text-brand-orange">
                <Sun className="w-10 h-10 lg:w-12 lg:h-12" strokeWidth={2} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-1.5">
                Welcome Back
              </h2>
              <p className="text-muted-text text-sm font-medium">
                Quiet momentum starts here.
              </p>
            </div>

            <div className="bg-card rounded-[2rem] shadow-sunrise lg:shadow-none p-6 sm:p-8 lg:p-0">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-muted-text uppercase tracking-wider mb-2 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-text/60">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-border rounded-2xl py-3.5 pl-11 pr-4 text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all placeholder:text-muted-text/40"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-muted-text uppercase tracking-wider mb-2 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-text/60">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-border rounded-2xl py-3.5 pl-11 pr-4 text-foreground bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all placeholder:text-muted-text/40"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-orange text-white font-semibold text-base py-3.5 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-brand-orange/20 mt-2"
                >
                  {loading ? "Logging In..." : "Log In"}
                  {!loading && <ArrowRight className="w-5 h-5" strokeWidth={2.5} />}
                </button>
              </form>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-muted-text">
              Don't have an account?{" "}
              <Link href="/signup" className="text-brand-orange hover:underline">
                Sign Up
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}