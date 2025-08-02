import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import Header from '@/components/Header'
import Header from './components/Header'
import { ThemeProvider } from './components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'A11yCheck - Web Accessibility Scanner',
  description: 'Analyze and improve your website accessibility with comprehensive WCAG compliance checking',
  keywords: ['accessibility', 'a11y', 'WCAG', 'compliance', 'scanner', 'audit'],
  authors: [{ name: 'A11yCheck Team' }],
  creator: 'A11yCheck',
  publisher: 'A11yCheck',
  robots: 'index, follow',
  openGraph: {
    title: 'A11yCheck - Web Accessibility Scanner',
    description: 'Analyze and improve your website accessibility with comprehensive WCAG compliance checking',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A11yCheck - Web Accessibility Scanner',
    description: 'Analyze and improve your website accessibility with comprehensive WCAG compliance checking',
  },
}

// ✅ Move viewport out of metadata
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
              {children}
            </main>
            <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-6">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">A11y</span>
                    <span>© 2024 A11yCheck. Making the web accessible for everyone.</span>
                  </div>
                  <div className="flex space-x-6">
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                      Privacy Policy
                    </a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                      Terms of Service
                    </a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                      WCAG Guidelines
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}