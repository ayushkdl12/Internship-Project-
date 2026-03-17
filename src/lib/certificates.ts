import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function generateCertificate(enrollmentId: number) {
  const enrollment = await db.intern_enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      student: true,
      application: {
        include: { internship: { include: { organization: true } } }
      }
    }
  });

  if (!enrollment || enrollment.status !== "completed") {
    throw new Error("Enrollment not eligible for certificate");
  }

  // Create or Update certificate
  const certificateNumber = `IN-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
  const verificationHash = nanoid(32);

  const certificate = await db.certificate.upsert({
    where: { enrollmentId },
    update: {
      issueDate: new Date(),
      verificationHash,
    },
    create: {
      enrollmentId,
      certificateNumber,
      verificationHash,
      issueDate: new Date(),
      skillsAcquired: enrollment.application.internship.skillsRequired || "Professional Skills",
      completionStatus: "completed"
    }
  });

  return certificate;
}
