import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, CATEGORY_SLUGS, STYLE_GROUPS } from '@/lib/styles'
import { StyleGroupRollList } from '@/components/StyleGroupRollList'
import { StyleSearch } from '@/components/StyleSearch'

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ category: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return { title: 'LoveMemory' }
  return {
    title: `${category.label} — LoveMemory`,
    description: category.tagline,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const other =
    category.id === 'pets'
      ? { href: '/family-couple', label: 'people portraits' }
      : { href: '/pets', label: 'pet portraits' }

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
        <nav className="mb-8 flex items-center gap-2 text-sm text-white/40">
          <Link href="/" className="hover:text-white/60">Home</Link>
          <span>/</span>
          <span className="text-white/70">{category.label}</span>
        </nav>

        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-amber-300/80">
            Try free · Gift-ready in seconds
          </p>
          <h1
            className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl"
            style={{ fontFamily: 'var(--font-satoshi)' }}
          >
            {category.label}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">{category.tagline}</p>
          <p className="mt-3 text-sm text-white/40">
            Pick a look, upload a photo, see it before you buy.{' '}
            <Link href={other.href} className="text-amber-300/80 hover:text-amber-200">
              Looking for {other.label}?
            </Link>
          </p>
        </div>

        <StyleSearch categorySlug={category.slug} />
        <StyleGroupRollList categorySlug={category.slug} groups={STYLE_GROUPS} />
      </div>
    </div>
  )
}
