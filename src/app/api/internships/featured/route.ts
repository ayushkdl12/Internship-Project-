import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const internships = await db.internship.findMany({
      where: {
        isPublished: true,
        status: "open",
      },
      take: 6,
      orderBy: {
        publishedAt: "desc",
      },
      include: {
        organization: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
          },
        },
      },
    });

    return NextResponse.json(internships);
  } catch (error) {
    console.error("Error fetching featured internships:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
