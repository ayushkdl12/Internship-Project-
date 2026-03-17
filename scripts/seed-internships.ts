import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create Skills
  const skillData = [
    { skillName: 'React.js', category: 'Frontend' },
    { skillName: 'Next.js', category: 'Frontend' },
    { skillName: 'TypeScript', category: 'Programming' },
    { skillName: 'Node.js', category: 'Backend' },
    { skillName: 'Python', category: 'Programming' },
    { skillName: 'SQL', category: 'Database' },
    { skillName: 'UI/UX Design', category: 'Design' },
    { skillName: 'Figma', category: 'Design' },
    { skillName: 'Data Analysis', category: 'Data Science' },
    { skillName: 'Marketing', category: 'Business' },
    { skillName: 'Graphic Design', category: 'Design' },
  ]

  const createdSkills = await Promise.all(
    skillData.map(s => 
      prisma.skill.upsert({
        where: { skillName: s.skillName },
        update: {},
        create: s
      })
    )
  )

  // 2. Create Organizations (and their users)
  const orgData = [
    { 
      email: 'hr@techinnovation.com.np', 
      companyName: 'Tech Innovation Pvt. Ltd.',
      industry: 'Technology',
      city: 'Kathmandu',
      district: 'Kathmandu',
      province: 'Bagmati',
      address: 'New Baneshwor',
      phone: '01-4444444',
      website: 'https://techinnovation.com.np',
      desc: 'Leading software solutions provider in Nepal, specializing in ERP and custom web applications.'
    },
    { 
      email: 'info@datainsights.com.np', 
      companyName: 'Data Insights Nepal',
      industry: 'Data Science',
      city: 'Lalitpur',
      district: 'Lalitpur',
      province: 'Bagmati',
      address: 'Kupondole',
      phone: '01-5555555',
      website: 'https://datainsights.com.np',
      desc: 'Empowering businesses with data-driven decision making through advanced analytics and AI.'
    },
    { 
      email: 'hello@creativestudio.com.np', 
      companyName: 'Creative Studio Nepal',
      industry: 'Design',
      city: 'Kathmandu',
      district: 'Kathmandu',
      province: 'Bagmati',
      address: 'Jhamsikhel',
      phone: '01-6666666',
      website: 'https://creativestudio.com.np',
      desc: 'A boutique design agency focusing on branding, UI/UX, and digital storytelling.'
    }
  ]

  for (const org of orgData) {
    const user = await prisma.user.upsert({
      where: { email: org.email },
      update: {},
      create: {
        email: org.email,
        passwordHash,
        role: 'organization',
        isEmailVerified: true,
        isActive: true
      }
    })

    await prisma.organization.upsert({
      where: { userId: user.id },
      update: {
        companyName: org.companyName,
        industryType: org.industry,
        city: org.city,
        district: org.district,
        province: org.province,
        address: org.address,
        contactPhone: org.phone,
        contactEmail: org.email,
        websiteUrl: org.website,
        description: org.desc,
        isVerified: true
      },
      create: {
        userId: user.id,
        companyName: org.companyName,
        industryType: org.industry,
        city: org.city,
        district: org.district,
        province: org.province,
        address: org.address,
        contactPhone: org.phone,
        contactEmail: org.email,
        websiteUrl: org.website,
        description: org.desc,
        isVerified: true
      }
    })
  }

  const techOrg = await prisma.organization.findFirst({ where: { companyName: 'Tech Innovation Pvt. Ltd.' } })
  const dataOrg = await prisma.organization.findFirst({ where: { companyName: 'Data Insights Nepal' } })
  const designOrg = await prisma.organization.findFirst({ where: { companyName: 'Creative Studio Nepal' } })

  // 3. Create Internships
  const internships = [
    {
      organizationId: techOrg!.id,
      title: 'Software Development Intern',
      description: 'Join our dynamic engineering team to build scalable web applications. You will be working on our core ERP product used by hundreds of businesses across Nepal.',
      responsibilities: '- Collaborating with senior developers to design and implement new features\n- Writing clean, maintainable, and efficient code\n- Participating in code reviews and team meetings\n- Troubleshooting and debugging application issues\n- Documenting technical specifications and user guides',
      requirements: 'Currently pursuing a BE in Computer Engineering or CS. Strong understanding of JavaScript and web fundamentals. Passion for building high-quality software.',
      location: 'Kathmandu',
      city: 'Kathmandu',
      district: 'Kathmandu',
      province: 'Bagmati',
      internshipType: 'onsite',
      durationWeeks: 12,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-06-30'),
      applicationDeadline: new Date('2026-03-25'),
      stipendType: 'stipend',
      stipendAmount: 15000,
      positionsAvailable: 3,
      status: 'open',
      isPublished: true,
      skills: ['React.js', 'TypeScript', 'Node.js']
    },
    {
      organizationId: dataOrg!.id,
      title: 'Data Analyst Intern',
      description: 'Help us turn complex data into actionable insights. You will work with large datasets from our retail clients to identify trends and patterns.',
      responsibilities: '- Cleaning and preprocessing raw data for analysis\n- Creating interactive dashboards using Power BI or Tableau\n- Performing exploratory data analysis (EDA) using Python/Pandas\n- Presenting findings to the internal team each week',
      requirements: 'Solid foundation in statistics and Python. Proficiency in SQL. Ability to communicate technical concepts clearly.',
      location: 'Lalitpur',
      city: 'Lalitpur',
      district: 'Lalitpur',
      province: 'Bagmati',
      internshipType: 'hybrid',
      durationWeeks: 10,
      startDate: new Date('2026-04-15'),
      endDate: new Date('2026-06-30'),
      applicationDeadline: new Date('2026-03-30'),
      stipendType: 'paid',
      stipendAmount: 20000,
      positionsAvailable: 2,
      status: 'open',
      isPublished: true,
      skills: ['Python', 'SQL', 'Data Analysis']
    },
    {
      organizationId: designOrg!.id,
      title: 'UI/UX Designer Intern',
      description: 'Design beautiful and intuitive user experiences for our upcoming mobile and web projects. You will be involved from user research to high-fidelity prototyping.',
      responsibilities: '- Assisting in user research and creating personas\n- Designing wireframes and interactive prototypes in Figma\n- Collaborating with developers to ensure design fidelity\n- Maintaining and updating our internal design system',
      requirements: 'A strong portfolio showcasing your design process. Mastery of Figma. Understanding of user-centered design principles.',
      location: 'Kathmandu',
      city: 'Kathmandu',
      district: 'Kathmandu',
      province: 'Bagmati',
      internshipType: 'remote',
      durationWeeks: 8,
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-06-30'),
      applicationDeadline: new Date('2026-04-10'),
      stipendType: 'stipend',
      stipendAmount: 12000,
      positionsAvailable: 2,
      status: 'open',
      isPublished: true,
      skills: ['UI/UX Design', 'Figma']
    }
  ]

  for (const intern of internships) {
    const { skills, ...rest } = intern;
    // Check if exists
    const existing = await prisma.internship.findFirst({
      where: { title: intern.title, organizationId: intern.organizationId }
    })

    if (existing) {
       await prisma.internship.update({
         where: { id: existing.id },
         data: { ...rest, publishedAt: new Date() }
       })
    } else {
      const createdInternship = await prisma.internship.create({
        data: {
          ...rest,
          publishedAt: new Date()
        }
      })

      for (const skillName of skills) {
        const skill = createdSkills.find(s => s.skillName === skillName)
        if (skill) {
          await prisma.internshipSkill.create({
            data: {
              internshipId: createdInternship.id,
              skillId: skill.id,
              isRequired: true
            }
          })
        }
      }
    }
  }

  console.log('Seeded high-quality internships successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
