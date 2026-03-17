import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMatchesForStudent } from "@/lib/ai-matching";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await db.student.findUnique({
      where: { userId: parseInt(session.user.id) },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const matches = await getMatchesForStudent(student.id);

    // Fetch details for these internships
    const internshipIds = matches.map(m => m.internshipId);
    const internships = await db.internship.findMany({
      where: { id: { in: internshipIds } },
      include: {
        organization: {
          select: { companyName: true, logoUrl: true }
        }
      }
    });

    // Merge match score with internship data
    const results = matches.map(match => {
      const internship = internships.find(i => i.id === match.internshipId);
      return {
        ...internship,
        matchScore: match.score,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
