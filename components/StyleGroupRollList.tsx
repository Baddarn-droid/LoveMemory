'use client'

import Link from 'next/link'
import type { StyleGroup } from '@/lib/styles'
import { getCatalogThumb } from '@/lib/exampleImages'
import { StyleThumb } from '@/components/StyleThumb'
import { frameColourForIndex } from '@/lib/frameCatalog'

interface StyleGroupRollListProps {
  categorySlug: string
  groups: StyleGroup[]
}

export function StyleGroupRollList({ categorySlug, groups }: StyleGroupRollListProps) {
  let mixIndex = 0

  return (
    <div className="space-y-14">
      {groups.map((group) => (
        <section key={group.id}>
          <h3
            className="mb-5 font-display text-lg font-semibold text-white"
            style={{ fontFamily: 'var(--font-satoshi)' }}
          >
            {group.title}
          </h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group.styles.map((style) => {
              const colourIndex = mixIndex
              const thumb = getCatalogThumb(categorySlug, style.id, mixIndex)
              mixIndex += 1
              return (
                <li key={style.id}>
                  <Link
                    href={`/${categorySlug}/${style.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3 transition hover:border-amber-500/30 hover:bg-white/[0.04]"
                  >
                    <div className="w-[5.5rem] shrink-0 sm:w-28">
                      {thumb ? (
                        <StyleThumb src={thumb} alt="" colour={frameColourForIndex(colourIndex)} />
                      ) : (
                        <div className="h-full w-full bg-white/[0.04]" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
                      <p className="font-medium text-white">{style.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">{style.description}</p>
                      <p className="mt-2 text-xs font-semibold text-amber-300/90">Try this look →</p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
