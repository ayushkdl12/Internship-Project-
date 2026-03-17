import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - List internships
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const type = searchParams.get("type") || "";
    const stipendType = searchParams.get("stipendType") || "";
    const organizationId = searchParams.get("organizationId") || "";

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {
      isPublished: true,
      status: "open",
      applicationDeadline: { gte: new Date() },
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (city) {
      where.city = { contains: city };
    }

    if (type) {
      where.internshipType = type;
    }

    if (stipendType) {
      where.stipendType = stipendType;
    }

    if (organizationId) {
      where.organizationId = parseInt(organizationId);
    }

    const [internships, total] = await Promise.all([
      db.internship.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              companyName: true,
              logoUrl: true,
              industryType: true,
            },
          },
          internshipSkills: {
            include: {
              skill: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.internship.count({ where }),
    ]);

    return NextResponse.json({
      internships,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching internships:", error);
    return NextResponse.json(
      { error: "Failed to fetch internships" },
      { status: 500 }
    );
  }
}

// POST - Create internship (for organizations)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "organization") {
      return NextResponse.json(
        { error: "Unauthorized. Only organizations can post internships." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      requirements,
      responsibilities,
      location,
      city,
      district,
      province,
      internshipType,
      durationWeeks,
      startDate,
      endDate,
      applicationDeadline,
      stipendAmount,
      stipendType,
      positionsAvailable,
      minCgpa,
      skillsRequired,
    } = body;

    // Validate required fields
    if (!title || !description || !location || !city || !durationWeeks || !startDate || !endDate || !applicationDeadline) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Get organization ID
    const organization = await db.organization.findUnique({
      where: { userId: parseInt(session.user.id) },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization profile not found" },
        { status: 404 }
      );
    }

    // Create internship
    const internship = await db.internship.create({
      data: {
        organizationId: organization.id,
        title,
        description,
        requirements: requirements || null,
        responsibilities: responsibilities || null,
        location,
        city,
        district: district || city,
        province: province || "Bagmati",
        internshipType: internshipType || "onsite",
        durationWeeks: parseInt(durationWeeks),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        applicationDeadline: new Date(applicationDeadline),
        stipendAmount: stipendAmount ? parseFloat(stipendAmount) : null,
        stipendType: stipendType || "unpaid",
        positionsAvailable: parseInt(positionsAvailable) || 1,
        minCgpa: minCgpa ? parseFloat(minCgpa) : null,
        skillsRequired: skillsRequired || null,
        status: "draft",
        isPublished: false,
      },
    });

    return NextResponse.json(
      { message: "Internship created successfully", internship },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating internship:", error);
    return NextResponse.json(
      { error: "Failed to create internship" },
      { status: 500 }
    );
  }
}
