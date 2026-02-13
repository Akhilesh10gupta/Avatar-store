import { MetadataRoute } from 'next'
import { getGamesAdmin } from '@/lib/firestore-admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://avatarplay.in'
    const currentDate = new Date()

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/browse',
        '/top-rated',
        '/new-arrivals',
        '/developer',
        '/community',
        '/about',
        '/contact',
        '/help-center',
        '/login',
        '/signup',
        '/legal/terms',
        '/legal/privacy',
        '/legal/cookies',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // 2. Dynamic Game Routes
    let gameRoutes: MetadataRoute.Sitemap = []
    try {
        const games = await getGamesAdmin()
        gameRoutes = games.map((game) => ({
            url: `${baseUrl}/game/${game.id}`,
            lastModified: game.updatedAt ? new Date(game.updatedAt) : currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))
    } catch (error) {
        console.error('Error generating sitemap for games:', error)
    }

    return [...staticRoutes, ...gameRoutes]
}
