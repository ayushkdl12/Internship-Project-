import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const studentPasswordHash = await bcrypt.hash('demo123', 10)

  // Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@internshipnepal.gov.np' },
    update: {},
    create: {
      email: 'admin@internshipnepal.gov.np',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
    },
  })

  // Create Student Demo
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email: 'student@demo.com',
      passwordHash: studentPasswordHash,
      role: 'student',
      isEmailVerified: true,
      isActive: true,
    },
  })

  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      fullName: 'Demo Student',
      phone: '9800000000',
      program: 'BSCS',
      semester: 8,
      isVerifiedByCollege: true,
    },
  })

  console.log('Demo users created/updated successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
