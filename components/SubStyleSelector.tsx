'use client'

import { motion } from 'framer-motion'
import type { RenaissanceSubStyle } from '@/lib/styles'

interface SubStyleSelectorProps {
  subStyles: RenaissanceSubStyle[]
  selectedId: string
  onSelect: (id: string) => void
}

export function SubStyleSelector({ subStyles, selectedId, onSelect }: SubStyleSelectorProps) {
  return (
    <div className="mb-16 space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-widest text-white/40">
        Choose Your Renaissance Style
      </h2>
      <div className="space-y-3">
        {subStyles.map((sub) => {
          const isSelected = selectedId === sub.id
          return (
            <motion.button
              key={sub.id}
              type="button"
              onClick={() => onSelect(sub.id)}
              whileHover={{ x: 2 }}
              className={`flex w-full flex-col items-start rounded-xl border p-5 text-left transition-colors ${
                isSelected
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-satoshi)' }}>
                  {sub.title}
                </h3>
                {isSelected && (
                  <svg className="h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                {sub.description}
              </p>
              <div className="mt-4 flex gap-2">
                {sub.colors.map((color, i) => (
                  <span
                    key={i}
                    className="h-4 w-4 shrink-0 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
