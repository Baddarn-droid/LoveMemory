import Link from 'next/link'

export const metadata = {
  title: 'About — LoveMemory',
  description: 'About LoveMemory and our custom portrait service.',
}

export default function AboutPage() {
  return (
    <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite md:text-5xl">
        About
      </h1>
      <p className="mt-4 max-w-md text-center text-offwhite/70">
        We create custom portraits for pets, families, kids & friends. Quality prints, free shipping.
      </p>
      <Link href="/" className="mt-8 rounded-full border border-violet/40 bg-violet/10 px-6 py-3 text-sm font-medium text-offwhite hover:bg-violet/20">
        Back to home
      </Link>
    </div>
  )
}
