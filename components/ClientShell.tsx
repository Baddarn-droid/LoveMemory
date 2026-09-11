'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HashScroll } from '@/components/HashScroll'

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HashScroll />
      <Header />
      <div className="min-h-screen pt-16">{children}</div>
      <Footer />
    </>
  )
}
