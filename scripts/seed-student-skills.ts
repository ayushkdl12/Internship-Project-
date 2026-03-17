import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const studentEmail = 'student@demo.com'
  
  const user = await prisma.user.findUnique({
    where: { email: studentEmail },
    include: { student: true }
  })

  if (!user || !user.student) {
    console.log('Demo student not found')
    return
  }

  const studentId = user.student.id

  // Skills to add
  const skillNames = ['React.js', 'TypeScript', 'Node.js', 'Python', 'SQL']
  
  const skills = await prisma.skill.findMany({
    where: { skillName: { in: skillNames } }
  })

  for (const skill of skills) {
    // Determine proficiency
    let proficiency = 'intermediate'
    if (skill.skillName === 'React.js' || skill.skillName === 'TypeScript') proficiency = 'advanced'
    if (skill.skillName === 'Python') proficiency = 'beginner'

    await prisma.studentSkill.upsert({
      where: {
        studentId_skillId: {
          studentId,
          skillId: skill.id
        }
      },
      update: { proficiencyLevel: proficiency },
      create: {
        studentId,
        skillId: skill.id,
        proficiencyLevel: proficiency
      }
    })
  }

  console.log(`Seeded skills for student: ${studentEmail}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
