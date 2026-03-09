'use client'

import { motion } from 'framer-motion'
import type { RenaissanceSubStyle } from '@/lib/styles'

interface SubStyleSelectorProps {
  subStyles: RenaissanceSubStyle[]
  selectedId: string
  onSelect: (id: string) => void
  /** Optional title override (e.g. "Choose your style") */
  title?: string
}

export function SubStyleSelector({ subStyles, selectedId, onSelect, title = 'CHOOSE YOUR RENAISSANCE STYLE' }: SubStyleSelectorProps) {
  return (
    <div className="mb-16">
      <h2 className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-white/50">
        {title}
      </h2>
      <div className="space-y-4">
        {subStyles.map((sub) => {
          const isSelected = selectedId === sub.id
          return (
            <motion.button
              key={sub.id}
              type="button"
              onClick={() => onSelect(sub.id)}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              className={`relative flex w-full flex-col items-start rounded-2xl border-2 p-6 text-left transition-colors ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              {isSelected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <h3 className="pr-10 font-display text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-satoshi)' }}>
                {sub.title}
              </h3>
              <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${isSelected ? 'text-emerald-200/80' : 'text-white/60'}`}>
                {sub.description}
              </p>
              <div className="mt-4 flex gap-2.5">
                {(sub.colors ?? []).map((color, i) => (
                  <span
                    key={i}
                    className="h-6 w-6 shrink-0 rounded-full border-2 border-white/20 shadow-sm"
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
