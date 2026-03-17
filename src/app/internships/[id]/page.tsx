import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InternshipDetailClient } from "./internship-detail-client";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const internshipId = parseInt(id);

  if (isNaN(internshipId)) {
    return { title: "Internship Not Found" };
  }

  const internship = await db.internship.findUnique({
    where: { id: internshipId },
    include: { organization: true },
  });

  if (!internship) {
    return { title: "Internship Not Found" };
  }

  return {
    title: `${internship.title} | ${internship.organization.companyName}`,
    description: internship.description.substring(0, 160),
    openGraph: {
      title: `${internship.title} at ${internship.organization.companyName}`,
      description: internship.description,
      type: "article",
    },
  };
}

export default async function InternshipDetailPage({ params }: Props) {
  const { id } = await params;
  const internshipId = parseInt(id);

  if (isNaN(internshipId)) {
    notFound();
  }

  const internship = await db.internship.findUnique({
    where: { id: internshipId },
    include: {
      organization: true,
      internshipSkills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!internship) {
    notFound();
  }

  // Check if student already applied
  let initialApplied = false;
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role === "student") {
    // Find student ID first
    const student = await db.student.findUnique({
      where: { userId: parseInt(session.user.id) }
    });
    
    if (student) {
      const application = await db.application.findUnique({
        where: {
          internshipId_studentId: {
            internshipId: internship.id,
            studentId: student.id,
          },
        },
      });
      initialApplied = !!application;
    }
  }

  // Serialize dates for client component
  const serializedInternship = JSON.parse(JSON.stringify(internship));

  return (
    <InternshipDetailClient 
      internship={serializedInternship} 
      initialApplied={initialApplied} 
    />
  );
}
