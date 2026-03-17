import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Award, Building2, User, Calendar, MapPin, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function VerifyCertificatePage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;

  const certificate = await db.certificate.findUnique({
    where: { verificationHash: hash },
    include: {
      enrollment: {
        include: {
          student: { include: { user: { select: { name: true } } } },
          application: {
            include: { 
              internship: { 
                include: { organization: true } 
              } 
            }
          }
        }
      }
    }
  });

  if (!certificate) {
    notFound();
  }

  const enrollment = certificate.enrollment;
  const organization = enrollment.application.internship.organization;

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-muted/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
           <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-2 shadow-glow">
             <ShieldCheck className="w-10 h-10 text-white" />
           </div>
           <h1 className="text-2xl font-black tracking-tight">Verified Credential</h1>
           <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Internship Provision System - Nepal</p>
        </div>

        <Card className="border-0 shadow-2xl rounded-[2rem] overflow-hidden bg-white dark:bg-card">
          <div className="h-4 gradient-primary" />
          <CardContent className="p-8 sm:p-12 space-y-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <Badge className="bg-green-500 text-white border-0 py-0.5 px-3 rounded-full text-[10px] uppercase font-bold gap-1 mb-2">
                   <CheckCircle2 className="w-3.5 h-3.5" /> Authentic
                 </Badge>
                 <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Certificate Number</p>
                 <p className="text-lg font-mono font-bold">{certificate.certificateNumber}</p>
              </div>
              <Award className="w-16 h-16 text-primary/10" />
            </div>

            <div className="space-y-2 text-center py-4">
              <p className="text-lg font-medium text-muted-foreground italic">This is to certify that</p>
              <h2 className="text-4xl font-black tracking-tight underline decoration-primary/20 underline-offset-8">
                {enrollment.student?.fullName || enrollment.student?.user?.name}
              </h2>
            </div>

            <p className="text-center text-muted-foreground leading-relaxed max-w-lg mx-auto">
              has successfully completed their professional internship at <span className="font-bold text-foreground">{organization.companyName}</span> as a <span className="font-bold text-foreground">{enrollment.application.internship.title}</span>.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-muted/50">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Issuing Body</p>
                      <p className="text-sm font-bold">{organization.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Issue Date</p>
                      <p className="text-sm font-bold">{new Date(certificate.issueDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Location</p>
                      <p className="text-sm font-bold">{organization.city}, {organization.province || "Nepal"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Verification</p>
                      <p className="text-sm font-bold text-emerald-600">Securely Verified</p>
                    </div>
                  </div>
               </div>
            </div>
          </CardContent>
          <div className="bg-muted/30 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
             <p className="text-[10px] text-muted-foreground text-center sm:text-left">
               © {new Date().getFullYear()} Internship Provision System Nepal. All valid certificates are linked to this domain.
             </p>
             <Button asChild size="sm" variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5">
               <Link href="/">Visit Platform</Link>
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
