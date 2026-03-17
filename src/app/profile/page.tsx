"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import {
  Briefcase,
  User,
  Save,
  LogOut,
  ArrowLeft,
  GraduationCap,
  Linkedin,
  Globe,
  Phone,
  MapPin,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Profile {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  program: string;
  semester: number | string;
  cgpa: number | string;
  bio: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeUrl: string;
  isVerifiedByCollege: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    program: "",
    semester: "",
    cgpa: "",
    bio: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resumeUrl: "",
    isVerifiedByCollege: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setProfile((prev) => ({
            ...prev,
            ...d.profile,
            semester: d.profile.semester || "",
            cgpa: d.profile.cgpa || "",
          }));
        }
      })
      .finally(() => setLoading(false));
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          semester: profile.semester ? parseInt(String(profile.semester)) : null,
          cgpa: profile.cgpa ? parseFloat(String(profile.cgpa)) : null,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      // handle silently
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto animate-pulse">
            <User className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading profile…</p>
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
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-8 max-w-3xl">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href={session ? `/dashboard/${session.user?.role}` : "/"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
            <p className="text-sm text-muted-foreground">Update your personal information and preferences</p>
          </div>
        </div>

        {/* Verification Status */}
        {session?.user?.role === "student" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border ${
              profile.isVerifiedByCollege
                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50"
                : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/50"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              profile.isVerifiedByCollege ? "bg-green-100" : "bg-yellow-100"
            }`}>
              {profile.isVerifiedByCollege
                ? <CheckCircle className="w-5 h-5 text-green-600" />
                : <GraduationCap className="w-5 h-5 text-yellow-600" />
              }
            </div>
            <div>
              <p className="text-sm font-semibold">
                {profile.isVerifiedByCollege ? "✅ Verified Student" : "⏳ Pending College Verification"}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile.isVerifiedByCollege
                  ? "Your profile has been verified by your college."
                  : "Your college has not verified your profile yet. Contact your college coordinator."}
              </p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information */}
          <Card className="shadow-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={profile.fullName} onChange={handleChange("fullName")} placeholder="Your full name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="phone" className="pl-9" value={profile.phone} onChange={handleChange("phone")} placeholder="+977-98XXXXXXXX" />
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="city" className="pl-9" value={profile.city} onChange={handleChange("city")} placeholder="Kathmandu" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={profile.address} onChange={handleChange("address")} placeholder="Your home address" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={profile.bio} onChange={handleChange("bio")} placeholder="Tell us about yourself..." rows={3} className="resize-none" />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          {session?.user?.role === "student" && (
            <Card className="shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Academic Information
                </CardTitle>
                <CardDescription>Your academic details help organizations assess your fit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="program">Program</Label>
                    <Input id="program" value={profile.program} onChange={handleChange("program")} placeholder="e.g. B.E. Computer Engineering" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="semester">Semester</Label>
                      <Input id="semester" type="number" min={1} max={8} value={profile.semester} onChange={handleChange("semester")} placeholder="5" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input id="cgpa" type="number" step="0.01" min={0} max={4} value={profile.cgpa} onChange={handleChange("cgpa")} placeholder="3.5" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="resumeUrl">Resume URL</Label>
                  <Input id="resumeUrl" type="url" value={profile.resumeUrl} onChange={handleChange("resumeUrl")} placeholder="https://drive.google.com/..." />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Online Presence */}
          <Card className="shadow-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Online Presence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="linkedin" className="pl-9" type="url" value={profile.linkedinUrl} onChange={handleChange("linkedinUrl")} placeholder="https://linkedin.com/in/your-profile" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="portfolio">Portfolio / GitHub</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="portfolio" className="pl-9" type="url" value={profile.portfolioUrl} onChange={handleChange("portfolioUrl")} placeholder="https://yoursite.dev" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2">
            {success && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-green-600 text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Profile saved successfully!
              </motion.div>
            )}
            <div className="ml-auto">
              <Button type="submit" disabled={saving} className="gradient-primary text-white border-0 btn-hover px-8">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {saving ? "Saving…" : "Save Profile"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
