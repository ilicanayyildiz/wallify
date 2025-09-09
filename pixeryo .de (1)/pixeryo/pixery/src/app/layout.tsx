import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthProvider } from '@/context/auth-context'
import { Toaster } from '@/components/ui/toaster'
import Script from 'next/script'
import { CookieConsent } from '@/components/cookie-consent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pixeryo - Professionelle Stock-Fotos',
  description: 'Finden und kaufen Sie hochwertige Stock-Bilder für Ihre Projekte',
  icons: {
    icon: '/images/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-9ZXGJJRRZY" 
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9ZXGJJRRZY');
          `}
        </Script>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
            <CookieConsent />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 