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
  FileText,
  CheckCircle,
  Clock,
  Bell,
  LogOut,
  Plus,
  TrendingUp,
  Building2,
  Users,
  ChevronRight,
  Eye,
} from "lucide-react";

interface Stats {
  totalInternships: number;
  activeInternships: number;
  totalApplications: number;
  pendingApplications: number;
  activeInterns: number;
}

interface Application {
  id: number;
  status: string;
  submittedAt: string;
  student: { fullName: string; program?: string };
  internship: { title: string };
}

export default function OrganizationDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats]               = useState<Stats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (session && session.user?.role !== "organization") router.push(`/dashboard/${session.user?.role}`);
  }, [session, status, router]);

  useEffect(() => {
    if (!session) return;
    Promise.all([fetch("/api/users"), fetch("/api/applications")])
      .then(([sr, ar]) => Promise.all([sr.json(), ar.json()]))
      .then(([sd, ad]) => {
        setStats(sd.stats);
        setApplications(ad.applications?.filter((a: Application) => a.status === "submitted")?.slice(0, 5) || []);
      })
      .finally(() => setLoading(false));
  }, [session]);

  const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
    const res = await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status: newStatus }),
    });
    if (res.ok) setApplications(prev => prev.filter(a => a.id !== applicationId));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto animate-pulse">
            <Building2 className="w-6 h-6 text-white" />
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
            <Badge className="bg-purple-500 text-white text-xs">Organization</Badge>
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
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm mb-1">Welcome back</p>
              <h1 className="text-2xl font-bold tracking-tight">Organization Dashboard</h1>
              <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {applications.length} new applications need your review
              </p>
            </div>
            <Button size="sm" asChild className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl flex-shrink-0">
              <Link href="/internships/create"><Plus className="w-4 h-4 mr-1.5" />Post Internship</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Internships",      value: stats?.totalInternships || 0,   icon: Briefcase,   bg: "gradient-card-blue",   iconColor: "text-blue-600" },
            { label: "Active",           value: stats?.activeInternships || 0,  icon: TrendingUp,  bg: "gradient-card-purple", iconColor: "text-purple-600" },
            { label: "Total Applicants", value: stats?.totalApplications || 0,  icon: FileText,    bg: "gradient-card-orange", iconColor: "text-orange-600" },
            { label: "Pending Review",   value: stats?.pendingApplications || 0, icon: Clock,      bg: "gradient-card-yellow", iconColor: "text-yellow-600" },
            { label: "Active Interns",   value: stats?.activeInterns || 0,      icon: CheckCircle, bg: "gradient-card-green",  iconColor: "text-green-600" },
          ].map((s, i) => (
            <Card key={i} className="shadow-card border-0">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <s.icon className={`w-4 h-4 ${s.iconColor}`} />
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
          {/* Pending Applications */}
          <div className="lg:col-span-2">
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Pending Applications</CardTitle>
                    <CardDescription>New submissions awaiting your review</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/applications">All <ChevronRight className="ml-1 w-3.5 h-3.5" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No pending applications</p>
                    <p className="text-xs text-muted-foreground">Post internships to start receiving applications</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors">
                        <div className="w-9 h-9 rounded-xl gradient-card-purple flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{app.student?.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">{app.internship?.title} · {app.student?.program || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground" asChild>
                            <Link href={`/applications/${app.id}`}><Eye className="w-3.5 h-3.5" /></Link>
                          </Button>
                          <Button size="sm" className="h-7 px-2.5 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg" onClick={() => handleStatusUpdate(app.id, "shortlisted")}>
                            Shortlist
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs text-red-600 border-red-300 hover:bg-red-50 rounded-lg" onClick={() => handleStatusUpdate(app.id, "rejected")}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  { icon: Plus,       label: "Post New Internship",   href: "/internships/create" },
                  { icon: Briefcase,  label: "My Internships",        href: "/internships" },
                  { icon: FileText,   label: "All Applications",      href: "/applications" },
                  { icon: Users,      label: "Active Interns",        href: "/interns" },
                  { icon: Clock,      label: "Interview Slots",       href: "/dashboard/organization/slots" },
                  { icon: Building2,  label: "Company Profile",       href: "/profile" },
                ].map((a) => (
                  <Button key={a.href} variant="ghost" className="w-full justify-start h-9 text-sm" asChild>
                    <Link href={a.href}><a.icon className="w-4 h-4 mr-2 text-muted-foreground" />{a.label}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 gradient-card-purple border border-purple-200 dark:border-purple-900/50">
              <CardContent className="pt-5">
                <Building2 className="w-7 h-7 text-purple-600 mb-3" />
                <p className="text-sm font-semibold mb-1">Verified Organization</p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Verification builds trust and increases application rates.
                </p>
                <Badge className="bg-green-500 text-white text-xs gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
