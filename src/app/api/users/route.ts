import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get user statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    let stats: any = {};

    if (session.user.role === "student") {
      const student = await db.student.findUnique({
        where: { userId },
      });

      if (student) {
        const [applications, pending, selected, internships] = await Promise.all([
          db.application.count({ where: { studentId: student.id } }),
          db.application.count({
            where: { studentId: student.id, status: "submitted" },
          }),
          db.application.count({
            where: { studentId: student.id, status: "selected" },
          }),
          db.internEnrollment.count({
            where: { studentId: student.id },
          }),
        ]);

        stats = {
          totalApplications: applications,
          pendingApplications: pending,
          selectedCount: selected,
          completedInternships: internships,
          profileComplete: !!(student.program && student.semester && student.phone),
        };
      }
    } else if (session.user.role === "organization") {
      const organization = await db.organization.findUnique({
        where: { userId },
      });

      if (organization) {
        const [internships, applications, selected, activeInterns] = await Promise.all([
          db.internship.count({ where: { organizationId: organization.id } }),
          db.application.count({
            where: {
              internship: { organizationId: organization.id },
            },
          }),
          db.application.count({
            where: {
              internship: { organizationId: organization.id },
              status: "selected",
            },
          }),
          db.internEnrollment.count({
            where: {
              application: {
                internship: { organizationId: organization.id },
              },
              status: "in_progress",
            },
          }),
        ]);

        stats = {
          totalInternships: internships,
          activeInternships: await db.internship.count({
            where: { organizationId: organization.id, status: "open" },
          }),
          totalApplications: applications,
          selectedCandidates: selected,
          activeInterns: activeInterns,
          isVerified: organization.isVerified,
        };
      }
    } else if (session.user.role === "college") {
      const college = await db.college.findUnique({
        where: { userId },
      });

      if (college) {
        const [students, verifiedStudents, applications, placed] = await Promise.all([
          db.student.count({ where: { collegeId: college.id } }),
          db.student.count({
            where: { collegeId: college.id, isVerifiedByCollege: true },
          }),
          db.application.count({
            where: { student: { collegeId: college.id } },
          }),
          db.application.count({
            where: {
              student: { collegeId: college.id },
              status: "selected",
            },
          }),
        ]);

        stats = {
          totalStudents: students,
          verifiedStudents: verifiedStudents,
          totalApplications: applications,
          placedStudents: placed,
          isVerified: college.isVerified,
        };
      }
    } else if (session.user.role === "admin") {
      const [users, students, organizations, colleges, internships, applications] = await Promise.all([
        db.user.count(),
        db.student.count(),
        db.organization.count(),
        db.college.count(),
        db.internship.count(),
        db.application.count(),
      ]);

      stats = {
        totalUsers: users,
        totalStudents: students,
        totalOrganizations: organizations,
        totalColleges: colleges,
        totalInternships: internships,
        totalApplications: applications,
        pendingOrganizations: await db.organization.count({
          where: { isVerified: false },
        }),
        pendingColleges: await db.college.count({ where: { isVerified: false } }),
      };
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
