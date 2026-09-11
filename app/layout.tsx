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
  title: 'LoveMemory — Fun photo gifts of your pet or people',
  description:
    'Upload a photo, dress them in another century, keep their face. Try a portrait free — then gift a download, print, or frame.',
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
