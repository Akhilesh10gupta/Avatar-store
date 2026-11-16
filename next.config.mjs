import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true, // Serve images directly from source CDN (Cloudinary), eliminating Vercel image CDN requests
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default withSerwist(nextConfig);
