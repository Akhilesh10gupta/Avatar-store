import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Avatar Store",
  description: "Your ultimate destination for games",
}

import { AuthProvider } from '@/components/AuthProvider'

import Footer from '@/components/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
