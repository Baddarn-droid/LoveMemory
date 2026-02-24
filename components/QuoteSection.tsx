'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function QuoteSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20% 0px', amount: 0.25 })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 0.5], [60, -60])

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center px-6 py-28 md:px-10 lg:px-24"
    >
      <motion.div style={{ y }} className="relative z-10 max-w-3xl text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-2xl font-medium leading-[1.4] text-offwhite md:text-3xl lg:text-4xl"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          “The best portraits aren’t just pictures —
          <br />
          <span className="text-violet/85">they’re the moments you never want to forget.</span>”
        </motion.blockquote>
      </motion.div>
    </section>
  )
}
