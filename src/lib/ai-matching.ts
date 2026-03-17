import { db } from "@/lib/db";

export interface MatchResult {
  internshipId: number;
  score: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * AI Matching Engine
 * Calculates a match score between a student and an internship based on skills overlap.
 * 
 * Logic:
 * 1. Get required skills for internship (with weights).
 * 2. Get student skills (with proficiency levels).
 * 3. Calculate score: (Sum of matched skills weights) / (Sum of all required skills weights)
 * 4. Adjust for proficiency: higher proficiency in a skill = full weight, lower = partial.
 */
export async function calculateMatchScore(studentId: number, internshipId: number): Promise<MatchResult> {
  const internship = await db.internship.findUnique({
    where: { id: internshipId },
    include: {
      internshipSkills: {
        include: { skill: true }
      }
    }
  });

  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      studentSkills: {
        include: { skill: true }
      }
    }
  });

  if (!internship || !student) {
    return { internshipId, score: 0, matchedSkills: [], missingSkills: [] };
  }

  const requiredSkills = internship.internshipSkills;
  const studentSkills = student.studentSkills;

  if (requiredSkills.length === 0) {
    return { internshipId, score: 100, matchedSkills: [], missingSkills: [] };
  }

  let totalWeight = 0;
  let earnedWeight = 0;
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const reqSkill of requiredSkills) {
    const weight = reqSkill.importanceWeight || 1;
    totalWeight += weight;

    const studentSkill = studentSkills.find(s => s.skillId === reqSkill.skillId);

    if (studentSkill) {
      // Adjust weight based on proficiency (beginner: 0.5, intermediate: 0.8, advanced: 1.0)
      let multiplier = 0.8; // default intermediate
      if (studentSkill.proficiencyLevel === "advanced") multiplier = 1.0;
      if (studentSkill.proficiencyLevel === "beginner") multiplier = 0.5;

      earnedWeight += weight * multiplier;
      matchedSkills.push(reqSkill.skill.skillName);
    } else {
      missingSkills.push(reqSkill.skill.skillName);
    }
  }

  const score = Math.round((earnedWeight / totalWeight) * 100);

  return {
    internshipId,
    score: Math.min(score, 100),
    matchedSkills,
    missingSkills
  };
}

/**
 * Get top internship matches for a student
 */
export async function getMatchesForStudent(studentId: number, limit = 5) {
  const publishedInternships = await db.internship.findMany({
    where: { isPublished: true, status: "open" },
    select: { id: true }
  });

  const matches = await Promise.all(
    publishedInternships.map(async (internship) => {
      return calculateMatchScore(studentId, internship.id);
    })
  );

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
