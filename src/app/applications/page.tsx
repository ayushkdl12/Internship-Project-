"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, CheckCircle, ChevronRight, Loader2, Building2, Briefcase } from "lucide-react";

interface Application {
  id: number;
  status: string;
  submittedAt: string;
  internship: { 
    id: number;
    title: string; 
    organization: { companyName: string } 
  };
}

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/applications")
        .then(res => res.json())
        .then(data => setApplications(data.applications || []))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const getStatusBadge = (status: string) => {
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-muted/5 p-4 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <header className="flex items-center gap-4">
           <Button variant="ghost" size="sm" asChild className="rounded-xl">
             <Link href="/dashboard/student"><ArrowLeft className="w-4 h-4 mr-1" /> Dashboard</Link>
           </Button>
           <h1 className="text-2xl font-bold">My Applications</h1>
        </header>

        {applications.length === 0 ? (
          <Card className="border-dashed border-2 bg-transparent shadow-none">
            <CardContent className="py-20 flex flex-col items-center gap-4 text-center">
              <Briefcase className="w-16 h-16 text-muted-foreground opacity-20" />
              <p className="font-bold text-lg">No applications yet</p>
              <p className="text-muted-foreground max-w-sm">You haven't applied for any internships yet. Start your journey by browsing available opportunities!</p>
              <Button asChild className="gradient-primary text-white border-0 shadow-glow rounded-xl px-8 h-12 mt-2">
                <Link href="/internships">Explore Internships</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="shadow-card border-0 group overflow-hidden">
                <CardContent className="p-0">
                  <Link href={`/applications/${app.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-lg group-hover:text-primary transition-colors">{app.internship.title}</p>
                        <p className="text-sm text-muted-foreground">{app.internship.organization.companyName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="flex flex-col sm:items-end">
                         <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Status</span>
                         <Badge className={`${getStatusBadge(app.status)} border-0 rounded-lg px-3 py-1 text-xs font-bold`}>
                           {app.status.replace(/_/g, " ").toUpperCase()}
                         </Badge>
                      </div>
                      <div className="hidden sm:flex flex-col items-end">
                         <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Applied On</span>
                         <span className="text-sm font-medium">{new Date(app.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  {app.status === "shortlisted" && (
                    <div className="bg-purple-500/10 dark:bg-purple-950/20 px-6 py-3 border-t border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <p className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2">
                         <Calendar className="w-4 h-4" />
                         Action Required: Book your interview slot!
                       </p>
                       <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg rounded-xl font-bold h-9">
                         <Link href={`/applications/${app.id}`}>Book Now</Link>
                       </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
