'use client'

import { Header } from '@/components/Header'

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16">{children}</div>
    </>
  )
}
