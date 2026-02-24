import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryBySlug, getStylePreset, getStyleTagline, CATEGORY_SLUGS, getAllStyleIdsForCategory } from '@/lib/styles'
import { getExampleImages } from '@/lib/exampleImages'
import { RenaissanceFlow } from '@/components/RenaissanceFlow'
import { CreateFlow } from '@/components/CreateFlow'

export function generateStaticParams() {
  const params: { category: string; style: string }[] = []
  CATEGORY_SLUGS.forEach((slug) => {
    const category = getCategoryBySlug(slug)
    if (category) {
      const categoryId = category.id
      const styleIds = getAllStyleIdsForCategory(categoryId)
      styleIds.forEach((styleId) => {
        params.push({ category: slug, style: styleId })
      })
    }
  })
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; style: string }> }) {
  const { category: slug, style: styleId } = await params
  const category = getCategoryBySlug(slug)
  const style = category ? getStylePreset(category.id, styleId) : undefined
  if (!category || !style) return { title: 'LoveMemory' }
  return {
    title: `${category.label} — ${style.title} — LoveMemory`,
    description: `${category.tagline}. ${style.description}`,
  }
}

function ExampleImage({ src, index, alt }: { src?: string; index: number; alt: string }) {
  const aspectClass = 'aspect-[3/4]'

  if (src) {
    return (
      <div className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] ${aspectClass}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
    )
  }

  return (
    <div className={`group relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] transition-colors hover:border-white/20 ${aspectClass}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
          <svg className="h-6 w-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-xs text-white/30">Example {index}</span>
      </div>
    </div>
  )
}

export default async function StylePage({ params }: { params: Promise<{ category: string; style: string }> }) {
  const { category: slug, style: styleId } = await params
  const category = getCategoryBySlug(slug)
  const style = category ? getStylePreset(category.id, styleId) : undefined

  if (!category || !style) notFound()

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        {/* Back button */}
        <Link
          href={`/${category.slug}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to {category.label}
        </Link>
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-white/40">
          <Link href="/" className="transition-colors hover:text-white/60">Home</Link>
          <span>/</span>
          <Link href={`/${category.slug}`} className="transition-colors hover:text-white/60">{category.label}</Link>
          <span>/</span>
          <span className="text-white/70">{style.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5">
            <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
            <span className="text-xs font-medium tracking-wide text-amber-300">{style.title} Style</span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-satoshi)' }}>
            {category.label}
          </h1>
          
          <p className="mt-4 text-lg text-white/60 md:text-xl">
            {getStyleTagline(category, style)}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-white/50">
            {style.description}
          </p>
          <p className="mt-3 text-sm text-amber-400/80">£29.90 · Preview free · No subscription</p>
        </div>

        {/* Example photos section */}
        <div className="mb-16">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-white/40">
            Example Results
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
            {[0, 1, 2].map((i) => {
              const examples = getExampleImages(category.slug, style.id)
              return (
                <ExampleImage 
                  key={i} 
                  src={examples[i]} 
                  index={i + 1}
                  alt={`Example ${style.title} portrait ${i + 1}`}
                />
              )
            })}
          </div>
        </div>

        {/* Create section */}
        {style.subStyles && style.subStyles.length > 0 ? (
          <RenaissanceFlow
            categoryId={category.id}
            styleId={style.id}
            subStyles={style.subStyles}
          />
        ) : (
          <CreateFlow categoryId={category.id} styleId={style.id} />
        )}
      </div>
    </div>
  )
}
