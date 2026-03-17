-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLogin" DATETIME,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "collegeId" INTEGER,
    "fullName" TEXT NOT NULL,
    "rollNumber" TEXT,
    "program" TEXT,
    "semester" INTEGER,
    "batchYear" INTEGER,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "district" TEXT,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "resumeUrl" TEXT,
    "profilePictureUrl" TEXT,
    "cgpa" REAL,
    "graduationYear" INTEGER,
    "bio" TEXT,
    "linkedinUrl" TEXT,
    "portfolioUrl" TEXT,
    "isVerifiedByCollege" BOOLEAN NOT NULL DEFAULT false,
    "verificationDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Student_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "College" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "collegeName" TEXT NOT NULL,
    "collegeCode" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "principalName" TEXT,
    "affiliation" TEXT,
    "establishedYear" INTEGER,
    "description" TEXT,
    "logoUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "College_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyRegistrationNumber" TEXT,
    "industryType" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "companySize" TEXT,
    "foundedYear" INTEGER,
    "socialMediaLinks" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDate" DATETIME,
    "verifiedBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Organization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mentor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "designation" TEXT NOT NULL,
    "department" TEXT,
    "profilePictureUrl" TEXT,
    "bio" TEXT,
    "expertiseAreas" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Mentor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skillName" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StudentSkill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "proficiencyLevel" TEXT NOT NULL DEFAULT 'intermediate',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentSkill_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Internship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "responsibilities" TEXT,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "province" TEXT,
    "internshipType" TEXT NOT NULL DEFAULT 'onsite',
    "durationWeeks" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "applicationDeadline" DATETIME NOT NULL,
    "stipendAmount" REAL,
    "stipendType" TEXT NOT NULL DEFAULT 'unpaid',
    "positionsAvailable" INTEGER NOT NULL DEFAULT 1,
    "positionsFilled" INTEGER NOT NULL DEFAULT 0,
    "minCgpa" REAL,
    "eligiblePrograms" TEXT,
    "eligibleSemesters" TEXT,
    "skillsRequired" TEXT,
    "perks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Internship_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InternshipSkill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "internshipId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "importanceWeight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InternshipSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InternshipSkill_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "internshipId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "coverLetter" TEXT,
    "resumeUrl" TEXT,
    "additionalDocuments" TEXT,
    "answers" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "submittedAt" DATETIME,
    "reviewedAt" DATETIME,
    "reviewedBy" INTEGER,
    "selectionScore" REAL,
    "feedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationId" INTEGER NOT NULL,
    "mentorId" INTEGER,
    "interviewType" TEXT NOT NULL DEFAULT 'video',
    "scheduledDate" DATETIME NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "location" TEXT,
    "meetingLink" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "interviewerNotes" TEXT,
    "rating" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Interview_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterviewSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "applicationId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InterviewSlot_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InternEnrollment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationId" INTEGER NOT NULL,
    "studentId" INTEGER,
    "mentorId" INTEGER,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "actualStartDate" DATETIME,
    "actualEndDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'enrolled',
    "completionLetterUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InternEnrollment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InternEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InternEnrollment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enrollmentId" INTEGER NOT NULL,
    "reportType" TEXT NOT NULL DEFAULT 'weekly',
    "reportPeriod" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workDone" TEXT NOT NULL,
    "learnings" TEXT,
    "challenges" TEXT,
    "nextWeekPlan" TEXT,
    "attachments" TEXT,
    "mentorFeedback" TEXT,
    "mentorRating" INTEGER,
    "reviewedByMentor" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" DATETIME,
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProgressReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "InternEnrollment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enrollmentId" INTEGER NOT NULL,
    "attendanceDate" DATETIME NOT NULL,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'present',
    "notes" TEXT,
    "markedBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Attendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "InternEnrollment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enrollmentId" INTEGER NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "certificateUrl" TEXT,
    "issueDate" DATETIME NOT NULL,
    "validUntil" DATETIME,
    "verificationHash" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    "overallRating" REAL,
    "skillsAcquired" TEXT,
    "completionStatus" TEXT NOT NULL DEFAULT 'completed',
    "generatedBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Certificate_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "InternEnrollment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enrollmentId" INTEGER NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "technicalSkills" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "professionalism" INTEGER NOT NULL,
    "problemSolving" INTEGER NOT NULL,
    "teamwork" INTEGER NOT NULL,
    "punctuality" INTEGER NOT NULL,
    "initiative" INTEGER NOT NULL,
    "overallRating" REAL NOT NULL,
    "strengths" TEXT,
    "areasForImprovement" TEXT,
    "recommendations" TEXT,
    "comments" TEXT,
    "wouldRecommend" BOOLEAN NOT NULL DEFAULT true,
    "evaluationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Evaluation_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Evaluation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "InternEnrollment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "notificationType" TEXT NOT NULL,
    "referenceType" TEXT,
    "referenceId" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "sentVia" TEXT NOT NULL DEFAULT 'in_app',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedInternship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "internshipId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedInternship_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedInternship_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL DEFAULT 'all',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" DATETIME,
    "expiresAt" DATETIME,
    "createdBy" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Announcement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" INTEGER,
    "oldValues" TEXT,
    "newValues" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmailVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE INDEX "Student_collegeId_idx" ON "Student"("collegeId");

-- CreateIndex
CREATE INDEX "Student_isVerifiedByCollege_idx" ON "Student"("isVerifiedByCollege");

-- CreateIndex
CREATE UNIQUE INDEX "College_userId_key" ON "College"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "College_collegeCode_key" ON "College"("collegeCode");

-- CreateIndex
CREATE INDEX "College_isVerified_idx" ON "College"("isVerified");

-- CreateIndex
CREATE INDEX "College_province_idx" ON "College"("province");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_userId_key" ON "Organization"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_companyRegistrationNumber_key" ON "Organization"("companyRegistrationNumber");

-- CreateIndex
CREATE INDEX "Organization_isVerified_idx" ON "Organization"("isVerified");

-- CreateIndex
CREATE INDEX "Organization_industryType_idx" ON "Organization"("industryType");

-- CreateIndex
CREATE INDEX "Organization_province_idx" ON "Organization"("province");

-- CreateIndex
CREATE INDEX "Mentor_organizationId_idx" ON "Mentor"("organizationId");

-- CreateIndex
CREATE INDEX "Mentor_isActive_idx" ON "Mentor"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_skillName_key" ON "Skill"("skillName");

-- CreateIndex
CREATE INDEX "Skill_category_idx" ON "Skill"("category");

-- CreateIndex
CREATE INDEX "StudentSkill_skillId_idx" ON "StudentSkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentSkill_studentId_skillId_key" ON "StudentSkill"("studentId", "skillId");

-- CreateIndex
CREATE INDEX "Internship_status_idx" ON "Internship"("status");

-- CreateIndex
CREATE INDEX "Internship_applicationDeadline_idx" ON "Internship"("applicationDeadline");

-- CreateIndex
CREATE INDEX "Internship_city_province_idx" ON "Internship"("city", "province");

-- CreateIndex
CREATE INDEX "Internship_organizationId_idx" ON "Internship"("organizationId");

-- CreateIndex
CREATE INDEX "Internship_isPublished_idx" ON "Internship"("isPublished");

-- CreateIndex
CREATE INDEX "InternshipSkill_skillId_idx" ON "InternshipSkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipSkill_internshipId_skillId_key" ON "InternshipSkill"("internshipId", "skillId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_studentId_idx" ON "Application"("studentId");

-- CreateIndex
CREATE INDEX "Application_internshipId_idx" ON "Application"("internshipId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_internshipId_studentId_key" ON "Application"("internshipId", "studentId");

-- CreateIndex
CREATE INDEX "Interview_status_idx" ON "Interview"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewSlot_applicationId_key" ON "InterviewSlot"("applicationId");

-- CreateIndex
CREATE INDEX "InterviewSlot_organizationId_idx" ON "InterviewSlot"("organizationId");

-- CreateIndex
CREATE INDEX "InterviewSlot_startTime_idx" ON "InterviewSlot"("startTime");

-- CreateIndex
CREATE INDEX "InterviewSlot_isBooked_idx" ON "InterviewSlot"("isBooked");

-- CreateIndex
CREATE UNIQUE INDEX "InternEnrollment_applicationId_key" ON "InternEnrollment"("applicationId");

-- CreateIndex
CREATE INDEX "InternEnrollment_status_idx" ON "InternEnrollment"("status");

-- CreateIndex
CREATE INDEX "InternEnrollment_startDate_endDate_idx" ON "InternEnrollment"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "ProgressReport_enrollmentId_idx" ON "ProgressReport"("enrollmentId");

-- CreateIndex
CREATE INDEX "ProgressReport_reportType_idx" ON "ProgressReport"("reportType");

-- CreateIndex
CREATE INDEX "ProgressReport_submissionDate_idx" ON "ProgressReport"("submissionDate");

-- CreateIndex
CREATE INDEX "Attendance_attendanceDate_idx" ON "Attendance"("attendanceDate");

-- CreateIndex
CREATE INDEX "Attendance_status_idx" ON "Attendance"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_enrollmentId_attendanceDate_key" ON "Attendance"("enrollmentId", "attendanceDate");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_enrollmentId_key" ON "Certificate"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_verificationHash_key" ON "Certificate"("verificationHash");

-- CreateIndex
CREATE INDEX "Certificate_certificateNumber_idx" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "Certificate_verificationHash_idx" ON "Certificate"("verificationHash");

-- CreateIndex
CREATE INDEX "Certificate_issueDate_idx" ON "Certificate"("issueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_enrollmentId_key" ON "Evaluation"("enrollmentId");

-- CreateIndex
CREATE INDEX "Evaluation_enrollmentId_idx" ON "Evaluation"("enrollmentId");

-- CreateIndex
CREATE INDEX "Evaluation_overallRating_idx" ON "Evaluation"("overallRating");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_notificationType_idx" ON "Notification"("notificationType");

-- CreateIndex
CREATE UNIQUE INDEX "SavedInternship_studentId_internshipId_key" ON "SavedInternship"("studentId", "internshipId");

-- CreateIndex
CREATE INDEX "Announcement_isActive_idx" ON "Announcement"("isActive");

-- CreateIndex
CREATE INDEX "Announcement_targetAudience_idx" ON "Announcement"("targetAudience");

-- CreateIndex
CREATE INDEX "Announcement_priority_idx" ON "Announcement"("priority");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "PasswordReset_email_idx" ON "PasswordReset"("email");

-- CreateIndex
CREATE INDEX "PasswordReset_token_idx" ON "PasswordReset"("token");

-- CreateIndex
CREATE INDEX "EmailVerification_token_idx" ON "EmailVerification"("token");

-- CreateIndex
CREATE INDEX "EmailVerification_userId_idx" ON "EmailVerification"("userId");
