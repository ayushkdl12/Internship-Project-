"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Award,
  TrendingUp,
  Code,
  Smartphone,
  Database,
  Palette,
  Globe,
  Cpu,
  Layers,
  Terminal,
  GraduationCap,
  Building2,
  Users,
  Search,
  CheckCircle,
  Star,
  ChevronRight,
  Briefcase,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { label: "Students Registered", value: "5,000+", icon: GraduationCap, color: "text-blue-500" },
  { label: "Organizations",       value: "200+",   icon: Building2,     color: "text-purple-500" },
  { label: "Colleges",            value: "50+",    icon: Users,         color: "text-green-500" },
  { label: "Internships Posted",  value: "1,500+", icon: Briefcase,     color: "text-primary" },
];

const features = [
  {
    icon: GraduationCap,
    title: "For Students",
    description: "Discover internships, build your profile, and kickstart your career journey.",
    points: ["Browse & apply for internships", "Track application status", "Get verified by your college", "Receive certificates"],
    cta: "Register as Student",
    href: "/register?role=student",
    accentColor: "bg-blue-500",
    borderColor: "border-t-blue-500",
    iconBg: "gradient-card-blue",
    iconColor: "text-blue-600",
  },
  {
    icon: Building2,
    title: "For Organizations",
    description: "Find talented interns, manage applications, and build your future workforce.",
    points: ["Post internship opportunities", "Review applications", "Schedule interviews", "Submit evaluations"],
    cta: "Register as Organization",
    href: "/register?role=organization",
    accentColor: "bg-purple-500",
    borderColor: "border-t-purple-500",
    iconBg: "gradient-card-purple",
    iconColor: "text-purple-600",
  },
  {
    icon: Users,
    title: "For Colleges",
    description: "Verify students, track placements, and manage your institution's internship program.",
    points: ["Verify student profiles", "Track student placements", "Generate reports", "Manage departments"],
    cta: "Register as College",
    href: "/register?role=college",
    accentColor: "bg-green-500",
    borderColor: "border-t-green-500",
    iconBg: "gradient-card-green",
    iconColor: "text-green-600",
  },
];

const categories = [
  { title: "Web Dev", icon: Code, color: "text-blue-500", bg: "gradient-card-blue", hover: "shadow-blue-500/20" },
  { title: "App Dev", icon: Smartphone, color: "text-purple-500", bg: "gradient-card-purple", hover: "shadow-purple-500/20" },
  { title: "AI Research", icon: Cpu, color: "text-orange-500", bg: "gradient-card-orange", hover: "shadow-orange-500/20" },
  { title: "FinTech", icon: TrendingUp, color: "text-green-500", bg: "gradient-card-green", hover: "shadow-green-500/20" },
  { title: "Cybersec", icon: Shield, color: "text-red-500", bg: "gradient-card-red", hover: "shadow-red-500/20" },
  { title: "Data Science", icon: Database, color: "text-yellow-500", bg: "gradient-card-yellow", hover: "shadow-yellow-500/20" },
  { title: "UI/UX Design", icon: Palette, color: "text-pink-500", bg: "gradient-card-blue", hover: "shadow-pink-500/20" }, // Reusing blue bg for simplicity or could add more
  { title: "Cloud Ops", icon: Layers, color: "text-cyan-500", bg: "gradient-card-purple", hover: "shadow-cyan-500/20" },
  { title: "Digital Mark", icon: Globe, color: "text-indigo-500", bg: "gradient-card-green", hover: "shadow-indigo-500/20" },
  { title: "Embedded", icon: Terminal, color: "text-slate-500", bg: "gradient-card-orange", hover: "shadow-slate-500/20" },
];

const steps = [
  { step: 1, title: "Create Your Account", description: "Register as a student, organization, or college.", icon: "👤" },
  { step: 2, title: "Complete Your Profile", description: "Add your details, skills, and preferences.", icon: "📝" },
  { step: 3, title: "Connect & Apply", description: "Browse opportunities or post internships.", icon: "🔗" },
  { step: 4, title: "Start Your Journey", description: "Get selected, complete your internship, earn a certificate.", icon: "🏆" },
];

const featuredInternships = [
  { title: "Software Development Intern", company: "Tech Innovation Pvt. Ltd.", location: "Kathmandu", duration: "12 weeks", type: "Stipend", typeColor: "bg-blue-500", description: "Work on real-world projects using modern technologies with a collaborative dev team." },
  { title: "Data Analyst Intern", company: "Data Insights Nepal", location: "Lalitpur", duration: "8 weeks", type: "Paid", typeColor: "bg-green-500", description: "Analyze business data and create actionable insights using Python and SQL." },
  { title: "Graphic Designer Intern", company: "Creative Studio Nepal", location: "Remote", duration: "10 weeks", type: "Stipend", typeColor: "bg-blue-500", description: "Design graphics, logos, and marketing materials for diverse clients." },
  { title: "Teaching Assistant", company: "National College of Engineering", location: "Lalitpur", duration: "16 weeks", type: "Unpaid", typeColor: "bg-gray-500", description: "Assist professors in teaching, grading assignments, and lab sessions." },
  { title: "Marketing Intern", company: "Himalayan Enterprises", location: "Pokhara", duration: "8 weeks", type: "Stipend", typeColor: "bg-blue-500", description: "Support marketing campaigns, social media management, and brand promotion." },
  { title: "Finance Intern", company: "Nepal Investment Bank", location: "Kathmandu", duration: "12 weeks", type: "Paid", typeColor: "bg-green-500", description: "Gain experience in financial analysis, reporting, and investment banking." },
];

const testimonials = [
  { quote: "Found my dream internship through this platform. The application process was smooth and I could track my status in real-time.", name: "CodeNepal", role: "Computer Engineering Student", icon: GraduationCap },
  { quote: "As an organization, we've been able to find talented interns easily. The platform streamlines the entire hiring process.", name: "Hari Sharma", role: "HR Manager, Tech Innovation", icon: Building2 },
  { quote: "Managing student internships has never been easier. We can track all placements and verify students in one place.", name: "Dr. Ram Bahadur", role: "Principal, NCE", icon: Users },
];

const trustBadges = [
  { icon: Shield,    label: "Verified Organizations" },
  { icon: Award,     label: "Certified Internships" },
  { icon: TrendingUp, label: "Career Growth Focused" },
];

interface Internship {
  id: number;
  title: string;
  description: string;
  location: string;
  city: string;
  internshipType: string;
  durationWeeks: number;
  stipendType: string;
  stipendAmount: number | null;
  organization: {
    id: number;
    companyName: string;
    logoUrl: string | null;
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [featuredInternships, setFeaturedInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/internships/featured");
        if (res.ok) {
          const data = await res.json();
          setFeaturedInternships(data);
        }
      } catch (error) {
        console.error("Error fetching featured internships:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center gap-8 justify-between">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-primary p-1.5 rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              InternSync<span className="text-secondary font-black">.</span>
            </span>
          </Link>

          {/* Central Search Bar (InternSync Style) */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="flex w-full items-center border border-border rounded-xl overflow-hidden transition-all duration-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
              <div className="pl-4 text-muted-foreground flex-shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                placeholder="What internship are you looking for?" 
                className="w-full bg-transparent border-none focus:ring-0 text-[15px] py-2 px-3 placeholder:text-muted-foreground/60"
              />
              <button className="bg-primary text-white px-6 py-2.5 font-bold text-sm transition-all hover:bg-primary/90 hover:px-8">
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden xl:flex items-center gap-6 text-[14px] font-semibold text-muted-foreground">
              <Link href="/internships" className="hover:text-primary transition-colors">Explore</Link>
              <Link href="/register?role=organization" className="hover:text-primary transition-colors">Post an Opening</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {status === "authenticated" ? (
                <Button asChild size="sm" className="font-bold text-[14px] bg-primary text-white border-0 rounded-xl px-5 btn-hover">
                  <Link href={`/dashboard/${session.user?.role}`}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Link href="/login" className="text-[14px] font-semibold text-muted-foreground hover:text-primary transition-colors">
                    Sign In
                  </Link>
                  <Button asChild size="sm" variant="outline" className="font-bold text-[14px] border-primary text-primary hover:bg-primary hover:text-white rounded-xl px-5 transition-all">
                    <Link href="/register">Join</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Category Ribbon (Quick Discovery) ────────────────── */}
      <div className="border-b bg-background/50 backdrop-blur-sm overflow-x-auto scrollbar-hide py-3 sticky top-[73px] z-40 hidden md:block">
        <div className="container mx-auto px-4 lg:px-6 flex items-center gap-8 text-[13px] font-semibold text-muted-foreground whitespace-nowrap">
          {["Development", "Design", "Marketing", "Data Science", "Writing", "Business", "Video", "Engineering"].map((cat) => (
            <Link key={cat} href={`/internships?category=${cat.toLowerCase()}`} className="hover:text-primary transition-colors px-3 py-1 rounded-full hover:bg-primary/5">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-[#0f172a] py-20 lg:py-32 relative overflow-hidden min-h-[600px] flex items-center">
        {/* Modern Mesh Gradient Overlay */}
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/30 blur-[120px]" />
           <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[50%] rounded-full bg-secondary/20 blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10 text-center lg:text-left">
          <div className="max-w-4xl mx-auto lg:mx-0">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
              The Next Gen Internship Marketplace
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-8">
              Bridge the gap between <br />
              <span className="text-shimmer italic">Learning</span> & <span className="text-shimmer italic">Earning</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              InternSync connects Nepal&apos;s brightest students with top-tier organizations. 
              Find your next professional milestone today.
            </p>

            {/* Hero Search (InternSync Focus) */}
            <div className="flex w-full max-w-3xl items-center bg-white rounded-2xl overflow-hidden shadow-2xl p-1.5 mb-8">
              <div className="pl-5 text-muted-foreground flex-shrink-0">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                placeholder='Search by role, skill, or company...' 
                className="w-full bg-transparent border-none focus:ring-0 text-lg py-5 px-5 placeholder:text-muted-foreground/50"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all btn-hover">
                Explore Now
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/70 font-semibold text-sm">
              <span className="opacity-60">Trending:</span>
              {["React Native", "UI/UX Design", "Python", "Business Dev"].map((tag) => (
                <Link key={tag} href={`/internships?q=${tag}`} className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 hover:bg-white/10 hover:text-white transition-all">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Abstract Tech Visual */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden xl:block pointer-events-none opacity-20">
           <div className="w-full h-full bg-gradient-to-l from-[#0f172a] to-transparent absolute inset-0 z-10" />
           <Image
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
              alt="Tech Background"
              layout="fill"
              objectFit="cover"
              className="object-center"
           />
        </div>
      </section>

      {/* ── Social Proof ────────────────────────────────────────── */}
      <section className="bg-background border-y py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-24 opacity-40">
            <span className="text-[14px] font-bold text-muted-foreground tracking-widest uppercase">Trusted By Leading Firms:</span>
            {["NCELL", "FONEPAY", "DARAZ", "CG", "PATHAO"].map((logo) => (
               <span key={logo} className="text-xl font-black tracking-tighter text-muted-foreground">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Ecosystem (Roles) ────────────────────────────────── */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/10 border-b">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
               A Tailored Experience for Everyone
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">InternSync brings together the three pillars of the internship ecosystem into one seamless platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className={`group bg-white dark:bg-slate-800/40 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 transition-all hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${f.iconBg} opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150`} />
                <div className={`w-14 h-14 rounded-2xl ${f.iconBg} flex items-center justify-center mb-6 shadow-lg shadow-primary/10`}>
                  <f.icon className={`w-7 h-7 ${f.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{f.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{f.description}</p>
                <ul className="space-y-3 mb-8">
                  {f.points.map((point, pi) => (
                    <li key={pi} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <CheckCircle className={`w-4 h-4 ${f.iconColor}`} />
                      {point}
                    </li>
                  ))}
                </ul>
                <Button asChild className={`w-full h-12 rounded-xl font-bold ${f.accentColor} text-white hover:opacity-90 btn-hover shadow-lg`}>
                  <Link href={f.href}>{f.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Marketplace (Premium Discovery) ─────────────── */}
      <section className="py-24 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                 Category Marketplace
              </h2>
              <p className="text-muted-foreground text-lg">Specialize your search. Find opportunities in these high-demand industries.</p>
            </div>
            <Link href="/internships" className="text-primary font-bold hover:underline flex items-center gap-1">
               All Categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/internships?category=${cat.title.toLowerCase()}`}
                className="group flex flex-col items-center text-center space-y-4 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-primary/[0.02] transition-all bg-white dark:bg-slate-800/20"
              >
                <div className={`w-20 h-20 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-2 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:${cat.hover} relative overflow-hidden`}>
                  <div className={`absolute inset-0 ${cat.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <cat.icon className={`w-10 h-10 ${cat.color} group-hover:text-white transition-all relative z-10`} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{cat.title}</h3>
                <p className="text-[12px] font-bold text-muted-foreground/60 uppercase tracking-widest group-hover:text-primary/60 transition-colors">Explorer</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Internships (Opportunity Grid) ─────────────── */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Handpicked Opportunities</h2>
            <Link href="/internships" className="text-primary font-bold hover:underline flex items-center gap-1 text-[15px]">
               Explorer All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse bg-white dark:bg-slate-800 h-[380px] rounded-2xl border shadow-sm" />
              ))
            ) : featuredInternships.length > 0 ? (
              featuredInternships.map((intern, i) => (
                <Link
                  key={intern.id}
                  href={`/internships/${intern.id}`}
                  className="group bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col h-full active:scale-[0.98]"
                >
                  <div className="h-[200px] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    <Image
                       src={`https://picsum.photos/seed/${intern.id}/400/260`}
                       alt={intern.title}
                       layout="fill"
                       objectFit="cover"
                       className="group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                       <Badge className="bg-secondary text-white border-none font-bold text-[10px] px-3 py-1 shadow-lg">FEATURED</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                         {intern.organization.logoUrl ? (
                           <Image src={intern.organization.logoUrl} alt={intern.organization.companyName} width={32} height={32} />
                         ) : (
                           <Building2 className="w-4 h-4 text-slate-400" />
                         )}
                       </div>
                       <span className="text-[14px] font-bold text-slate-600 dark:text-slate-400 truncate">{intern.organization.companyName}</span>
                    </div>
                    <CardTitle className="text-[18px] leading-snug group-hover:text-primary transition-colors mb-4 line-clamp-2 min-h-[50px] font-bold">
                      {intern.title}
                    </CardTitle>
                    
                    <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                       <div className="flex items-center gap-1.5">
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-1 rounded-md">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          </div>
                          <span className="text-[15px] font-bold text-slate-900 dark:text-slate-200">4.9</span>
                          <span className="text-[13px] text-muted-foreground">(2k+)</span>
                       </div>
                       <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-primary block leading-tight mb-1">Stipend</span>
                          <span className="text-[20px] font-black text-slate-900 dark:text-slate-100">
                            {intern.stipendAmount ? `रू ${intern.stipendAmount.toLocaleString()}` : "Free"}
                          </span>
                       </div>
                    </div>
                  </CardContent>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border">
                <p className="text-muted-foreground text-xl font-medium">No opportunities found. Try another search!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Fiverr Value Proposition (Fiverr Style) ──────────────── */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#404145] dark:text-white mb-8 tracking-tight">
               A whole world of talent at your fingertips
            </h2>
            <div className="space-y-6">
              {[
                { title: "The best for every budget", desc: "Find high-quality services at every price point. No hourly rates, just project-based pricing." },
                { title: "Quality work done quickly", desc: "Find the right freelancer to begin working on your project within minutes." },
                { title: "Protected payments, every time", desc: "Always know what you'll pay upfront. Your payment isn't released until you approve the work." },
                { title: "24/7 support", desc: "Questions? Our round-the-clock support team is available to help anytime, anywhere." },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-[#7a7d85] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-[18px] font-bold text-[#404145] dark:text-muted-foreground mb-1">{item.title}</h4>
                    <p className="text-[#62646a] dark:text-muted-foreground/80 leading-relaxed text-[16px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-xl aspect-video">
             <Image
                src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_700,dpr_1.0/v1/attachments/generic_asset/asset/089971092c63683ea35264855908aa90-1592177411422/standard.png"
                alt="Value proposition"
                layout="fill"
                objectFit="cover"
             />
          </div>
        </div>
      </section>

      {/* ── Testimonials (User Success) ─────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
             <div className="w-full md:w-[40%]">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group transition-transform">
                   <Image
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
                      alt="Student Testimonial"
                      width={600}
                      height={800}
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                         <Star className="w-8 h-8 text-primary fill-primary" />
                      </div>
                   </div>
                </div>
             </div>
             <div className="w-full md:w-[60%] space-y-8">
                <div className="inline-flex items-center gap-3 bg-secondary/10 px-4 py-2 rounded-full">
                   <Star className="w-4 h-4 text-secondary fill-secondary" />
                   <span className="text-[14px] font-bold text-secondary uppercase tracking-wider">Success Story</span>
                </div>
                <blockquote className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                   &ldquo;InternSync didn&apos;t just find me a job; they found me a <span className="text-primary italic">launchpad</span> for my entire career.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                      AK
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">CodeNepal</h4>
                      <p className="text-muted-foreground">Software Engineering Intern @ Fonepay</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section (Modern Platform) ───────────────────────── */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 lg:px-6">
            <div className="bg-gradient-to-br from-primary via-[#4f46e5] to-secondary rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30 group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10">
                <Badge className="mb-8 bg-white/20 text-white border-white/20 backdrop-blur-md px-6 py-2 rounded-full text-[13px] font-bold tracking-[0.2em] uppercase">
                  Join the movement
                </Badge>
                <h2 className="text-5xl lg:text-8xl font-bold mb-12 tracking-tighter leading-[0.9] max-w-5xl mx-auto">
                   Bridge your future <br /> with <span className="text-secondary italic underline decoration-white/20 underline-offset-[12px]">InternSync</span>.
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-slate-50 font-black px-12 h-20 text-2xl rounded-3xl btn-hover shadow-2xl border-none text-primary">
                     <Link href="/register">Create Your Account</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 font-black px-12 h-20 text-2xl rounded-3xl backdrop-blur-sm transition-all border-2">
                     <Link href="/login">Login to Portal</Link>
                  </Button>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t bg-white dark:bg-slate-950 pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-1 space-y-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-primary p-1.5 rounded-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-foreground">
                  InternSync<span className="text-secondary font-black">.</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs transition-opacity hover:opacity-80">
                Empowering the next generation of professional talent in Nepal through meaningful, high-impact connections.
              </p>
              <div className="flex items-center gap-4 text-slate-400">
                 <Link href="#" className="hover:text-primary transition-colors"><Users className="w-5 h-5" /></Link>
                 <Link href="#" className="hover:text-primary transition-colors"><Shield className="w-5 h-5" /></Link>
                 <Link href="#" className="hover:text-primary transition-colors"><TrendingUp className="w-5 h-5" /></Link>
              </div>
            </div>

            {[
              { title: "Platform", links: ["Browse Internships", "Post Opening", "How it Works", "Verification"] },
              { title: "Company", links: ["About Us", "Our Vision", "Careers", "Contact Support"] },
              { title: "Community", links: ["Events", "Success Stories", "Blog", "Forum"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Intellectual Property", "Copyright"] },
            ].map((col, idx) => (
              <div key={idx} className="space-y-6">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[12px]">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(l => (
                    <li key={l}>
                      <Link href="#" className="text-muted-foreground text-[14px] hover:text-primary hover:pl-1 transition-all">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-[13px] font-medium">
            <div className="flex items-center gap-6">
              <span>© {new Date().getFullYear()} InternSync Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-8">
               <button className="hover:text-primary flex items-center gap-1.5 transition-all">
                 Global Hub (NP)
               </button>
               <button className="hover:text-primary flex items-center gap-1.5 transition-all">
                 रू NPR
               </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
