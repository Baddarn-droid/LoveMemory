import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, CATEGORY_SLUGS, getAllStyleIdsForCategory, STYLE_GROUPS } from '@/lib/styles'
import { StyleSearch } from '@/components/StyleSearch'
import { StyleGroupRollList } from '@/components/StyleGroupRollList'

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ category: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return { title: 'LoveMemory' }
  return {
    title: `${category.label} — Choose Style — LoveMemory`,
    description: `${category.tagline}. Choose a portrait style.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-4xl px-6 py-24 md:py-32">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-white/40">
          <Link href="/" className="transition-colors hover:text-white/60">Home</Link>
          <span>/</span>
          <span className="text-white/70">{category.label}</span>
        </nav>

        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm text-amber-400/80">From £29.90 · No subscription</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-satoshi)' }}>
            {category.label}
          </h1>
          
          <p className="mt-4 text-lg text-white/60 md:text-xl">
            {category.tagline}
          </p>
          <p className="mt-2 text-sm text-white/40">Pick a style below, upload your photo, and get your portrait in seconds.</p>
        </div>

        {/* Style search */}
        <StyleSearch categorySlug={category.slug} />

        {/* Style roll lists */}
        <div className="mb-8">
          <h2 className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-white/40">
            Choose Your Style
          </h2>
          <StyleGroupRollList categorySlug={category.slug} groups={STYLE_GROUPS} />
        </div>
      </div>
    </div>
  )
}
