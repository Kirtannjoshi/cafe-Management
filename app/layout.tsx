import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { SettingsProvider } from '@/components/settings-provider'
import { CurrencyProvider } from '@/components/currency-provider'
import { AuthGuard } from '@/components/auth-guard'
import { ThemeToggle } from '@/components/theme-toggle'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cafe Bliss Management',
  description: 'Complete cafe management system for Cafe Bliss',
  generator: 'Cafe Bliss',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SettingsProvider>
            <CurrencyProvider>
              <AuthGuard>
                {children}
                <ThemeToggle />
              </AuthGuard>
            </CurrencyProvider>
          </SettingsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
