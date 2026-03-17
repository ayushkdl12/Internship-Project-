import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      collegeName,
      collegeCode,
      address,
      city,
      province,
      contactPhone,
      contactEmail,
      principalName,
      affiliation,
      websiteUrl,
      establishedYear,
      description,
    } = body;

    // Validate required fields
    if (!email || !password || !collegeName || !address || !city || !province || !contactPhone) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
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

    // Check if college code already exists
    if (collegeCode) {
      const existingCollege = await db.college.findUnique({
        where: { collegeCode },
      });
      if (existingCollege) {
        return NextResponse.json(
          { error: "College code is already taken" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and college in transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: "college",
          isEmailVerified: false,
          isActive: true,
        },
      });

      // Create college profile
      const college = await tx.college.create({
        data: {
          userId: user.id,
          collegeName,
          collegeCode: collegeCode || null,
          address,
          city,
          district: city, // Default to city
          province,
          contactPhone,
          contactEmail: contactEmail || email,
          principalName: principalName || null,
          affiliation: affiliation || null,
          websiteUrl: websiteUrl || null,
          establishedYear: establishedYear ? parseInt(establishedYear.toString()) : null,
          description: description || null,
          isVerified: false,
        },
      });

      return { user, college };
    });

    return NextResponse.json(
      {
        message: "Registration successful. Your account will be verified by admin.",
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("College registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
