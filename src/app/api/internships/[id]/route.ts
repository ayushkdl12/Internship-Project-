import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const internship = await db.internship.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            industryType: true,
            address: true,
            city: true,
            province: true,
            websiteUrl: true,
            description: true,
          },
        },
        internshipSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    return NextResponse.json(internship);
  } catch (error) {
    console.error("Error fetching internship details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
