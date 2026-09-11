import Link from 'next/link'

export const metadata = {
  title: 'Account — LoveMemory',
  description: 'LoveMemory accounts are not open yet.',
}

export default function AuthPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite" style={{ fontFamily: 'var(--font-satoshi)' }}>
        Accounts
      </h1>
      <p className="mt-4 text-offwhite/70">
        Saved portraits and order history aren’t live yet. For now, keep your generated file and checkout email.
      </p>
      <Link href="/#gifts" className="mt-8 inline-flex w-fit rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400">
        Create a portrait instead
      </Link>
    </div>
  )
}
