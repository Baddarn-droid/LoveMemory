'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'


const trustBadges = [
  'Secure checkout',
  'Free shipping on prints',
]

const categories = [
  { id: 'pets', label: 'Pet Portraits', href: '/pets', emoji: '🐾' },
  { id: 'family', label: 'Family / Couple', href: '/family-couple', emoji: '👨‍👩‍👧‍👦' },
]

const steps = [
  { num: 1, title: 'Choose your style', desc: 'Renaissance, Hollywood, Fantasy & more' },
  { num: 2, title: 'Upload your photo', desc: 'We turn it into art in seconds' },
  { num: 3, title: 'Get your portrait', desc: 'Download, print, or framed — from £29.90' },
]

/** One cat, one family, one dachshund — order shuffled on load */
const HOMEPAGE_ONE_EACH = [
  { src: '/examples/pets-renaissance-1.png', href: '/pets/renaissance', label: 'Pet · Renaissance' },       // cat
  { src: '/examples/family-baroque-royal-2.png', href: '/family-couple/baroque-royal', label: 'Family · Baroque' },
  { src: '/examples/pets-classic-storybook-3.png', href: '/pets/classic-storybook', label: 'Pet · Storybook' }, // dachshund
]

function getHomepageSamples() {
  return [...HOMEPAGE_ONE_EACH].sort(() => Math.random() - 0.5)
}

/** Example image paths for hero background montage (shaded) */
const MONTAGE_IMAGES = [
  '/examples/pets-renaissance-1.png', '/examples/pets-renaissance-2.png', '/examples/pets-baroque-royal-1.png',
  '/examples/family-renaissance-1.png', '/examples/family-baroque-royal-2.png', '/examples/pets-rococo-elegance-2.png',
  '/examples/pets-victorian-era-3.png', '/examples/family-victorian-era-1.png', '/examples/pets-classic-storybook-1.png',
  '/examples/pets-classic-storybook-3.png', '/examples/family-dark-academia-scholar-2.png', '/examples/pets-high-fantasy-kingdom-2.png',
]

export default function Home() {
  const homepageSamples = useMemo(() => getHomepageSamples(), [])
  return (
    <main className="relative flex min-h-screen flex-col bg-charcoal">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 md:py-32">
        {/* Background montage — same width as header (LoveMemory ↔ Contact), shaded */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <div className="absolute inset-y-0 left-1/2 w-full max-w-6xl -translate-x-1/2 px-5 md:px-8">
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-0.5 p-1 opacity-20 md:gap-1 md:p-2" style={{ gridTemplateRows: 'repeat(3, 1fr)' }}>
              {MONTAGE_IMAGES.map((src, i) => (
                <div key={`${src}-${i}`} className="relative min-h-0 overflow-hidden rounded-lg bg-charcoal/40">
                  <Image src={src} alt="" fill className="object-contain" sizes="25vw" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-charcoal/93" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
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
        </div>
      </section>

      {/* Sample portraits from categories */}
      <section className="border-t border-white/5 px-6 py-16 md:py-20">
        <h2 className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-white/40">
          Portrait examples
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {homepageSamples.map((item, i) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
            >
              <Link href={item.href} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <p className="mt-3 text-center text-sm text-white/50 group-hover:text-amber-400/90 transition-colors">
                  {item.label}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
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
            &ldquo;Absolutely love our family portrait. We all look amazing — so much character!&rdquo;
          </p>
          <p className="mt-4 text-sm text-white/40">— Sarah M., London</p>
        </motion.div>
      </section>
    </main>
  )
}
