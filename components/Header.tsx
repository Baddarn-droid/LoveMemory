'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pets', label: 'Pets' },
  { href: '/family-couple', label: 'Family / Couple' },
  { href: '/contact', label: 'Contact' },
]

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-5 items-center justify-center">
      <span className={`absolute h-px w-4 bg-current transition-transform ${open ? 'translate-y-0 rotate-45' : '-translate-y-1.5'}`} />
      <span className={`absolute h-px w-4 bg-current transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`} />
      <span className={`absolute h-px w-4 bg-current transition-transform ${open ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'}`} />
    </span>
  )
}

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href === '/contact') return pathname === '/contact'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-charcoal/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-18 md:px-8">
        <Link
          href="/"
          className="font-display text-[15px] font-medium tracking-[0.22em] text-offwhite transition-opacity hover:opacity-80"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          LoveMemory
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex lg:gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`relative rounded-md px-3.5 py-2.5 text-[13px] tracking-[0.02em] transition-colors ${
                  active ? 'text-amber-400' : 'text-offwhite/75 hover:bg-white/[0.04] hover:text-offwhite'
                } ${active && link.href !== '/' && link.href !== '/contact' ? 'border-b-2 border-amber-500' : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMobileNavOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          aria-label="Menu"
        >
          <MenuIcon open={mobileNavOpen} />
        </button>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col border-t border-white/[0.06] bg-charcoal/98 md:hidden"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-2 border-b border-white/[0.04] px-5 py-4 text-[14px] tracking-[0.02em] ${
                    active ? 'text-amber-400' : 'text-offwhite/85'
                  }`}
                >
                  {link.label}
                  {active && link.href !== '/' && link.href !== '/contact' && (
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                  )}
                </Link>
              )
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
