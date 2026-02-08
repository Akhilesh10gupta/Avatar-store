import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://avatarplay.in'),
  title: {
    default: "Avatar Play - Premium Game Distribution Platform",
    template: "%s | Avatar Play"
  },
  description: "Your ultimate destination for curated games, avatars, and gaming community. Discover, download, and play the future of gaming today.",
  keywords: ["gaming", "avatar play", "game store", "indie games", "AAA games", "game reviews", "community"],
  authors: [{ name: "Avatar Play Team" }],
  creator: "Avatar Play",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://avatarplay.in",
    title: "Avatar Play - Premium Game Distribution Platform",
    description: "Your ultimate destination for curated games, avatars, and gaming community.",
    siteName: "Avatar Play",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Avatar Play Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avatar Play",
    description: "Your ultimate destination for curated games and avatars.",
    images: ["/logo.png"],
    creator: "@avatarplay",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'AzH2NAZjJGFIpoQRb25deOZhMGR0RRCKiDc4W18mChE',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Avatar Play",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  themeColor: "#050505",
};

import { AuthProvider } from '@/components/AuthProvider'
import { InstallProvider } from '@/components/InstallProvider'

import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import InstallPrompt from '@/components/InstallPrompt'
import XPToast from '@/components/XPToast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-background text-foreground antialiased min-h-screen flex flex-col pb-16 md:pb-0`}>
        {/* ... schema script omitted for brevity ... */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Avatar Play",
              "url": "https://avatarplay.in",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://avatarplay.in/browse?query={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <AuthProvider>
          <InstallProvider>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <BottomNav />
            <InstallPrompt />
            <XPToast />
          </InstallProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
