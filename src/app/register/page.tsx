"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Briefcase, 
  Loader2, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Building2, 
  Users,
  Globe,
  Linkedin,
  FileText,
  BadgeCheck,
  MapPin,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { NEPAL_PROVINCES, NEPAL_CITIES, INDUSTRY_TYPES } from "@/types";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "student";

  const [role, setRole] = useState(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Student fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [bio, setBio] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Organization fields
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyProvince, setCompanyProvince] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [foundedYear, setFoundedYear] = useState("");

  // College fields
  const [collegeNameField, setCollegeNameField] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [collegeAddress, setCollegeAddress] = useState("");
  const [collegeCity, setCollegeCity] = useState("");
  const [collegeProvince, setCollegeProvince] = useState("");
  const [collegePhoneField, setCollegePhoneField] = useState("");
  const [collegeEmailField, setCollegeEmailField] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [collegeWebsite, setCollegeWebsite] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [collegeDescription, setCollegeDescription] = useState("");

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && ["student", "organization", "college"].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phone,
          program,
          semester,
          collegeName,
          rollNumber,
          bio,
          linkedinUrl,
          portfolioUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          companyName,
          address: companyAddress,
          city: companyCity,
          province: companyProvince,
          contactPhone: companyPhone,
          contactEmail: companyEmail,
          industryType,
          websiteUrl,
          description: companyDescription,
          companyRegistrationNumber: regNumber,
          companySize,
          foundedYear: foundedYear ? parseInt(foundedYear) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollegeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register/college", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          collegeName: collegeNameField,
          collegeCode,
          address: collegeAddress,
          city: collegeCity,
          province: collegeProvince,
          contactPhone: collegePhoneField,
          contactEmail: collegeEmailField,
          principalName,
          affiliation,
          websiteUrl: collegeWebsite,
          establishedYear: establishedYear ? parseInt(establishedYear) : null,
          description: collegeDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 dark:bg-muted/5 p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Internship Nepal</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Join Our Community</h1>
            <p className="text-muted-foreground text-sm mt-1">Select your role and provide your details to get started</p>
          </div>
        </div>

        <Card className="shadow-card border-0 overflow-hidden">
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <CardHeader className="bg-muted/50 border-b pb-4">
              <TabsList className="grid w-full grid-cols-3 h-11 bg-background/50 p-1 rounded-xl">
                <TabsTrigger value="student" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Student</span>
                </TabsTrigger>
                <TabsTrigger value="organization" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Organization</span>
                </TabsTrigger>
                <TabsTrigger value="college" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">College</span>
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6 rounded-xl border-red-200 bg-red-50 dark:bg-red-950/20">
                  <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <Suspense fallback={<div className="py-8 text-center text-muted-foreground animate-pulse">Loading form...</div>}>
                {/* Student Registration */}
                <TabsContent value="student" className="mt-0 focus-visible:outline-none">
                  <form onSubmit={handleStudentSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-semibold">Full Name *</Label>
                        <Input id="fullName" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                        <Input id="email" type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                        <Input id="phone" placeholder="98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="program" className="text-sm font-semibold">Program</Label>
                        <Input id="program" placeholder="e.g., Computer Engineering" value={program} onChange={(e) => setProgram(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="semester" className="text-sm font-semibold">Semester</Label>
                        <Select value={semester} onValueChange={setSemester}>
                          <SelectTrigger className="rounded-xl border-muted-foreground/20">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                              <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rollNumber" className="text-sm font-semibold">Roll Number</Label>
                        <Input id="rollNumber" placeholder="Univ Roll No." value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collegeName" className="text-sm font-semibold">College Name</Label>
                        <Input id="collegeName" placeholder="Your college" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-semibold">Short Bio</Label>
                      <Textarea id="bio" placeholder="Tell us about yourself and your career goals..." value={bio} onChange={(e) => setBio(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20 min-h-[100px]" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-sm font-semibold flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile</Label>
                        <Input id="linkedin" placeholder="https://linkedin.com/in/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio" className="text-sm font-semibold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-orange-600" /> Portfolio (GitHub/Behance)</Label>
                        <Input id="portfolio" placeholder="https://yourwork.com" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="studentPassword">Password *</Label>
                        <div className="relative">
                          <Input id="studentPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 pr-10" />
                          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-semibold gradient-primary text-white border-0 shadow-glow btn-hover rounded-xl" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create Student Account"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Organization Registration */}
                <TabsContent value="organization" className="mt-0 focus-visible:outline-none">
                  <form onSubmit={handleOrganizationSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-sm font-semibold">Company Name *</Label>
                        <Input id="companyName" placeholder="Enter company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regNumber" className="text-sm font-semibold flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-green-600" /> Registration Number</Label>
                        <Input id="regNumber" placeholder="Company Reg. No." value={regNumber} onChange={(e) => setRegNumber(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="orgEmail" className="text-sm font-semibold">Login Email *</Label>
                        <Input id="orgEmail" type="email" placeholder="hr@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyPhone" className="text-sm font-semibold">Contact Phone *</Label>
                        <Input id="companyPhone" placeholder="01-XXXXXXX" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="industryType" className="text-sm font-semibold">Industry Type</Label>
                        <Select value={industryType} onValueChange={setIndustryType}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {INDUSTRY_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companySize" className="text-sm font-semibold">Company Size</Label>
                        <Select value={companySize} onValueChange={setCompanySize}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {['1-10', '11-50', '51-200', '201-500', '500+'].map((size) => (
                              <SelectItem key={size} value={size}>{size} Employees</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="foundedYear" className="text-sm font-semibold">Founded Year</Label>
                        <Input id="foundedYear" type="number" placeholder="YYYY" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="companyProvince" className="text-sm font-semibold">Province *</Label>
                        <Select value={companyProvince} onValueChange={setCompanyProvince}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {NEPAL_PROVINCES.map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyCity" className="text-sm font-semibold">City *</Label>
                        <Select value={companyCity} onValueChange={setCompanyCity}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {NEPAL_CITIES.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="companyAddress" className="text-sm font-semibold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Street Address *</Label>
                        <Input id="companyAddress" placeholder="Street name, area" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="websiteUrl" className="text-sm font-semibold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-500" /> Website URL</Label>
                        <Input id="websiteUrl" type="url" placeholder="https://example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyDescription" className="text-sm font-semibold">Company Description</Label>
                      <Textarea id="companyDescription" placeholder="Tell us about your organization..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20 min-h-[100px]" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="orgPassword">Password *</Label>
                        <div className="relative">
                          <Input id="orgPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 pr-10" />
                          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgConfirmPassword">Confirm Password *</Label>
                        <Input id="orgConfirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-semibold gradient-primary text-white border-0 shadow-glow btn-hover rounded-xl" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create Organization Account"}
                    </Button>
                  </form>
                </TabsContent>

                {/* College Registration */}
                <TabsContent value="college" className="mt-0 focus-visible:outline-none">
                  <form onSubmit={handleCollegeSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="collegeNameField" className="text-sm font-semibold">College Name *</Label>
                        <Input id="collegeNameField" placeholder="Enter college name" value={collegeNameField} onChange={(e) => setCollegeNameField(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collegeCode" className="text-sm font-semibold flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-blue-600" /> College Code</Label>
                        <Input id="collegeCode" placeholder="Code (if any)" value={collegeCode} onChange={(e) => setCollegeCode(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="collegeEmail" className="text-sm font-semibold">Login Email *</Label>
                        <Input id="collegeEmail" type="email" placeholder="admin@college.edu.np" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collegePhoneField" className="text-sm font-semibold">Contact Phone *</Label>
                        <Input id="collegePhoneField" placeholder="01-XXXXXXX" value={collegePhoneField} onChange={(e) => setCollegePhoneField(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="principalName" className="text-sm font-semibold">Principal Name</Label>
                        <Input id="principalName" placeholder="Principal's name" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="affiliation" className="text-sm font-semibold">Affiliation</Label>
                        <Select value={affiliation} onValueChange={setAffiliation}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="TU">Tribhuvan University</SelectItem>
                            <SelectItem value="KU">Kathmandu University</SelectItem>
                            <SelectItem value="PU">Purbanchal University</SelectItem>
                            <SelectItem value="PoU">Pokhara University</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="establishedYear" className="text-sm font-semibold">Established Year</Label>
                        <Input id="establishedYear" type="number" placeholder="YYYY" value={establishedYear} onChange={(e) => setEstablishedYear(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="collegeProvince" className="text-sm font-semibold">Province *</Label>
                        <Select value={collegeProvince} onValueChange={setCollegeProvince}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {NEPAL_PROVINCES.map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collegeCity" className="text-sm font-semibold">City *</Label>
                        <Select value={collegeCity} onValueChange={setCollegeCity}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {NEPAL_CITIES.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="collegeAddress" className="text-sm font-semibold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Street Address *</Label>
                        <Input id="collegeAddress" placeholder="Street name, area" value={collegeAddress} onChange={(e) => setCollegeAddress(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collegeWebsite" className="text-sm font-semibold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-500" /> Official Website</Label>
                        <Input id="collegeWebsite" type="url" placeholder="https://college.edu.np" value={collegeWebsite} onChange={(e) => setCollegeWebsite(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="collegeDescription" className="text-sm font-semibold">About College</Label>
                      <Textarea id="collegeDescription" placeholder="Brief description about your institution..." value={collegeDescription} onChange={(e) => setCollegeDescription(e.target.value)} disabled={isLoading} className="rounded-xl border-muted-foreground/20 focus:ring-primary/20 min-h-[100px]" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="collegePassword">Password *</Label>
                        <div className="relative">
                          <Input id="collegePassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20 pr-10" />
                          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collegeConfirmPassword">Confirm Password *</Label>
                        <Input id="collegeConfirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} className="rounded-xl border-muted-foreground/20" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-semibold gradient-primary text-white border-0 shadow-glow btn-hover rounded-xl" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create College Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Suspense>

              <div className="mt-8 pt-6 border-t text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary hover:underline font-bold">
                  Sign In
                </Link>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/"><ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
