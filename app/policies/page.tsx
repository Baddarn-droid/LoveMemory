import Link from 'next/link'

export const metadata = {
  title: 'Policies — LoveMemory',
  description: 'Terms, privacy, and other policies.',
}

export default function PoliciesPage() {
  return (
    <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite md:text-5xl">
        Policies
      </h1>
      <p className="mt-4 max-w-md text-center text-offwhite/70">
        Terms of service, privacy policy, and shipping & returns.
      </p>
      <Link href="/" className="mt-8 rounded-full border border-violet/40 bg-violet/10 px-6 py-3 text-sm font-medium text-offwhite hover:bg-violet/20">
        Back to home
      </Link>
    </div>
  )
}
