'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const categories = [
  { id: 'pets', label: 'Pets', href: '/pets' },
  { id: 'family', label: 'Family', href: '/family' },
  { id: 'kids', label: 'Kids', href: '/kids' },
  { id: 'couples', label: 'Couples', href: '/couples' },
  { id: 'self', label: 'Self', href: '/self' },
]

export function CategoryTabs() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }}
        >
          <Link
            href={cat.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            {cat.label}
            <svg className="h-3.5 w-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
