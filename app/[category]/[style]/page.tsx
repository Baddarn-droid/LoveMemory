import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getStylePreset, getStyleTagline, CATEGORY_SLUGS, getAllStyleIdsForCategory } from '@/lib/styles'
import { getExampleImages, getExampleSubjectLabel } from '@/lib/exampleImages'
import { StyleCreateSection } from '@/components/StyleCreateSection'
import { ExampleFramed } from '@/components/ExampleFramed'
import { GalleryWall } from '@/components/ProdigiClassicFrame'
import { frameColourForIndex } from '@/lib/frameCatalog'

export function generateStaticParams() {
  const params: { category: string; style: string }[] = []
  CATEGORY_SLUGS.forEach((slug) => {
    const category = getCategoryBySlug(slug)
    if (category) {
      getAllStyleIdsForCategory(category.id).forEach((styleId) => {
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
    title: `${style.title} ${category.label} — LoveMemory`,
    description: style.description,
  }
}

export default async function StylePage({ params }: { params: Promise<{ category: string; style: string }> }) {
  const { category: slug, style: styleId } = await params
  const category = getCategoryBySlug(slug)
  const style = category ? getStylePreset(category.id, styleId) : undefined

  if (!category || !style) notFound()

  const examples = getExampleImages(category.slug, style.id)

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <Link
          href={`/${category.slug}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"
        >
          ← All {category.id === 'pets' ? 'pet' : 'people'} looks
        </Link>

        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-300/85">{category.label}</p>
          <h1
            className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl"
            style={{ fontFamily: 'var(--font-satoshi)' }}
          >
            {style.title}
          </h1>
          <p className="mt-4 text-lg text-white/60">{getStyleTagline(category, style)}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/50">{style.description}</p>
          <p className="mt-3 text-sm text-amber-300/80">Upload a photo below — preview is free.</p>
        </div>

        <div className="mb-16">
          <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
            {category.id === 'pets' ? 'Same look, different animals' : 'Same look, different people'}
          </h2>
          <GalleryWall className="rounded-2xl px-4 py-8 sm:px-8 sm:py-10">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8">
              {[0, 1, 2].map((i) => {
                const src = examples[i]
                const subject = getExampleSubjectLabel(category.slug, i)
                return (
                  <div key={i}>
                    {src ? (
                      <ExampleFramed
                        src={src}
                        alt={`${style.title} ${subject}`}
                        colour={frameColourForIndex(i)}
                        sizes="33vw"
                      />
                    ) : (
                      <div className="flex aspect-[5/7] items-center justify-center text-xs text-white/25">{subject}</div>
                    )}
                    <p className="mt-3 text-center text-xs tracking-wide text-white/50">{subject}</p>
                  </div>
                )
              })}
            </div>
          </GalleryWall>
        </div>

        <StyleCreateSection categoryId={category.id} styleId={style.id} styleTitle={style.title} />
      </div>
    </div>
  )
}
