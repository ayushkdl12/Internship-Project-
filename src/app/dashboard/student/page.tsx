"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  FileText,
  CheckCircle,
  Clock,
  Bell,
  LogOut,
  User,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Building2,
  Target,
} from "lucide-react";

interface Stats {
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  selectedApplications: number;
  profileCompletion?: number;
}

interface InternshipMatch {
  id: number;
  title: string;
  matchScore: number;
  organization: { companyName: string; logoUrl: string | null };
}

interface Application {
  id: number;
  status: string;
  submittedAt: string;
  internship: { title: string; organization: { companyName: string } };
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    submitted:          "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
    under_review:       "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400",
    shortlisted:        "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
    interview_scheduled:"bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
    selected:           "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
    rejected:           "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  };
  return map[status] || "bg-gray-100 text-gray-700";
};

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats]               = useState<Stats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [matches, setMatches]           = useState<InternshipMatch[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (session && session.user?.role !== "student") router.push(`/dashboard/${session.user?.role}`);
  }, [session, status, router]);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch("/api/users"), 
      fetch("/api/applications"),
      fetch("/api/students/matches")
    ])
      .then(([sr, ar, mr]) => Promise.all([sr.json(), ar.json(), mr.json()]))
      .then(([sd, ad, md]) => {
        setStats(sd.stats);
        setApplications(ad.applications?.slice(0, 5) || []);
        setMatches(Array.isArray(md) ? md.slice(0, 3) : []);
      })
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

  const name = session?.user?.name || "Student";
  const firstName = name.split(" ")[0];

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
            <Badge className="bg-blue-500 text-white text-xs">Student</Badge>
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
            <h1 className="text-2xl font-bold tracking-tight">Good to see you, {firstName}! 👋</h1>
            <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {stats?.totalApplications || 0} total applications · {stats?.pendingApplications || 0} pending review
            </p>
          </div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Applied",  value: stats?.totalApplications || 0,      icon: FileText,     bg: "gradient-card-blue",   iconColor: "text-blue-600" },
            { label: "Under Review",   value: stats?.pendingApplications || 0,    icon: Clock,        bg: "gradient-card-yellow", iconColor: "text-yellow-600" },
            { label: "Shortlisted",    value: stats?.shortlistedApplications || 0, icon: TrendingUp,  bg: "gradient-card-purple", iconColor: "text-purple-600" },
            { label: "Selected",       value: stats?.selectedApplications || 0,   icon: CheckCircle,  bg: "gradient-card-green",  iconColor: "text-green-600" },
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
        </motion.div>

        {/* AI Matches */}
        {matches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white shadow-sm">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold">Top AI Potential Matches</h2>
              <Badge variant="outline" className="ml-auto bg-primary/5 text-primary border-primary/20">Experimental AI</Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {matches.map((match) => (
                <Link key={match.id} href={`/internships/${match.id}`} className="block group">
                  <Card className="shadow-card border-0 cursor-pointer hover:ring-2 ring-primary/20 transition-all overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                       <div className="flex justify-between items-start">
                         <Badge className={`${match.matchScore >= 80 ? 'bg-green-500' : 'bg-blue-500'} text-white font-bold text-[10px] space-x-1`}>
                           <span>{match.matchScore}% Match</span>
                         </Badge>
                       </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">{match.title}</p>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-1">{match.organization.companyName}</p>
                      <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${match.matchScore >= 80 ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-1000`} 
                          style={{ width: `${match.matchScore}%` }} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Recent Applications</CardTitle>
                    <CardDescription>Your latest internship applications</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/applications">View all <ChevronRight className="ml-1 w-3.5 h-3.5" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No applications yet</p>
                    <p className="text-xs text-muted-foreground">Start applying for internships to see them here</p>
                    <Button size="sm" asChild className="btn-hover gradient-primary text-white border-0 mt-1">
                      <Link href="/internships">Browse Internships <ArrowRight className="ml-2 w-3.5 h-3.5" /></Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors group">
                        <div className="w-9 h-9 rounded-xl gradient-card-blue flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{app.internship.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{app.internship.organization.companyName}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusBadge(app.status)}`}>
                          {app.status.replace(/_/g, " ")}
                        </span>
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
                  { icon: Briefcase,    label: "Browse Internships", href: "/internships" },
                  { icon: FileText,     label: "My Applications",    href: "/applications" },
                  { icon: User,         label: "Edit Profile",       href: "/profile" },
                  { icon: BookOpen,     label: "My Documents",       href: "/documents" },
                  { icon: Bell,         label: "Notifications",      href: "/notifications" },
                ].map((a) => (
                  <Button key={a.href} variant="ghost" className="w-full justify-start h-9 text-sm" asChild>
                    <Link href={a.href}><a.icon className="w-4 h-4 mr-2 text-muted-foreground" />{a.label}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/50">
              <CardContent className="pt-5">
                <GraduationCap className="w-7 h-7 text-blue-500 mb-3" />
                <p className="text-sm font-semibold mb-1">Complete Your Profile</p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">A complete profile gets 3× more views from organizations.</p>
                <Button size="sm" variant="outline" asChild className="w-full text-blue-600 border-blue-300 hover:bg-blue-50">
                  <Link href="/profile">Update Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
