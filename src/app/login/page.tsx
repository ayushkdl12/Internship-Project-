"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Briefcase,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  GraduationCap,
  Building2,
  Users,
  Shield,
  CheckCircle,
} from "lucide-react";

const highlights = [
  { icon: GraduationCap, text: "5,000+ Students finding internships" },
  { icon: Building2,     text: "200+ Verified organizations hiring" },
  { icon: Users,         text: "50+ Colleges managing placements" },
  { icon: Shield,        text: "Secure, government-backed platform" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", { email, password, redirect: false });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error);
      } else {
        const res     = await fetch("/api/auth/session");
        const session = await res.json();
        const role    = session?.user?.role;
        const routes: Record<string, string> = {
          student:      "/dashboard/student",
          organization: "/dashboard/organization",
          college:      "/dashboard/college",
          admin:        "/dashboard/admin",
        };
        router.push(routes[role] || "/");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex w-[52%] gradient-primary relative flex-col justify-between p-12 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-white/10 rounded-full" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="w-10 h-10 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Internship Nepal</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 text-white/80 text-xs font-medium">
              🇳🇵 &nbsp;Nepal&apos;s Premier Internship Platform
            </div>
            <h1 className="text-4xl font-bold text-white leading-[1.1] tracking-tight">
              Launch Your<br />Career Journey
            </h1>
            <p className="text-white/75 text-base leading-relaxed max-w-sm">
              Connect with top organizations, gain real-world experience, and earn
              valuable certifications — all in one platform.
            </p>
          </div>

          <ul className="space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                  <h.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/85 text-sm">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer text */}
        <p className="relative z-10 text-white/50 text-xs">
          © {new Date().getFullYear()} Internship Provision System — Nepal
        </p>
      </div>

      {/* ── Right panel — Form ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Top bar */}
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>
          <p className="text-sm text-muted-foreground hidden md:block">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm space-y-7 animate-fade-in-up">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5 justify-center">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Internship Nepal</span>
            </div>

            {/* Heading */}
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
              <p className="text-muted-foreground text-sm">Sign in to continue to your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-3 animate-fade-in-up">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 pr-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl btn-hover gradient-primary text-white border-0 shadow-md font-medium text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : "Sign In"}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demo Credentials</p>
              <div className="space-y-1.5">
                {[
                  ["Admin",   "admin@internshipnepal.gov.np", "admin123"],
                  ["Student", "student@demo.com",             "demo123"],
                ].map(([role, em, pw]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => { setEmail(em); setPassword(pw); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{role}</p>
                      <p className="text-xs text-muted-foreground truncate">{em}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Click to fill</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile register link */}
            <p className="md:hidden text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
