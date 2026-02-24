'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  fullScreen?: boolean
  animate?: boolean
}

const defaultVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function Section({
  children,
  className = '',
  id,
  fullScreen = true,
  animate = true,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px', amount: 0.2 })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative ${fullScreen ? 'min-h-screen' : ''} ${className}`}
      initial={animate ? 'hidden' : false}
      animate={animate && isInView ? 'visible' : (animate ? 'hidden' : false)}
      variants={defaultVariants}
    >
      {children}
    </motion.section>
  )
}
