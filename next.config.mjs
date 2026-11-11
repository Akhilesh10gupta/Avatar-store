import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 2592000, // Cache optimized images for 30 days to protect Vercel limits
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/__/auth/:path*',
                destination: 'https://gameweb-4fe8b.firebaseapp.com/__/auth/:path*',
            },
        ];
    },
};

export default withSerwist(nextConfig);
