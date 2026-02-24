'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function ClosingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20% 0px', amount: 0.4 })

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-28 md:px-10 md:py-32"
    >
      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-violet"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          Thank you
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl font-medium leading-tight tracking-tight text-offwhite md:text-4xl"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          Every moment you capture
          <br />
          becomes part of your story.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-[14px] leading-relaxed text-offwhite/55"
        >
          LoveMemory — turning the people and moments you love into art you can keep.
        </motion.p>
        <motion.a
          href="#hero"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-violet/25 bg-violet/8 px-7 py-3 text-[13px] font-medium tracking-[0.02em] text-offwhite transition-colors hover:border-violet/35 hover:bg-violet/12"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          Back to top
        </motion.a>
      </div>
    </section>
  )
}
