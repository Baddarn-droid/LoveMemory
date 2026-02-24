import Link from 'next/link'

export const metadata = {
  title: 'Get Support — LoveMemory',
  description: 'Get help with your LoveMemory order or account.',
}

export default function SupportPage() {
  return (
    <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite md:text-5xl">
        Get Support
      </h1>
      <p className="mt-4 max-w-md text-center text-offwhite/70">
        Need help? Reach out and we&apos;ll get back to you as soon as we can.
      </p>
      <Link href="/" className="mt-8 rounded-full border border-violet/40 bg-violet/10 px-6 py-3 text-sm font-medium text-offwhite hover:bg-violet/20">
        Back to home
      </Link>
    </div>
  )
}
