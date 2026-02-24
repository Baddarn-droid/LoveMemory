'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function TransitionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.85])
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 0.4, 0.4, 0])
  const rotate = useTransform(scrollYProgress, [0, 0.5], [0, 4])

  return (
    <section ref={ref} className="relative flex min-h-[50vh] items-center justify-center px-6 py-20">
      <motion.div
        style={{ scale, opacity, rotate }}
        className="absolute h-64 w-64 rounded-full bg-violet/8 blur-3xl md:h-80 md:w-80"
      />
      <motion.div style={{ opacity }} className="relative z-10 text-center">
        <span className="font-display text-[11px] uppercase tracking-[0.3em] text-offwhite/40" style={{ fontFamily: 'var(--font-satoshi)' }}>
          —
        </span>
      </motion.div>
    </section>
  )
}
