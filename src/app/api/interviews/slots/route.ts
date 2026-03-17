import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role === "organization") {
      const org = await db.organization.findUnique({
        where: { userId: parseInt(session.user.id) },
      });
      if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

      const slots = await db.interviewSlot.findMany({
        where: { organizationId: org.id },
        orderBy: { startTime: "asc" },
      });
      return NextResponse.json(slots);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "organization") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const org = await db.organization.findUnique({
      where: { userId: parseInt(session.user.id) },
    });
    if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

    const { startTime, endTime } = await req.json();

    const slot = await db.interviewSlot.create({
      data: {
        organizationId: org.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(slot);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create slot" }, { status: 500 });
  }
}
