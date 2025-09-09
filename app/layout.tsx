import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wallify - Premium Wallpapers',
  description: 'Discover and download high-quality wallpapers for all your devices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
