import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });

    const slots = await db.interviewSlot.findMany({
      where: { 
        organizationId: parseInt(orgId),
        isBooked: false,
        startTime: { gt: new Date() } // Only future slots
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(slots);
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
