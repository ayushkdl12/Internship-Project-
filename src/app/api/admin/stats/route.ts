import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Basic Stats
    const [totalStudents, totalOrgs, totalInternships, totalApplications] = await Promise.all([
      db.student.count(),
      db.organization.count(),
      db.internship.count(),
      db.application.count(),
    ]);

    // Placement Stats
    const placedCount = await db.internEnrollment.count({
      where: { status: "enrolled" }
    });
    
    const completedCount = await db.internEnrollment.count({
      where: { status: "completed" }
    });

    // Most popular skills (demand)
    const topSkills = await db.internshipSkill.groupBy({
      by: ['skillId'],
      _count: {
        skillId: true,
      },
      orderBy: {
        _count: {
          skillId: 'desc',
        },
      },
      take: 5,
    });

    const skillDetails = await db.skill.findMany({
      where: { id: { in: topSkills.map(s => s.skillId) } },
      select: { id: true, skillName: true }
    });

    const skillStats = topSkills.map(s => ({
      name: skillDetails.find(sd => sd.id === s.skillId)?.skillName || "Unknown",
      count: s._count.skillId
    }));

    // Applications over time (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    const timeline = await Promise.all(
      last7Days.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        
        const count = await db.application.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        });

        return {
          date: date.toLocaleDateString(undefined, { weekday: 'short' }),
          count
        };
      })
    );

    return NextResponse.json({
      overview: {
        totalStudents,
        totalOrgs,
        totalInternships,
        totalApplications,
        placedCount,
        completedCount
      },
      skills: skillStats,
      timeline
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
