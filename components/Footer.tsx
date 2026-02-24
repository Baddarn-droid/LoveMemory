'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-charcoal px-6 py-16 md:px-10 lg:px-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div>
          <Link
            href="/"
            className="font-display text-base font-medium tracking-[0.2em] text-offwhite transition-opacity hover:opacity-80"
            style={{ fontFamily: 'var(--font-satoshi)' }}
          >
            LoveMemory
          </Link>
          <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-offwhite/50">
            Custom portraits for those you love. Pets, families, kids & friends.
          </p>
        </div>
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div>
            <p className="font-display mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-offwhite/40" style={{ fontFamily: 'var(--font-satoshi)' }}>
              Navigation
            </p>
            <ul className="flex flex-col gap-2">
              <li><Link href="/" className="text-[13px] text-offwhite/60 hover:text-violet">Home</Link></li>
              <li><Link href="/#create" className="text-[13px] text-offwhite/60 hover:text-violet">Create</Link></li>
              <li><Link href="/family" className="text-[13px] text-offwhite/60 hover:text-violet">Family</Link></li>
              <li><Link href="/kids" className="text-[13px] text-offwhite/60 hover:text-violet">Kids</Link></li>
              <li><Link href="/pricing" className="text-[13px] text-offwhite/60 hover:text-violet">Pricing</Link></li>
              <li><Link href="/auth" className="text-[13px] text-offwhite/60 hover:text-violet">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-offwhite/40" style={{ fontFamily: 'var(--font-satoshi)' }}>
              Legal & Support
            </p>
            <ul className="flex flex-col gap-2">
              <li><Link href="/about" className="text-[13px] text-offwhite/60 hover:text-violet">About</Link></li>
              <li><Link href="/support" className="text-[13px] text-offwhite/60 hover:text-violet">Get Support</Link></li>
              <li><Link href="/policies" className="text-[13px] text-offwhite/60 hover:text-violet">Policies</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-12 border-t border-white/[0.04] pt-8 text-center text-[11px] tracking-[0.02em] text-offwhite/40">
        © {new Date().getFullYear()} LoveMemory. Crafted with care.
      </p>
    </footer>
  )
}
