// User Types
export type UserRole = "student" | "organization" | "college" | "admin";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

// Student Types
export interface Student {
  id: number;
  userId: number;
  collegeId?: number;
  fullName: string;
  rollNumber?: string;
  program?: string;
  semester?: number;
  batchYear?: number;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  resumeUrl?: string;
  profilePictureUrl?: string;
  cgpa?: number;
  graduationYear?: number;
  bio?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  isVerifiedByCollege: boolean;
  verificationDate?: Date;
}

// Organization Types
export interface Organization {
  id: number;
  userId: number;
  companyName: string;
  companyRegistrationNumber?: string;
  industryType?: string;
  address: string;
  city: string;
  district: string;
  province: string;
  contactPhone: string;
  contactEmail: string;
  websiteUrl?: string;
  description?: string;
  logoUrl?: string;
  companySize?: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  foundedYear?: number;
  socialMediaLinks?: string;
  isVerified: boolean;
  verificationDate?: Date;
}

// College Types
export interface College {
  id: number;
  userId: number;
  collegeName: string;
  collegeCode?: string;
  address: string;
  city: string;
  district: string;
  province: string;
  contactPhone: string;
  contactEmail: string;
  websiteUrl?: string;
  principalName?: string;
  affiliation?: string;
  establishedYear?: number;
  description?: string;
  logoUrl?: string;
  isVerified: boolean;
  verificationDate?: Date;
}

// Internship Types
export type InternshipType = "onsite" | "remote" | "hybrid";
export type StipendType = "paid" | "unpaid" | "stipend";
export type InternshipStatus = "draft" | "open" | "closed" | "filled" | "cancelled";

export interface Internship {
  id: number;
  organizationId: number;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  city: string;
  district?: string;
  province?: string;
  internshipType: InternshipType;
  durationWeeks: number;
  startDate: Date;
  endDate: Date;
  applicationDeadline: Date;
  stipendAmount?: number;
  stipendType: StipendType;
  positionsAvailable: number;
  positionsFilled: number;
  minCgpa?: number;
  eligiblePrograms?: string;
  eligibleSemesters?: string;
  skillsRequired?: string;
  perks?: string;
  status: InternshipStatus;
  isPublished: boolean;
  publishedAt?: Date;
  organization?: Organization;
}

// Application Types
export type ApplicationStatus = 
  | "draft" 
  | "submitted" 
  | "under_review" 
  | "shortlisted" 
  | "interview_scheduled" 
  | "selected" 
  | "rejected" 
  | "withdrawn";

export interface Application {
  id: number;
  internshipId: number;
  studentId: number;
  coverLetter?: string;
  resumeUrl?: string;
  additionalDocuments?: string;
  answers?: string;
  status: ApplicationStatus;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: number;
  selectionScore?: number;
  feedback?: string;
  internship?: Internship;
  student?: Student;
}

// Notification Types
export type NotificationType = 
  | "application" 
  | "interview" 
  | "selection" 
  | "deadline" 
  | "system" 
  | "announcement";

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  referenceType?: string;
  referenceId?: number;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

// Province list for Nepal
export const NEPAL_PROVINCES = [
  "Province 1",
  "Madhesh Province",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
] as const;

// Cities in Nepal (major ones)
export const NEPAL_CITIES = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bhaktapur",
  "Biratnagar",
  "Birgunj",
  "Bharatpur",
  "Butwal",
  "Dharan",
  "Bhairahawa",
  "Hetauda",
  "Nepalgunj",
  "Dhangadhi",
  "Janakpur",
  "Birendranagar",
  "Itahari",
  "Kalaiya",
] as const;

// Industry types
export const INDUSTRY_TYPES = [
  "Information Technology",
  "Software Development",
  "Banking & Finance",
  "Education",
  "Healthcare",
  "Manufacturing",
  "Tourism & Hospitality",
  "Construction",
  "Agriculture",
  "Media & Communication",
  "Consulting",
  "E-commerce",
  "Telecommunications",
  "Energy & Power",
  "Other",
] as const;

// Skills categories
export const SKILL_CATEGORIES = [
  "Programming",
  "Frontend Framework",
  "Backend Framework",
  "Database",
  "DevOps",
  "Cloud Computing",
  "AI/ML",
  "Data Science",
  "Design",
  "Soft Skills",
  "Other",
] as const;
