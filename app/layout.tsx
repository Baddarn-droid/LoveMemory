import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientShell } from '@/components/ClientShell'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LoveMemory — Custom Portraits for Those You Love',
  description: 'Turn your favourite moments into art. Custom portraits for pets, families, kids & friends. Upload, preview, order. Free shipping on prints.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-body antialiased bg-charcoal text-offwhite`}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
