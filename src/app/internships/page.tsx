"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  Building2,
  Calendar,
  ArrowLeft,
  Filter,
  Star
} from "lucide-react";
import { NEPAL_CITIES, INDUSTRY_TYPES } from "@/types";

interface Internship {
  id: number;
  title: string;
  description: string;
  city: string;
  internshipType: string;
  durationWeeks: number;
  stipendType: string;
  stipendAmount: number | null;
  applicationDeadline: string;
  organization: {
    id: number;
    companyName: string;
    logoUrl: string | null;
    industryType: string | null;
  };
}

function InternshipsList() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [stipendType, setStipendType] = useState(searchParams.get("stipendType") || "");

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (city) params.append("city", city);
        if (type) params.append("type", type);
        if (stipendType) params.append("stipendType", stipendType);

        const res = await fetch(`/api/internships?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setInternships(data.internships || []);
        }
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [search, city, type, stipendType]);

  const getStipendBadge = (stipendType: string, amount: number | null) => {
    if (stipendType === "paid") {
      return <Badge className="bg-green-500">Paid</Badge>;
    } else if (stipendType === "stipend") {
      return <Badge className="bg-blue-500">NPR {amount?.toLocaleString()}/mo</Badge>;
    }
    return <Badge variant="secondary">Unpaid</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      onsite: "bg-purple-500",
      remote: "bg-green-500",
      hybrid: "bg-orange-500",
    };
    return <Badge className={`${colors[type] || "bg-gray-500"} text-white`}>{type}</Badge>;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base hidden sm:block text-foreground">InternSync<span className="text-secondary font-black">.</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Button asChild className="btn-hover gradient-primary text-white border-0 rounded-xl px-5 text-sm font-bold">
                <Link href={`/dashboard/${session.user?.role}`}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="text-sm font-semibold text-muted-foreground hover:text-primary" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="btn-hover gradient-primary text-white border-0 rounded-xl px-5 text-sm font-bold">
                  <Link href="/register">Join Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Internships</h1>
            <p className="text-muted-foreground">
              Discover internship opportunities across Nepal
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search internships..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {NEPAL_CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Work Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stipendType} onValueChange={setStipendType}>
                <SelectTrigger>
                  <SelectValue placeholder="Compensation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="stipend">Stipend</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-white dark:bg-slate-800 h-[360px] rounded-2xl border shadow-sm" />
            ))}
          </div>
        ) : internships.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <Link
                key={internship.id}
                href={`/internships/${internship.id}`}
                className="group bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col active:scale-[0.98]"
              >
                {/* Card Image */}
                <div className="h-[180px] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${internship.id}/480/240`}
                    alt={internship.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    {getStipendBadge(internship.stipendType, internship.stipendAmount)}
                  </div>
                  <div className="absolute top-3 right-3">
                    {getTypeBadge(internship.internshipType)}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* Company */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-[13px] font-bold text-muted-foreground truncate">{internship.organization.companyName}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[15px] leading-snug group-hover:text-primary transition-colors mb-3 line-clamp-2">
                    {internship.title}
                  </h3>

                  {/* Meta pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{internship.city}
                    </span>
                    <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />{internship.durationWeeks}w
                    </span>
                    <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" />Deadline: {new Date(internship.applicationDeadline).toLocaleDateString("en-NP", { day: "numeric", month: "short" })}
                    </span>
                  </div>

                  {/* Price footer */}
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-1 rounded-md">
                        <Star className="w-3 5 h-3.5 fill-yellow-400 text-yellow-400" />
                      </div>
                      <span className="text-sm font-bold">4.8</span>
                      <span className="text-xs text-muted-foreground">(1k+)</span>
                    </div>
                    <div className="text-right">
                      {internship.stipendAmount ? (
                        <>
                          <span className="text-[10px] uppercase font-bold text-primary block leading-tight">Stipend</span>
                          <span className="text-[18px] font-black text-slate-900 dark:text-slate-100">
                            रू {internship.stipendAmount.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">Unpaid</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No internships found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearch("");
                setCity("");
                setType("");
                setStipendType("");
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function InternshipsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <InternshipsList />
    </Suspense>
  );
}
