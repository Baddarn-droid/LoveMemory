'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface StorySectionProps {
  title: string
  subtitle?: string
  body: string
  align?: 'left' | 'center' | 'right'
  index: number
}

export function StorySection({ title, subtitle, body, align = 'center', index }: StorySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px', amount: 0.3 })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yParallax = useTransform(scrollYProgress, [0, 0.4], [48, -32])
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.35, 1, 1, 0.35])

  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align]

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col justify-center px-6 py-28 md:px-10 lg:px-20"
    >
      <motion.div
        style={{ y: yParallax, opacity }}
        className={`relative z-10 flex flex-col ${alignClass}`}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.6 } : {}}
          transition={{ duration: 0.5 }}
          className="font-display mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-violet"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          {String(index).padStart(2, '0')}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="font-display max-w-3xl text-3xl font-medium leading-[1.15] tracking-tight text-offwhite md:text-4xl lg:text-5xl"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-[15px] text-violet/75 md:text-base"
            style={{ fontFamily: 'var(--font-satoshi)' }}
          >
            {subtitle}
          </motion.p>
        )}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18 }}
          className={`mt-6 max-w-xl text-[14px] leading-relaxed text-offwhite/60 md:text-[15px] ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {body}
        </motion.p>
      </motion.div>
    </section>
  )
}
