'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExampleFramed } from '@/components/ExampleFramed'
import { GalleryWall } from '@/components/ProdigiClassicFrame'
import { frameColourForIndex } from '@/lib/frameCatalog'

const GIFT_PATHS = [
  {
    href: '/pets',
    kicker: 'For dog & cat people',
    title: 'Pet portraits',
    body: 'Upload a snap. Dress them as royalty, a storybook hero, or a Victorian gentleman. Same face, same markings — just a gift they’ll actually keep.',
    cta: 'Try a pet portrait',
    image: '/examples/pets-renaissance-1.png?v=lying-all-1',
  },
  {
    href: '/family-couple',
    kicker: 'For you, a couple, or the family',
    title: 'People portraits',
    body: 'Still clearly you — just a better-lit, gift-ready version in period clothes. Fun to try, easy to send as a print or a download.',
    cta: 'Try a people portrait',
    image: '/examples/family-baroque-royal-2.png?v=people-wide-1',
  },
]

const STEPS = [
  { num: '01', title: 'Pick a look', desc: 'Renaissance, Victorian, storybook, fantasy — clothes and backdrop change. Faces stay theirs.' },
  { num: '02', title: 'Drop in a photo', desc: 'Phone camera is fine. Clear, well-lit, face toward the camera works best.' },
  { num: '03', title: 'Peek before you pay', desc: 'See it framed. Keep a download or a classic print — only if you love it.' },
]

const SAMPLES = [
  { src: '/examples/pets-renaissance-1.png?v=lying-all-1', href: '/pets/renaissance', label: 'Cat · Renaissance' },
  { src: '/examples/family-baroque-royal-2.png?v=people-wide-1', href: '/family-couple/baroque-royal', label: 'Family · Baroque Royal' },
  { src: '/examples/pets-classic-storybook-3.png?v=lying-all-1', href: '/pets/classic-storybook', label: 'Dachshund · Storybook' },
  { src: '/examples/family-victorian-era-1.png?v=people-wide-1', href: '/family-couple/victorian-era', label: 'Family · Victorian' },
  { src: '/examples/pets-high-fantasy-kingdom-2.png?v=lying-all-1', href: '/pets/high-fantasy-kingdom', label: 'Horse · Fantasy' },
  { src: '/examples/family-dark-academia-scholar-3.png?v=people-wide-1', href: '/family-couple/dark-academia-scholar', label: 'People · Dark Academia' },
]

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-charcoal">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-80"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245, 158, 11, 0.1), transparent 55%)' }}
        aria-hidden
      />

      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-12 pt-20 text-center md:pb-16 md:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-amber-200"
        >
          Try it free · Pay only if you keep it
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-6xl"
          style={{ fontFamily: 'var(--font-satoshi)' }}
        >
          The fun photo gift for the people — and pets — you love
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
        >
          Dress them in another century, keep their face. Thirty seconds, one upload, a portrait you’d actually wrap.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/pets"
            className="inline-flex items-center rounded-full bg-amber-500 px-7 py-3.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
          >
            Start with a pet
          </Link>
          <Link
            href="/family-couple"
            className="inline-flex items-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white/85 transition hover:border-white/30 hover:bg-white/[0.04]"
          >
            Start with a portrait
          </Link>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <GalleryWall className="rounded-[2rem] px-5 py-10 sm:px-10 sm:py-14">
          <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-amber-200/70">
            Classic frames · eight colours
          </p>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-8">
            {SAMPLES.map((item, i) => (
              <Link key={item.src} href={item.href} className="group block">
                <ExampleFramed
                  src={item.src}
                  alt={item.label}
                  colour={frameColourForIndex(i)}
                  sizes="(max-width: 640px) 50vw, 30vw"
                />
                <p className="mt-3 text-center text-xs tracking-wide text-white/50 transition group-hover:text-amber-200">
                  {item.label}
                </p>
              </Link>
            ))}
          </div>
        </GalleryWall>
      </section>

      <section id="gifts" className="relative mx-auto max-w-5xl scroll-mt-24 px-6 pb-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          {GIFT_PATHS.map((path, i) => (
            <motion.div
              key={path.href}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.08 }}
            >
              <Link href={path.href} className="group block">
                <GalleryWall className="rounded-2xl px-8 py-10 sm:px-12">
                  <div className="mx-auto max-w-[280px]">
                    <ExampleFramed
                      src={path.image}
                      alt=""
                      colour={frameColourForIndex(i)}
                      sizes="(max-width: 768px) 80vw, 280px"
                    />
                  </div>
                </GalleryWall>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-amber-300/80">{path.kicker}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-satoshi)' }}>
                  {path.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{path.body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
                  {path.cta}
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 border-t border-white/[0.06] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/40">How it works</p>
          <h2
            className="mt-3 text-center font-display text-3xl font-semibold text-white md:text-4xl"
            style={{ fontFamily: 'var(--font-satoshi)' }}
          >
            Tempted? It’s three steps.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className="border-t border-white/10 pt-6">
                <span className="font-display text-sm font-semibold tracking-[0.18em] text-amber-400/90">{step.num}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-lg italic leading-relaxed text-white/55 md:text-xl">
            “I sent my sister her spaniel as a Victorian duchess. She printed it the same night.”
          </p>
          <p className="mt-4 text-sm text-white/35">That’s the idea — a five-minute gift that doesn’t look like one.</p>
          <Link
            href="/pets"
            className="mt-8 inline-flex rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-amber-400"
          >
            Make one now
          </Link>
        </div>
      </section>
    </main>
  )
}
