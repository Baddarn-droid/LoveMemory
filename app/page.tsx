'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const trustBadges = [
  'Secure checkout',
  'Satisfaction guaranteed',
  'Free shipping on prints',
]

const categories = [
  { id: 'pets', label: 'Pets', href: '/pets', emoji: '🐾' },
  { id: 'family', label: 'Family', href: '/family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'kids', label: 'Kids', href: '/kids', emoji: '👧' },
  { id: 'couples', label: 'Couples', href: '/couples', emoji: '💑' },
  { id: 'self', label: 'Self', href: '/self', emoji: '✨' },
]

const steps = [
  { num: 1, title: 'Choose your style', desc: 'Renaissance, Hollywood, Fantasy & more' },
  { num: 2, title: 'Upload your photo', desc: 'We turn it into art in seconds' },
  { num: 3, title: 'Get your portrait', desc: 'Download, print, or framed — from £29.90' },
]

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-charcoal">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-sm text-amber-300"
        >
          <span>From £29.90</span>
          <span className="text-white/40">·</span>
          <span>Try before you buy</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display max-w-3xl text-center text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          Turn your favourite photos into{' '}
          <span className="text-amber-400">art</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-xl text-center text-lg text-white/60 md:text-xl"
        >
          Custom AI portraits for pets, families, and the people you love. Choose a style, upload a photo, and get your portrait in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-base font-semibold text-black shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 hover:shadow-amber-500/30"
          >
            Create Your Portrait
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/45"
        >
          {trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-amber-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {badge}
            </span>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 px-6 py-16 md:py-24">
        <h2 className="mb-12 text-center text-sm font-medium uppercase tracking-widest text-white/40">
          How it works
        </h2>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3 md:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-lg font-bold text-amber-400">
                {step.num}
              </div>
              <h3 className="font-display text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-satoshi)' }}>
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-white/50">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-white/5 px-6 py-16 md:py-24">
        <h2 className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-white/40">
          Choose your portrait type
        </h2>
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 + i * 0.05 }}
            >
              <Link
                href={cat.href}
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-base font-medium text-white/90 transition-all hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-white"
              >
                <span className="text-xl">{cat.emoji}</span>
                {cat.label}
                <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="border-t border-white/5 px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-lg italic text-white/50 md:text-xl">
            &ldquo;Absolutely love our family portrait. The kids are unrecognisable in the best way — so much character!&rdquo;
          </p>
          <p className="mt-4 text-sm text-white/40">— Sarah M., London</p>
        </motion.div>
      </section>
    </main>
  )
}
