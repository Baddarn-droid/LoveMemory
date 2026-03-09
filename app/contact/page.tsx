import Link from 'next/link'

export const metadata = {
  title: 'Contact — LoveMemory',
  description: 'Get in touch with LoveMemory. Email us for custom portraits and support.',
}

const EMAIL = 'love.memory@gmail.com'

export default function ContactPage() {
  return (
    <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite md:text-5xl">
        Contact
      </h1>
      <p className="mt-4 max-w-md text-center text-offwhite/70">
        Questions, custom orders, or feedback? We’d love to hear from you.
      </p>
      <a
        href={`mailto:${EMAIL}`}
        className="mt-8 rounded-full border border-amber-500/40 bg-amber-500/10 px-6 py-3 text-lg font-medium text-amber-200 hover:bg-amber-500/20 transition-colors"
      >
        {EMAIL}
      </a>
      <Link href="/" className="mt-10 text-sm text-offwhite/50 hover:text-offwhite/80">
        Back to home
      </Link>
    </div>
  )
}
