import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://avatarplay.in'),
  title: {
    default: "Avatar Play - Play & Download Viral Indian Meme Games & Desi APKs",
    template: "%s | Avatar Play"
  },
  description: "Play and download the funniest viral Indian meme games for Android & PC! Featuring Sheru Bhai, Flying Thala, Big B's Bouncing Journey, Chappal Run 3D, and more free desi games on Avatar Play.",
  keywords: ["Indian meme games", "viral games", "desi games", "Sheru Bhai", "Flying Thala", "free android games", "free browser games", "Avatar Play"],
  authors: [{ name: "Avatar Play Team" }],
  creator: "Avatar Play",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://avatarplay.in",
    title: "Avatar Play - Play & Download Viral Indian Meme Games & Desi APKs",
    description: "Play and download the funniest viral Indian meme games for Android & PC! Featuring Sheru Bhai, Flying Thala, and more free desi games.",
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
    title: "Avatar Play - Viral Indian Meme Games & Desi APKs",
    description: "Play and download the funniest viral Indian meme games for Android & PC on Avatar Play.",
    images: ["/logo.png"],
    creator: "@avatarplay",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon-192x192.png",
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
  other: {
    "google-adsense-account": "ca-pub-8663470554199300"
  }
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
import CookieConsent from '@/components/CookieConsent'
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8663470554199300"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
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
            <CookieConsent />
          </InstallProvider>
        </AuthProvider>
        {/* Adsterra Social Bar */}
        <Script
          src="https://pl31228341.profitableratecpmnetwork.com/bb/2b/b5/bb2bb5cea8d0ccd183638e0376aece7e.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
