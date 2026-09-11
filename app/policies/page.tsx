import Link from 'next/link'

export const metadata = {
  title: 'Policies — LoveMemory',
  description: 'How LoveMemory handles previews, payments, and prints.',
}

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite" style={{ fontFamily: 'var(--font-satoshi)' }}>
        Policies
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-offwhite/70">
        <p>
          <strong className="text-offwhite">Try before you buy.</strong> Previews are free and watermarked. You pay only if you choose a download, print, or framed piece.
        </p>
        <p>
          <strong className="text-offwhite">Photos you upload.</strong> We use them to generate your portrait. Don’t upload photos you don’t have the right to use.
        </p>
        <p>
          <strong className="text-offwhite">Prints.</strong> Shipping times and prices are shown as TBD until we lock them. We’ll confirm before you pay.
        </p>
        <p>
          <strong className="text-offwhite">Contact.</strong> For anything else, email adrian.lovememory@gmail.com.
        </p>
      </div>
      <Link href="/" className="mt-10 inline-block text-sm text-offwhite/50 hover:text-offwhite/80">
        Back to home
      </Link>
    </div>
  )
}
