import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const internships = await db.internship.findMany({
    where: { isPublished: true },
    select: { id: true, updatedAt: true }
  })

  const internshipUrls = internships.map((item) => ({
    url: `https://internship-nepal.com/internships/${item.id}`,
    lastModified: item.updatedAt,
  }))

  return [
    {
      url: 'https://internship-nepal.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://internship-nepal.com/internships',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...internshipUrls,
  ]
}
