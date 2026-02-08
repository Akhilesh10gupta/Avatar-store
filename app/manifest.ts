import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Avatar Play',
        short_name: 'Avatar Play',
        description: 'A premium game distribution platform.',
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#050505',
        orientation: 'portrait',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
