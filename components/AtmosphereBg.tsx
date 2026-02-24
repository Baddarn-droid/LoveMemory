'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export function AtmosphereBg() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0.5, 0.15])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 1.15])
  const opacityMid = useTransform(scrollYProgress, [0.15, 0.5], [0, 0.35])
  const opacityWarm = useTransform(scrollYProgress, [0.35, 0.7], [0, 0.25])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(107,91,212,0.14)_0%,transparent_55%)]"
      />
      <motion.div
        style={{ opacity: opacityMid }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_35%_at_75%_55%,rgba(107,91,212,0.06)_0%,transparent_50%)]"
      />
      <motion.div
        style={{ opacity: opacityWarm }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_45%_28%_at_25%_75%,rgba(180,160,220,0.05)_0%,transparent_50%)]"
      />
    </div>
  )
}
