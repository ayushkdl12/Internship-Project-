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
  Users,
  Building2,
  GraduationCap,
  FileText,
  CheckCircle,
  Clock,
  Settings,
  Bell,
  LogOut,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalOrganizations: number;
  totalColleges: number;
  totalInternships: number;
  totalApplications: number;
  pendingOrganizations: number;
  pendingColleges: number;
}

const statCards = (s: Stats | null) => [
  { label: "Total Users",       value: s?.totalUsers || 0,         icon: Users,        bg: "gradient-card-blue",   iconColor: "text-blue-600" },
  { label: "Students",          value: s?.totalStudents || 0,      icon: GraduationCap, bg: "gradient-card-green", iconColor: "text-green-600" },
  { label: "Organizations",     value: s?.totalOrganizations || 0, icon: Building2,    bg: "gradient-card-purple", iconColor: "text-purple-600" },
  { label: "Internships",       value: s?.totalInternships || 0,   icon: Briefcase,    bg: "gradient-card-orange", iconColor: "text-orange-600" },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats]     = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (session && session.user?.role !== "admin") router.push(`/dashboard/${session.user?.role}`);
  }, [session, status, router]);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch("/api/users"),
      fetch("/api/admin/stats")
    ])
      .then(([sr, ar]) => Promise.all([sr.json(), ar.json()]))
      .then(([sd, ad]) => {
        setStats(sd.stats);
        setAnalytics(ad);
      })
      .finally(() => setLoading(false));
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto animate-pulse">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

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
            <Badge className="bg-red-500 text-white text-xs">Admin</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/announcements"><Bell className="w-4 h-4" /></Link>
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
            <p className="text-white/70 text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {(stats?.pendingOrganizations || 0) + (stats?.pendingColleges || 0)} pending verifications require attention
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards(stats).map((s, i) => (
            <Card key={i} className="shadow-card border-0">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Charts Section */}
            <div className="grid sm:grid-cols-2 gap-6">
               <Card className="shadow-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Skill Demand</CardTitle>
                    <CardDescription>Top 5 most requested skills</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[240px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics?.skills || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                        <Tooltip 
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                           itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="count" fill="url(#colorSkill)" radius={[0, 4, 4, 0]} barSize={20}>
                          <defs>
                            <linearGradient id="colorSkill" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={1}/>
                            </linearGradient>
                          </defs>
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
               </Card>

               <Card className="shadow-card border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Application Activity</CardTitle>
                    <CardDescription>Daily submissions (last 7 days)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[240px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics?.timeline || []}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="date" style={{ fontSize: '10px' }} axisLine={false} tickLine={false} />
                        <YAxis style={{ fontSize: '10px' }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
               </Card>
            </div>

            {/* Pending Verifications */}
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" /> Pending Verifications
                </CardTitle>
                <CardDescription>Organizations and colleges awaiting review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Organizations", count: stats?.pendingOrganizations || 0, icon: Building2, href: "/admin/organizations" },
                    { label: "Colleges",      count: stats?.pendingColleges || 0,      icon: GraduationCap, href: "/admin/colleges" },
                  ].map((item) => (
                    <Link href={item.href} key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:bg-muted/50 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">Awaiting verification</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/30">
                        {item.count} Pending
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Overview */}
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">System Overview</CardTitle>
                <CardDescription>Platform-wide statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: FileText,    label: "Applications",    value: stats?.totalApplications || 0,  color: "text-blue-600",   bg: "gradient-card-blue" },
                    { icon: Building2,   label: "Colleges",        value: stats?.totalColleges || 0,       color: "text-green-600",  bg: "gradient-card-green" },
                    { icon: CheckCircle, label: "Verified Orgs",   value: (stats?.totalOrganizations || 0) - (stats?.pendingOrganizations || 0), color: "text-green-600", bg: "gradient-card-green" },
                    { icon: Clock,       label: "Pending Actions", value: (stats?.pendingOrganizations || 0) + (stats?.pendingColleges || 0), color: "text-yellow-600", bg: "gradient-card-yellow" },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl p-4 bg-muted/50 space-y-2 text-center">
                      <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center mx-auto`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <p className="text-xl font-bold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
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
                  { icon: Users,        label: "Manage Users",         href: "/admin/users" },
                  { icon: Building2,    label: "Manage Organizations",  href: "/admin/organizations" },
                  { icon: GraduationCap, label: "Manage Colleges",     href: "/admin/colleges" },
                  { icon: Bell,         label: "Announcements",        href: "/announcements" },
                  { icon: Settings,     label: "System Settings",      href: "/admin/settings" },
                ].map((a) => (
                  <Button key={a.href} variant="ghost" className="w-full justify-start h-9 text-sm" asChild>
                    <Link href={a.href}><a.icon className="w-4 h-4 mr-2 text-muted-foreground" />{a.label}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">🔐 Admin Access</p>
                    <p className="text-xs text-red-600/80 dark:text-red-400/70 leading-relaxed">
                      Full system access granted. All actions are logged for security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
