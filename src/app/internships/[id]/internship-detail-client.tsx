"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar, 
  Building2, 
  Globe, 
  ArrowLeft,
  ChevronRight,
  Target,
  FileText,
  CheckCircle2,
  Users,
  DollarSign,
  Info,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface Internship {
  id: number;
  title: string;
  description: string;
  requirements: string | null;
  responsibilities: string | null;
  location: string;
  city: string;
  internshipType: string;
  durationWeeks: number;
  startDate: Date;
  endDate: Date;
  applicationDeadline: Date;
  stipendAmount: number | null;
  stipendType: string;
  positionsAvailable: number;
  organizationId: number;
  organization: {
    id: number;
    companyName: string;
    logoUrl: string | null;
    industryType: string | null;
    address: string;
    city: string;
    province: string | null;
    websiteUrl: string | null;
    description: string | null;
  };
  internshipSkills: {
    skill: {
      skillName: string;
    };
  }[];
}

export function InternshipDetailClient({ internship, initialApplied }: { internship: Internship, initialApplied: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(initialApplied);

  const handleApply = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/internships/" + internship.id);
      return;
    }

    if (session.user.role !== "student") {
      alert("Only students can apply for internships");
      return;
    }

    setApplying(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId: internship.id }),
      });

      if (res.ok) {
        setApplied(true);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to apply");
      }
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setApplying(false);
    }
  };

  const getTypeColor = (type: string) => {
    const map: Record<string, string> = {
      onsite: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
      remote: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
      hybrid: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
    };
    return map[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-muted/5">
      <header className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-hidden whitespace-nowrap">
            <Link href="/internships" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-medium text-foreground truncate">{internship.title}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {applied ? (
              <Badge variant="outline" className="h-9 px-4 gap-2 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>Applied</span>
              </Badge>
            ) : (
              <Button 
                onClick={handleApply} 
                disabled={applying}
                className="gradient-primary h-9 px-6 rounded-xl shadow-glow btn-hover text-white border-0"
              >
                {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Now"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-card overflow-hidden rounded-2xl">
              <div className="h-24 gradient-primary relative opacity-90" />
              <CardContent className="relative px-6 pb-8 -mt-12">
                <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                  <Avatar className="w-24 h-24 rounded-2xl border-4 border-background shadow-lg bg-card p-1">
                    <AvatarImage src={internship.organization.logoUrl || ""} alt={internship.organization.companyName} className="object-contain rounded-xl" />
                    <AvatarFallback className="rounded-xl bg-muted text-primary text-2xl font-bold">
                      {internship.organization.companyName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 pb-1">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{internship.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground/80">{internship.organization.companyName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{internship.city}, {internship.organization.province || "Nepal"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Badge className={`${getTypeColor(internship.internshipType)} border-0 rounded-lg px-3 py-1`}>
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                    {internship.internshipType.charAt(0).toUpperCase() + internship.internshipType.slice(1)}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-0 rounded-lg px-3 py-1">
                    <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                    {internship.durationWeeks} Weeks
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-0 rounded-lg px-3 py-1">
                    <DollarSign className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                    {internship.stipendType === "paid" ? `NPR ${internship.stipendAmount}/mo` : internship.stipendType === "stipend" ? "Stipend Provided" : "Unpaid"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white shadow-sm">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold">The Works</h3>
                </div>
                
                <Card className="border-0 shadow-card rounded-2xl">
                  <CardContent className="pt-6 space-y-8">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" /> Project Overview
                      </h4>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-[15px]">
                        {internship.description}
                      </div>
                    </div>

                    {internship.responsibilities && (
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Responsibilities
                        </h4>
                        <div className="grid sm:grid-cols-1 gap-3">
                          {internship.responsibilities.split('\n').filter(line => line.trim()).map((line, i) => {
                             const text = line.replace(/^\s*[-•]\s*/, '');
                             return (
                               <div key={i} className="flex gap-3 bg-muted/30 p-3 rounded-xl border border-transparent hover:border-primary/20 transition-all hover:bg-white dark:hover:bg-muted/50">
                                 <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                 <span className="text-[14.5px] leading-snug">{text}</span>
                               </div>
                             );
                          })}
                        </div>
                      </div>
                    )}

                    {internship.requirements && (
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                          <Info className="w-4 h-4 text-blue-500" /> Requirements
                        </h4>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line border-l-2 border-primary/20 pl-6 italic">
                          {internship.requirements}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {internship.internshipSkills.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm">
                      <Target className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-bold">Skills Required</h3>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {internship.internshipSkills.map((item, i) => (
                      <Badge key={i} variant="secondary" className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-muted/40 shadow-sm border-muted-foreground/10 hover:border-primary/50 transition-colors">
                        {item.skill.skillName}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <Card className="border-0 shadow-card rounded-2xl">
              <CardHeader className="pb-3 pt-6 px-6">
                <CardTitle className="text-lg font-bold">Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Deadline</span>
                      <span className="text-sm font-bold">{new Date(internship.applicationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Availability</span>
                      <span className="text-sm font-bold">{internship.positionsAvailable} Positions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Start Date</span>
                      <span className="text-sm font-bold">{new Date(internship.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                   {applied ? (
                    <Button disabled className="w-full h-11 rounded-xl bg-green-500 text-white border-0 opacity-100 shadow-lg">
                      Already Applied
                    </Button>
                   ) : (
                    <Button 
                      onClick={handleApply} 
                      disabled={applying}
                      className="w-full h-11 rounded-xl gradient-primary text-white border-0 shadow-glow btn-hover font-bold"
                    >
                      {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Express Interest"}
                    </Button>
                   )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card rounded-2xl overflow-hidden">
               <div className="px-6 py-4 bg-primary/5 border-b">
                 <h3 className="font-bold text-sm tracking-widest uppercase">The Field</h3>
               </div>
               <CardContent className="pt-6 px-6 pb-6">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white p-1">
                      <Building2 className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-bold text-lg leading-tight">{internship.organization.companyName}</h4>
                     <Badge variant="outline" className="mt-1 bg-primary/5 text-primary border-primary/20 rounded-md py-0 text-[10px] uppercase font-bold">
                       {internship.organization.industryType || "Technology"}
                     </Badge>
                   </div>
                 </div>
                 
                 <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
                   {internship.organization.description || "A leading organization contributing to the industry with innovation and excellence."}
                 </p>

                 <Separator className="mb-6" />

                 <div className="space-y-4">
                   <div className="flex items-start gap-3">
                     <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                     <div className="flex flex-col">
                       <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Headquarters</span>
                       <span className="text-sm font-medium">{internship.organization.address}, {internship.organization.city}</span>
                     </div>
                   </div>

                   {internship.organization.websiteUrl && (
                     <div className="flex items-start gap-3">
                       <Globe className="w-4 h-4 text-primary mt-0.5" />
                       <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Official Links</span>
                         <a href={internship.organization.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline truncate max-w-[200px]">
                           {internship.organization.websiteUrl.replace(/^https?:\/\//, '')}
                         </a>
                       </div>
                     </div>
                   )}
                 </div>

                 <Button asChild variant="outline" className="w-full mt-8 rounded-xl border-dashed hover:bg-primary/5 hover:text-primary hover:border-primary transition-all group">
                   <Link href={`/internships?organizationId=${internship.organizationId}`}>
                     View More at {internship.organization.companyName}
                     <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                   </Link>
                 </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
