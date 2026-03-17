import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, phone, program, semester, collegeName, bio, linkedinUrl, portfolioUrl, rollNumber } = body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and student in transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: "student",
          isEmailVerified: false,
          isActive: true,
        },
      });

      // Try to find college by name (if provided)
      let collegeId: number | undefined;
      if (collegeName) {
        const college = await tx.college.findFirst({
          where: {
            collegeName: {
              contains: collegeName,
            },
          },
        });
        if (college) {
          collegeId = college.id;
        }
      }

      // Create student profile
      const student = await tx.student.create({
        data: {
          userId: user.id,
          fullName,
          phone: phone || null,
          program: program || null,
          semester: semester ? parseInt(semester.toString()) : null,
          collegeId: collegeId || null,
          isVerifiedByCollege: false,
          bio: bio || null,
          linkedinUrl: linkedinUrl || null,
          portfolioUrl: portfolioUrl || null,
          rollNumber: rollNumber || null,
        },
      });

      return { user, student };
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
