'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { StyleGroup } from '@/lib/styles'

interface StyleGroupRollListProps {
  categorySlug: string
  groups: StyleGroup[]
}

export function StyleGroupRollList({ categorySlug, groups }: StyleGroupRollListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const isExpanded = expandedId === group.id
        return (
          <div
            key={group.id}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
          >
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : group.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.04]"
            >
              <span className="font-display text-base font-semibold text-white" style={{ fontFamily: 'var(--font-satoshi)' }}>
                {group.title}
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/5 px-5 py-3">
                    <div className="max-h-64 space-y-1 overflow-y-auto pr-2">
                      {group.styles.map((style) => (
                        <Link
                          key={style.id}
                          href={`/${categorySlug}/${style.id}`}
                          className="block rounded-lg px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          <span className="font-medium">{style.title}</span>
                          {style.description && (
                            <span className="ml-2 text-white/50">— {style.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
