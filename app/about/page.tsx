import Link from 'next/link'

export const metadata = {
  title: 'About — LoveMemory',
  description: 'LoveMemory makes fun, gift-ready portraits of your pet or your people.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite" style={{ fontFamily: 'var(--font-satoshi)' }}>
        About
      </h1>
      <p className="mt-6 text-offwhite/70 leading-relaxed">
        LoveMemory is a simple gift idea: take a photo you already have, dress them in another time, and keep the face you recognise.
      </p>
      <p className="mt-4 text-offwhite/70 leading-relaxed">
        Pets stay looking like your animal. People stay looking like themselves — just a bit more studio-ready. You try it before you buy, then send a download or a print.
      </p>
      <Link href="/#gifts" className="mt-10 inline-flex rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400">
        Try a portrait
      </Link>
    </div>
  )
}
