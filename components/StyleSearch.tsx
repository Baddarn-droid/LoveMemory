'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { searchStyleLibrary } from '@/lib/styles'

interface StyleSearchProps {
  categorySlug: string
}

export function StyleSearch({ categorySlug }: StyleSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = searchStyleLibrary(query)
  const showDropdown = isOpen && query.trim().length >= 2 && results.length > 0

  useEffect(() => {
    setFocusedIndex(0)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[focusedIndex]) {
      e.preventDefault()
      window.location.href = `/${categorySlug}/${results[focusedIndex].id}`
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative mb-8">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40">
        Search Styles
      </h2>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type to search... e.g. football, vintage, comic, renaissance"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 pr-12 text-white placeholder-white/30 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.05]"
        />
        <svg
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-charcoal shadow-xl">
          {results.map((style, i) => (
            <Link
              key={style.id}
              href={`/${categorySlug}/${style.id}`}
              className={`flex flex-col gap-1 border-b border-white/5 px-5 py-4 transition-colors last:border-b-0 hover:bg-white/[0.05] ${
                i === focusedIndex ? 'bg-white/[0.05]' : ''
              }`}
            >
              <span className="font-semibold text-white">{style.title}</span>
              <span className="text-sm text-white/50">{style.description}</span>
              {style.subStyles && style.subStyles.length > 0 && (
                <span className="text-xs text-white/30">
                  Includes: {style.subStyles.map((s) => s.title).join(', ')}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-2 rounded-xl border border-white/10 bg-charcoal px-5 py-4 text-sm text-white/50">
          No styles found for &quot;{query}&quot;
        </div>
      )}

      {isOpen && query.trim().length > 0 && query.trim().length < 2 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-2 rounded-xl border border-white/10 bg-charcoal px-5 py-4 text-sm text-white/40">
          Type at least 2 characters to search
        </div>
      )}
    </div>
  )
}
