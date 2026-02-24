'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { CategoryTabs } from './CategoryTabs'

const trustBadges = [
  'Free shipping on prints',
  'Rated 4.8',
  'Trusted by thousands',
]

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 160])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 pb-28 md:px-10 md:pt-32 md:pb-32"
    >
      <a
        href="#create"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded focus:bg-violet focus:px-3 focus:py-2 focus:text-sm focus:text-offwhite"
      >
        Skip to main content
      </a>
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-offwhite/50 md:gap-x-8"
        >
          {trustBadges.map((badge, i) => (
            <span key={badge}>
              {badge}
              {i < trustBadges.length - 1 && <span className="ml-6 hidden text-offwhite/30 md:inline">—</span>}
            </span>
          ))}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[2.75rem] font-medium leading-[1.05] tracking-[0.28em] text-offwhite md:text-6xl lg:text-7xl"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          LoveMemory
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-5 max-w-md text-[15px] leading-relaxed tracking-[0.01em] text-offwhite/55 md:text-base"
        >
          Turn the moments you love into art. Custom portraits for pets, families, and the people who matter most.
        </motion.p>
        <div className="mt-12 w-full max-w-md">
          <CategoryTabs />
        </div>
      </motion.div>
    </section>
  )
}
