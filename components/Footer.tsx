import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-charcoal px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 md:flex-row md:justify-between">
        <div>
          <Link
            href="/"
            className="font-display text-base font-medium tracking-[0.2em] text-offwhite"
            style={{ fontFamily: 'var(--font-satoshi)' }}
          >
            LoveMemory
          </Link>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-offwhite/50">
            Fun, gift-ready portraits of your pet or your people. Try a photo first — keep it if you love it.
          </p>
        </div>
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-offwhite/40">Create</p>
            <ul className="flex flex-col gap-2 text-[13px]">
              <li><Link href="/pets" className="text-offwhite/60 hover:text-offwhite">Pet portraits</Link></li>
              <li><Link href="/family-couple" className="text-offwhite/60 hover:text-offwhite">Family &amp; you</Link></li>
              <li><a href="/#how-it-works" className="text-offwhite/60 hover:text-offwhite">How it works</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-offwhite/40">Help</p>
            <ul className="flex flex-col gap-2 text-[13px]">
              <li><Link href="/about" className="text-offwhite/60 hover:text-offwhite">About</Link></li>
              <li><Link href="/contact" className="text-offwhite/60 hover:text-offwhite">Contact</Link></li>
              <li><Link href="/support" className="text-offwhite/60 hover:text-offwhite">Support</Link></li>
              <li><Link href="/policies" className="text-offwhite/60 hover:text-offwhite">Policies</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-5xl border-t border-white/[0.04] pt-8 text-center text-[11px] text-offwhite/40">
        © {new Date().getFullYear()} LoveMemory. Made for gifts that get a laugh — then stay on the wall.
      </p>
    </footer>
  )
}
