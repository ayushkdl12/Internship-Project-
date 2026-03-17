import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - List applications (for student or organization)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const internshipId = searchParams.get("internshipId") || "";

    let applications;

    if (session.user.role === "student") {
      // Get student's applications
      const student = await db.student.findUnique({
        where: { userId: parseInt(session.user.id) },
      });

      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }

      const where: any = { studentId: student.id };
      if (status) where.status = status;
      if (internshipId) where.internshipId = parseInt(internshipId);

      applications = await db.application.findMany({
        where,
        include: {
          internship: {
            include: {
              organization: {
                select: {
                  id: true,
                  companyName: true,
                  logoUrl: true,
                },
              },
            },
          },
          interviews: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (session.user.role === "organization") {
      // Get applications for organization's internships
      const organization = await db.organization.findUnique({
        where: { userId: parseInt(session.user.id) },
      });

      if (!organization) {
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
      }

      const where: any = {
        internship: { organizationId: organization.id },
      };
      if (status) where.status = status;
      if (internshipId) where.internshipId = parseInt(internshipId);

      applications = await db.application.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              program: true,
              semester: true,
              cgpa: true,
              college: {
                select: {
                  collegeName: true,
                },
              },
            },
          },
          internship: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST - Submit application (for students)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "student") {
      return NextResponse.json(
        { error: "Unauthorized. Only students can apply." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { internshipId, coverLetter, resumeUrl } = body;

    if (!internshipId) {
      return NextResponse.json(
        { error: "Internship ID is required" },
        { status: 400 }
      );
    }

    // Get student
    const student = await db.student.findUnique({
      where: { userId: parseInt(session.user.id) },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Check if internship exists and is open
    const internship = await db.internship.findUnique({
      where: { id: parseInt(internshipId) },
    });

    if (!internship || internship.status !== "open" || !internship.isPublished) {
      return NextResponse.json(
        { error: "Internship not available for applications" },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = await db.application.findUnique({
      where: {
        internshipId_studentId: {
          internshipId: parseInt(internshipId),
          studentId: student.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this internship" },
        { status: 400 }
      );
    }

    // Create application
    const application = await db.application.create({
      data: {
        internshipId: parseInt(internshipId),
        studentId: student.id,
        coverLetter: coverLetter || null,
        resumeUrl: resumeUrl || null,
        status: "submitted",
        submittedAt: new Date(),
      },
    });

    // Create notification for organization
    const orgUser = await db.user.findFirst({
      where: {
        organization: { id: internship.organizationId },
      },
    });

    if (orgUser) {
      await db.notification.create({
        data: {
          userId: orgUser.id,
          title: "New Application Received",
          message: `A new application has been submitted for ${internship.title}`,
          notificationType: "application",
          referenceType: "application",
          referenceId: application.id,
        },
      });
    }

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// PATCH - Update application status (for organizations)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "organization") {
      return NextResponse.json(
        { error: "Unauthorized. Only organizations can update application status." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { applicationId, status, feedback } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400 }
      );
    }

    // Get organization
    const organization = await db.organization.findUnique({
      where: { userId: parseInt(session.user.id) },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Verify application belongs to organization's internship
    const application = await db.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: { internship: true },
    });

    if (!application || application.internship.organizationId !== organization.id) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Update application
    const updatedApplication = await db.application.update({
      where: { id: parseInt(applicationId) },
      data: {
        status,
        feedback: feedback || null,
        reviewedAt: new Date(),
      },
    });

    // Create notification for student
    const studentUser = await db.user.findFirst({
      where: {
        student: { id: application.studentId },
      },
    });

    if (studentUser) {
      const statusMessages: Record<string, string> = {
        shortlisted: "Your application has been shortlisted!",
        rejected: "Your application status has been updated.",
        selected: "Congratulations! You have been selected.",
        interview_scheduled: "An interview has been scheduled for you.",
      };

      await db.notification.create({
        data: {
          userId: studentUser.id,
          title: "Application Update",
          message: statusMessages[status] || `Your application status is now ${status}`,
          notificationType: status === "selected" ? "selection" : "application",
          referenceType: "application",
          referenceId: application.id,
        },
      });
    }

    return NextResponse.json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
