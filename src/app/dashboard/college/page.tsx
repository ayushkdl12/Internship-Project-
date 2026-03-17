"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Briefcase,
  GraduationCap,
  Users,
  Bell,
  LogOut,
  TrendingUp,
  CheckCircle,
  FileText,
  Building2,
  Award,
} from "lucide-react";

interface Stats {
  totalStudents: number;
  verifiedStudents: number;
  totalApplications: number;
  placedStudents: number;
}

export default function CollegeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (session && session.user?.role !== "college") router.push(`/dashboard/${session.user?.role}`);
  }, [session, status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/users")
      .then(r => r.json())
      .then(d => setStats(d.stats))
      .finally(() => setLoading(false));
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto animate-pulse">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const verificationRate = stats?.totalStudents
    ? Math.round(((stats.verifiedStudents || 0) / stats.totalStudents) * 100)
    : 0;
  const placementRate = stats?.totalStudents
    ? Math.round(((stats.placedStudents || 0) / stats.totalStudents) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-muted/5">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base hidden sm:block">InternSync<span className="text-secondary font-black">.</span></span>
            </Link>
            <Badge className="bg-green-600 text-white text-xs">College</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/notifications"><Bell className="w-4 h-4" /></Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Welcome banner */}
        <div className="rounded-2xl gradient-primary text-white p-6 shadow-glow relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-white/70 text-sm mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold tracking-tight">College Dashboard</h1>
            <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {verificationRate}% verification rate · {placementRate}% placement rate
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Students",    value: stats?.totalStudents || 0,    icon: Users,        bg: "gradient-card-blue",   iconColor: "text-blue-600" },
            { label: "Verified Students", value: stats?.verifiedStudents || 0, icon: CheckCircle,  bg: "gradient-card-green",  iconColor: "text-green-600" },
            { label: "Total Applications",value: stats?.totalApplications || 0, icon: FileText,    bg: "gradient-card-orange", iconColor: "text-orange-600" },
            { label: "Placed Students",   value: stats?.placedStudents || 0,   icon: Award,        bg: "gradient-card-purple", iconColor: "text-purple-600" },
          ].map((s, i) => (
            <Card key={i} className="shadow-card border-0">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rate cards */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Performance Overview</CardTitle>
                <CardDescription>Verification and placement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: "Student Verification Rate", value: verificationRate, color: "bg-blue-500",   textColor: "text-blue-600" },
                  { label: "Placement Rate",             value: placementRate,    color: "bg-green-500", textColor: "text-green-600" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{metric.label}</p>
                      <p className={`text-sm font-bold ${metric.textColor}`}>{metric.value}%</p>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${metric.color} transition-all duration-700`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Student Verifications</CardTitle>
                <CardDescription>Review and verify your students' profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl gradient-card-green flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium">Verification Management</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    The dedicated student verification panel is available in your college management section.
                  </p>
                  <Button size="sm" asChild className="btn-hover gradient-primary text-white border-0 mt-1">
                    <Link href="/college/students">Manage Students</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {[
                  { icon: Users,         label: "Manage Students",     href: "/college/students" },
                  { icon: CheckCircle,   label: "Verify Students",     href: "/college/verify" },
                  { icon: FileText,      label: "Reports",             href: "/college/reports" },
                  { icon: Building2,     label: "Partner Orgs",        href: "/college/organizations" },
                  { icon: Bell,          label: "Announcements",       href: "/announcements" },
                ].map((a) => (
                  <Button key={a.href} variant="ghost" className="w-full justify-start h-9 text-sm" asChild>
                    <Link href={a.href}><a.icon className="w-4 h-4 mr-2 text-muted-foreground" />{a.label}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 gradient-card-green border border-green-200 dark:border-green-900/50">
              <CardContent className="pt-5">
                <GraduationCap className="w-7 h-7 text-green-600 mb-3" />
                <p className="text-sm font-semibold mb-1">Academic Institution</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Verified colleges can fast-track student verification and access exclusive reports.
                </p>
                <Badge className="bg-green-500 text-white text-xs gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified College
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
