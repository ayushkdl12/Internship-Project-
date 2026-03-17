import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slotId, applicationId } = await req.json();

    const student = await db.student.findUnique({
      where: { userId: parseInt(session.user.id) },
    });
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    // Ensure the application belongs to the student and is for the same organization as the slot
    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: { internship: true }
    });

    if (!application || application.studentId !== student.id) {
      return NextResponse.json({ error: "Invalid application" }, { status: 400 });
    }

    const slot = await db.interviewSlot.findUnique({
      where: { id: slotId }
    });

    if (!slot || slot.isBooked || slot.organizationId !== application.internship.organizationId) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    // Update slot and create interview record
    const result = await db.$transaction(async (tx) => {
      const updatedSlot = await tx.interviewSlot.update({
        where: { id: slotId },
        data: {
          isBooked: true,
          applicationId: applicationId
        }
      });

      const interview = await tx.interview.create({
        data: {
          applicationId: applicationId,
          scheduledDate: slot.startTime,
          scheduledTime: slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "scheduled",
          interviewType: "video", // Default
        }
      });

      // Update application status
      await tx.application.update({
        where: { id: applicationId },
        data: { status: "interview_scheduled" }
      });

      return { updatedSlot, interview };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to book interview" }, { status: 500 });
  }
}
