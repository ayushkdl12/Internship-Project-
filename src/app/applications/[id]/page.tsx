"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, CheckCircle, Loader2, Building2, MapPin, Globe, Check, ChevronRight } from "lucide-react";

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Application {
  id: number;
  status: string;
  submittedAt: string;
  internship: { 
    id: number;
    title: string;
    organizationId: number;
    organization: { companyName: string; address: string; city: string; websiteUrl: string | null } 
  };
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  
  const [application, setApplication] = useState<Application | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<number | null>(null);

  useEffect(() => {
    if (session) {
      fetchApplicationData();
    }
  }, [session, id]);

  const fetchApplicationData = async () => {
    try {
      const appRes = await fetch(`/api/applications?id=${id}`);
      if (appRes.ok) {
        const appData = await appRes.json();
        const app = appData.application;
        setApplication(app);

        if (app.status === "shortlisted") {
          const slotsRes = await fetch(`/api/interviews/slots/available?orgId=${app.internship.organizationId}`);
          if (slotsRes.ok) {
            setSlots(await slotsRes.json());
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotId: number) => {
    setBookingId(slotId);
    try {
      const res = await fetch("/api/interviews/slots/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, applicationId: parseInt(id) }),
      });

      if (res.ok) {
        fetchApplicationData();
      } else {
        alert("Failed to book slot. It might have been taken.");
      }
    } finally {
      setBookingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!application) return (
     <div className="min-h-screen flex flex-col items-center justify-center gap-4">
       <p className="font-bold text-lg">Application not found</p>
       <Button asChild variant="outline" className="rounded-xl"><Link href="/applications">Back to Applications</Link></Button>
     </div>
  );

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-muted/5 p-4 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <header className="flex items-center gap-4">
           <Button variant="ghost" size="sm" asChild className="rounded-xl">
             <Link href="/applications"><ArrowLeft className="w-4 h-4 mr-1" /> All Applications</Link>
           </Button>
           <h1 className="text-2xl font-bold">Application Details</h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card border-0 overflow-hidden rounded-2xl">
               <div className="h-20 gradient-primary relative opacity-90" />
               <CardContent className="relative px-6 pb-6 -mt-10">
                 <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                   <div className="w-20 h-20 rounded-2xl bg-card border-4 border-background shadow-lg flex items-center justify-center text-primary font-black text-2xl">
                      {application.internship.organization.companyName.charAt(0)}
                   </div>
                   <div className="flex-1">
                     <h2 className="text-2xl font-bold tracking-tight">{application.internship.title}</h2>
                     <p className="text-muted-foreground font-medium">{application.internship.organization.companyName}</p>
                   </div>
                 </div>
               </CardContent>
            </Card>

            <Card className="shadow-card border-0 rounded-2xl">
               <CardHeader>
                 <CardTitle className="text-lg">Status History</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-[2px] before:bg-muted">
                   <div className="relative">
                     <span className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-background">
                       <Check className="w-3.5 h-3.5" />
                     </span>
                     <div>
                       <p className="font-bold">Application Submitted</p>
                       <p className="text-xs text-muted-foreground">{new Date(application.submittedAt).toLocaleDateString()} at {new Date(application.submittedAt).toLocaleTimeString()}</p>
                     </div>
                   </div>

                   {application.status !== "submitted" && (
                    <div className="relative">
                      <span className={`absolute -left-8 top-1 w-6 h-6 rounded-full ${application.status === 'rejected' ? 'bg-red-500' : application.status === 'selected' ? 'bg-green-500' : 'bg-primary'} flex items-center justify-center text-white ring-4 ring-background`}>
                        <Clock className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-bold uppercase tracking-tight text-sm">Now: {application.status.replace(/_/g, " ")}</p>
                        <p className="text-xs text-muted-foreground">Updated recently</p>
                      </div>
                    </div>
                   )}
                 </div>
               </CardContent>
            </Card>

            {application.status === "shortlisted" && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                     <Calendar className="w-4 h-4" />
                   </div>
                   <h3 className="text-xl font-bold">Select Interview Slot</h3>
                </div>
                
                {slots.length === 0 ? (
                  <Card className="border-dashed border-2 bg-transparent shadow-none">
                    <CardContent className="py-8 text-center space-y-2">
                       <p className="font-medium text-muted-foreground italic">No available slots at the moment.</p>
                       <p className="text-xs text-muted-foreground">The organization will add slots soon. Check back later!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {slots.map((slot) => {
                      const date = new Date(slot.startTime);
                      return (
                        <Card key={slot.id} className="shadow-card border-0 hover:ring-2 ring-primary/20 transition-all">
                           <CardContent className="p-4 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-muted flex flex-col items-center justify-center text-muted-foreground">
                                  <span className="text-[8px] font-black uppercase leading-none">{date.toLocaleDateString(undefined, { month: 'short' })}</span>
                                  <span className="text-lg font-black leading-none">{date.getDate()}</span>
                               </div>
                               <div>
                                 <p className="text-sm font-bold">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{date.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                               </div>
                             </div>
                             <Button 
                               size="sm" 
                               onClick={() => handleBookSlot(slot.id)}
                               disabled={bookingId === slot.id}
                               className="gradient-primary text-white border-0 h-8 rounded-lg px-4 font-bold text-xs"
                             >
                               {bookingId === slot.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Book"}
                             </Button>
                           </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>

          <div className="space-y-6">
             <Card className="shadow-card border-0 rounded-2xl overflow-hidden">
                <div className="p-6 space-y-4">
                   <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">About the Recruiter</p>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-card-blue flex items-center justify-center text-blue-600">
                         <Building2 className="w-5 h-5" />
                      </div>
                      <p className="font-bold">{application.internship.organization.companyName}</p>
                   </div>
                   <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-xs font-medium">{application.internship.organization.address}, {application.internship.organization.city}</span>
                      </div>
                      {application.internship.organization.websiteUrl && (
                        <div className="flex items-start gap-3">
                          <Globe className="w-4 h-4 text-primary mt-0.5" />
                          <a href={application.internship.organization.websiteUrl} target="_blank" className="text-xs font-medium text-primary hover:underline truncate">
                            {application.internship.organization.websiteUrl.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                   </div>
                </div>
                <div className="p-4 bg-muted/30 border-t">
                   <Button asChild variant="ghost" className="w-full text-xs font-bold gap-2">
                      <Link href={`/internships/${application.internship.id}`}>
                        View Internship Profile <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                   </Button>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
