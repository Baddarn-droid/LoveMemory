import Link from 'next/link'

const EMAIL = 'adrian.lovememory@gmail.com'

export const metadata = {
  title: 'Support — LoveMemory',
  description: 'Help with a LoveMemory portrait or order.',
}

export default function SupportPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite" style={{ fontFamily: 'var(--font-satoshi)' }}>
        Support
      </h1>
      <p className="mt-4 text-offwhite/70">
        Stuck on an upload, a payment, or a print? Send the order details if you have them.
      </p>
      <a
        href={`mailto:${EMAIL}?subject=LoveMemory%20support`}
        className="mt-8 inline-flex w-fit rounded-full border border-amber-500/40 bg-amber-500/10 px-6 py-3 font-medium text-amber-200 hover:bg-amber-500/20"
      >
        {EMAIL}
      </a>
      <Link href="/" className="mt-10 text-sm text-offwhite/50 hover:text-offwhite/80">
        Back to home
      </Link>
    </div>
  )
}
