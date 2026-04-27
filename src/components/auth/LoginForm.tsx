"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sun, ArrowRight, Eye, EyeOff } from "lucide-react";
import { logIn } from "@/lib/auth"; 

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-background">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-background">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="mb-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white shadow-sunrise">
              <Sun size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Habit Tracker</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-text font-medium">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-muted-text uppercase tracking-wider mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border rounded-2xl py-3.5 px-5 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all placeholder:text-muted-text/30"
                  placeholder="admin@example.com"
                  data-testid="auth-login-email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-muted-text uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <div className="relative">
              
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-2xl py-3.5 pl-5 pr-12 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all placeholder:text-muted-text/30"
                  placeholder="••••••••"
                  data-testid="auth-login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-text/60 hover:text-brand-orange transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white font-bold text-base py-4 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 mt-2"
              data-testid="auth-login-submit"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight className="w-5 h-5" strokeWidth={2.5} />}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-muted-text">
            Don't have an account?{" "}
            <Link href="/signup" className="text-brand-orange font-bold hover:underline">
              Create Account
            </Link>
          </p>

         
        </div>
      </div>

      {/* Right Side: Quote & Visual */}
      <div className="hidden lg:flex w-1/2 bg-brand-orange relative items-center justify-center overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        
        <div className="relative z-10 w-full max-w-md p-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-10 text-white shadow-2xl">
            <div className="mb-8">
              <svg className="w-10 h-10 text-white/40" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H7.1c.5-2.2 2.5-4 4.9-4V8H10zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6.9c.5-2.2 2.5-4 4.9-4V8h-2z" />
              </svg>
            </div>
            <p className="text-2xl font-medium leading-relaxed mb-10">
             Small steps lead to great changes.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Sun size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Sunrise Habits</p>
                <p className="text-white/60 text-xs font-medium">All systems growing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}