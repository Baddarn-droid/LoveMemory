'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#create', label: 'Create' },
  { href: '/', label: 'Pet Portraits' },
  { href: '/family', label: 'Family Portraits' },
  { href: '/kids', label: "Children's Portraits" },
  { href: '/valentine', label: 'Couple Portraits' },
  { href: '/self-portrait', label: 'Self-Portraits' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/auth', label: 'Sign In' },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-charcoal/70 backdrop-blur-sm"
            aria-hidden
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 180 }}
            className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col border-l border-white/[0.06] bg-charcoal/98 backdrop-blur-xl md:w-80"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <span
                className="font-display text-[11px] font-medium uppercase tracking-[0.2em] text-offwhite/50"
                style={{ fontFamily: 'var(--font-satoshi)' }}
              >
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-2 text-offwhite/60 transition-colors hover:bg-white/[0.04] hover:text-offwhite"
                aria-label="Close"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={onClose}
                  className="rounded-md px-3 py-2.5 text-[13px] tracking-[0.02em] text-offwhite/80 transition-colors hover:bg-violet/10 hover:text-offwhite"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/[0.06] px-5 py-4">
              <p className="font-display mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-offwhite/40" style={{ fontFamily: 'var(--font-satoshi)' }}>
                Legal & Support
              </p>
              <div className="flex flex-col gap-1">
                <Link href="/about" className="text-[13px] text-offwhite/65 hover:text-violet">About</Link>
                <Link href="/support" className="text-[13px] text-offwhite/65 hover:text-violet">Get Support</Link>
                <Link href="/policies" className="text-[13px] text-offwhite/65 hover:text-violet">Policies</Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
