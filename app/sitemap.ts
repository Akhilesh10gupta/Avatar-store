import { MetadataRoute } from 'next'
import { getGamesAdmin } from '@/lib/firestore-admin'
import { getBlogPostsAdmin } from '@/lib/firestore-blog'

// Cache sitemap for 24 hours to prevent search engine bots from burning Firestore reads
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://avatarplay.in'
    const currentDate = new Date()

    // 1. Core High-Value Static Routes
    const coreRoutes = [
        { route: '', priority: 1.0, freq: 'daily' as const },
        { route: '/3d-action', priority: 0.9, freq: 'daily' as const },
        { route: '/browse', priority: 0.9, freq: 'daily' as const },
        { route: '/top-rated', priority: 0.8, freq: 'weekly' as const },
        { route: '/new-arrivals', priority: 0.8, freq: 'weekly' as const },
        { route: '/blog', priority: 0.8, freq: 'daily' as const },
        { route: '/community', priority: 0.7, freq: 'daily' as const },
        { route: '/about', priority: 0.5, freq: 'monthly' as const },
        { route: '/contact', priority: 0.5, freq: 'monthly' as const },
        { route: '/developer', priority: 0.5, freq: 'monthly' as const },
        { route: '/help-center', priority: 0.4, freq: 'monthly' as const },
        { route: '/legal/terms', priority: 0.3, freq: 'yearly' as const },
        { route: '/legal/privacy', priority: 0.3, freq: 'yearly' as const },
        { route: '/legal/cookies', priority: 0.3, freq: 'yearly' as const },
        { route: '/legal/disclaimer', priority: 0.3, freq: 'yearly' as const },
    ].map(({ route, priority, freq }) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: freq,
        priority,
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

    // 3. Dynamic Blog Routes
    let blogRoutes: MetadataRoute.Sitemap = []
    try {
        const posts = await getBlogPostsAdmin()
        blogRoutes = posts.map((post) => {
            const postDate = post.createdAt ? new Date(post.createdAt) : (post.date ? new Date(post.date) : currentDate);
            return {
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: postDate,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        })
    } catch (error) {
        console.error('Error generating sitemap for blogs:', error)
    }

    return [...coreRoutes, ...gameRoutes, ...blogRoutes]
}
