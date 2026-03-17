import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      companyName,
      address,
      city,
      province,
      contactPhone,
      contactEmail,
      industryType,
      websiteUrl,
      description,
      companyRegistrationNumber,
      companySize,
      foundedYear,
    } = body;

    // Validate required fields
    if (!email || !password || !companyName || !address || !city || !province || !contactPhone) {
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

    // Check if registration number already exists
    if (companyRegistrationNumber) {
      const existingOrg = await db.organization.findUnique({
        where: { companyRegistrationNumber },
      });
      if (existingOrg) {
        return NextResponse.json(
          { error: "Company registration number is already registered" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and organization in transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: "organization",
          isEmailVerified: false,
          isActive: true,
        },
      });

      // Create organization profile
      const organization = await tx.organization.create({
        data: {
          userId: user.id,
          companyName,
          address,
          city,
          district: city, // Default to city
          province,
          contactPhone,
          contactEmail: contactEmail || email,
          industryType: industryType || null,
          websiteUrl: websiteUrl || null,
          description: description || null,
          companyRegistrationNumber: companyRegistrationNumber || null,
          companySize: companySize || null,
          foundedYear: foundedYear ? parseInt(foundedYear.toString()) : null,
          isVerified: false,
        },
      });

      return { user, organization };
    });

    return NextResponse.json(
      {
        message: "Registration successful. Your account will be verified soon.",
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Organization registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
