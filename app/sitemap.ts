import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://avatarplay.in'
    const currentDate = new Date()

    return [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/browse`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/community`,
            lastModified: currentDate,
            changeFrequency: 'always',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]
}
