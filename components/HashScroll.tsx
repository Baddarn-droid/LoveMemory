'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Next.js client navigations often skip hash scrolling — do it ourselves. */
export function HashScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, '')
      if (!id) return
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [pathname])

  return null
}
