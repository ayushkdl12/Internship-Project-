import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await db.user.upsert({
    where: { email: "admin@internshipnepal.gov.np" },
    update: {},
    create: {
      email: "admin@internshipnepal.gov.np",
      passwordHash: adminPassword,
      role: "admin",
      isEmailVerified: true,
      isActive: true,
    },
  });
  console.log("Created admin user:", admin.email);

  // Create sample college
  const collegePassword = await bcrypt.hash("college123", 10);
  const collegeUser = await db.user.upsert({
    where: { email: "registrar@nce.edu.np" },
    update: {},
    create: {
      email: "registrar@nce.edu.np",
      passwordHash: collegePassword,
      role: "college",
      isEmailVerified: true,
      isActive: true,
    },
  });

  const college = await db.college.upsert({
    where: { userId: collegeUser.id },
    update: {},
    create: {
      userId: collegeUser.id,
      collegeName: "National College of Engineering",
      collegeCode: "NCE001",
      address: "Kupondole, Lalitpur",
      city: "Lalitpur",
      district: "Lalitpur",
      province: "Bagmati",
      contactPhone: "01-5550123",
      contactEmail: "info@nce.edu.np",
      websiteUrl: "https://nce.edu.np",
      principalName: "Dr. Ram Bahadur",
      affiliation: "TU",
      establishedYear: 1999,
      isVerified: true,
      verificationDate: new Date(),
    },
  });
  console.log("Created college:", college.collegeName);

  // Create sample organization
  const orgPassword = await bcrypt.hash("org123", 10);
  const orgUser = await db.user.upsert({
    where: { email: "hr@techinnovation.com.np" },
    update: {},
    create: {
      email: "hr@techinnovation.com.np",
      passwordHash: orgPassword,
      role: "organization",
      isEmailVerified: true,
      isActive: true,
    },
  });

  const organization = await db.organization.upsert({
    where: { userId: orgUser.id },
    update: {},
    create: {
      userId: orgUser.id,
      companyName: "Tech Innovation Pvt. Ltd.",
      companyRegistrationNumber: "REG-2020-12345",
      industryType: "Information Technology",
      address: "Thamel, Kathmandu",
      city: "Kathmandu",
      district: "Kathmandu",
      province: "Bagmati",
      contactPhone: "01-4441234",
      contactEmail: "hr@techinnovation.com.np",
      websiteUrl: "https://techinnovation.com.np",
      description: "Leading software development company in Nepal",
      companySize: "51-200",
      foundedYear: 2020,
      isVerified: true,
      verificationDate: new Date(),
    },
  });
  console.log("Created organization:", organization.companyName);

  // Create sample students
  const students = [
    { name: "AAYUSH KANDEL", email: "aayush.kandel@nce.edu.np", roll: "NCE079BCT001" },
    { name: "BISHAL GYAWALI", email: "bishal.gyawali@nce.edu.np", roll: "NCE079BCT009" },
    { name: "JONISH THAPALIYA", email: "jonish.thapaliya@nce.edu.np", roll: "NCE079BCT013" },
    { name: "PRABHAT RAWAL", email: "prabhat.rawal@nce.edu.np", roll: "NCE079BCT022" },
  ];

  for (const studentData of students) {
    const studentPassword = await bcrypt.hash("student123", 10);
    const studentUser = await db.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        email: studentData.email,
        passwordHash: studentPassword,
        role: "student",
        isEmailVerified: true,
        isActive: true,
      },
    });

    await db.student.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        userId: studentUser.id,
        collegeId: college.id,
        fullName: studentData.name,
        rollNumber: studentData.roll,
        program: "Bachelor in Computer Engineering",
        semester: 7,
        batchYear: 2079,
        phone: "9841000000",
        city: "Lalitpur",
        cgpa: 3.5 + Math.random() * 0.5,
        isVerifiedByCollege: true,
        verificationDate: new Date(),
      },
    });
    console.log("Created student:", studentData.name);
  }

  // Create sample skills
  const skills = [
    { name: "Python", category: "Programming" },
    { name: "JavaScript", category: "Programming" },
    { name: "React", category: "Frontend Framework" },
    { name: "Node.js", category: "Backend Framework" },
    { name: "MySQL", category: "Database" },
    { name: "Git", category: "Version Control" },
    { name: "Docker", category: "DevOps" },
    { name: "AWS", category: "Cloud Computing" },
  ];

  for (const skillData of skills) {
    await db.skill.upsert({
      where: { skillName: skillData.name },
      update: {},
      create: {
        skillName: skillData.name,
        category: skillData.category,
      },
    });
  }
  console.log("Created skills");

  // Create mentors
  const mentor = await db.mentor.create({
    data: {
      organizationId: organization.id,
      fullName: "Hari Sharma",
      email: "hari.sharma@techinnovation.com.np",
      phone: "9851000001",
      designation: "Senior Software Engineer",
      department: "Development",
      isActive: true,
    },
  });
  console.log("Created mentor:", mentor.fullName);

  // Create sample internships
  const internship = await db.internship.create({
    data: {
      organizationId: organization.id,
      title: "Software Development Intern",
      description: "Join our development team to work on real-world projects using modern technologies. This internship provides hands-on experience in full-stack development.",
      requirements: "Knowledge of at least one programming language (Python, JavaScript). Basic understanding of web development. Good communication skills.",
      responsibilities: "Assist in developing web applications. Write clean, maintainable code. Participate in code reviews. Document technical specifications.",
      location: "Thamel, Kathmandu",
      city: "Kathmandu",
      district: "Kathmandu",
      province: "Bagmati",
      internshipType: "onsite",
      durationWeeks: 12,
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-05-24"),
      applicationDeadline: new Date("2026-02-15"),
      stipendAmount: 10000,
      stipendType: "stipend",
      positionsAvailable: 3,
      minCgpa: 3.0,
      status: "open",
      isPublished: true,
      publishedAt: new Date(),
    },
  });
  console.log("Created internship:", internship.title);

  // Create another internship
  const internship2 = await db.internship.create({
    data: {
      organizationId: organization.id,
      title: "Data Analyst Intern",
      description: "Work with our data team to analyze business data and create actionable insights for clients.",
      requirements: "Knowledge of Python, SQL. Basic understanding of data analysis. Strong analytical skills.",
      responsibilities: "Analyze business data. Create reports and visualizations. Present findings to stakeholders.",
      location: "Remote",
      city: "Kathmandu",
      district: "Kathmandu",
      province: "Bagmati",
      internshipType: "remote",
      durationWeeks: 8,
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-05-30"),
      applicationDeadline: new Date("2026-03-15"),
      stipendAmount: 8000,
      stipendType: "stipend",
      positionsAvailable: 2,
      minCgpa: 2.8,
      status: "open",
      isPublished: true,
      publishedAt: new Date(),
    },
  });
  console.log("Created internship:", internship2.title);

  // Create announcement
  await db.announcement.create({
    data: {
      title: "Welcome to Internship Provision System",
      content: "This is the official platform for managing internship opportunities in Nepal. Students can discover and apply for internships, while organizations can post opportunities and manage applications.",
      targetAudience: "all",
      priority: "high",
      isActive: true,
      publishedAt: new Date(),
      createdBy: admin.id,
    },
  });
  console.log("Created announcement");

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
