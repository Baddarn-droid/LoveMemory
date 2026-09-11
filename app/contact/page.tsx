import Link from 'next/link'

export const metadata = {
  title: 'Contact — LoveMemory',
  description: 'Email LoveMemory about portraits, orders, and gifts.',
}

const EMAIL = 'adrian.lovememory@gmail.com'

export default function ContactPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite" style={{ fontFamily: 'var(--font-satoshi)' }}>
        Contact
      </h1>
      <p className="mt-4 text-offwhite/70">
        Questions, custom gifts, or something that didn’t look right? Email us — we actually read it.
      </p>
      <a
        href={`mailto:${EMAIL}`}
        className="mt-8 inline-flex w-fit rounded-full border border-amber-500/40 bg-amber-500/10 px-6 py-3 text-lg font-medium text-amber-200 hover:bg-amber-500/20"
      >
        {EMAIL}
      </a>
      <Link href="/" className="mt-10 text-sm text-offwhite/50 hover:text-offwhite/80">
        Back to home
      </Link>
    </div>
  )
}
