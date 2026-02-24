'use client'

import { useState } from 'react'
import { getApiBase } from '@/lib/apiBase'

const portraits = [
  {
    id: 'pet',
    name: 'Pet Portrait',
    description: 'Single image upload',
    price: 29,
    originalPrice: 39,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.75a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h1.5zM6.75 14.25a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h1.5zM18.75 3.75a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h1.5zM18.75 14.25a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h1.5z" />
      </svg>
    ),
    isNew: false,
  },
  {
    id: 'family',
    name: 'Family Portrait',
    description: 'Humans & multi-image uploads',
    price: 29,
    originalPrice: 49,
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    isNew: true,
  },
]

const features = [
  'High-resolution download',
  'No watermark',
  'Commercial use rights',
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (productId: string) => {
    setLoading(productId)
    setError(null)

    try {
      const apiBase = getApiBase()
      const res = await fetch(`${apiBase || ''}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(null)
    }
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-24">
      {/* Header */}
      <h1 className="font-display text-4xl font-bold tracking-tight text-offwhite md:text-5xl">
        Pay-Per-Portrait
      </h1>
      <p className="mt-4 max-w-md text-center text-offwhite/70">
        Don&apos;t need a pack? Purchase individual portraits at these prices.
      </p>

      {/* Error message */}
      {error && (
        <div className="mt-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="mt-12 grid w-full max-w-2xl gap-6 md:grid-cols-2">
        {portraits.map((portrait) => (
          <button
            key={portrait.id}
            onClick={() => handleCheckout(portrait.id)}
            disabled={loading !== null}
            className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all hover:border-white/20 hover:bg-white/[0.05] disabled:cursor-wait disabled:opacity-70"
          >
            {portrait.isNew && (
              <span className="absolute -top-2 right-4 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                New
              </span>
            )}

            <div className="flex items-center gap-3 text-emerald-400">
              {portrait.icon}
              <h2 className="font-display text-lg font-semibold text-offwhite">
                {portrait.name}
              </h2>
            </div>

            <p className="mt-2 text-sm text-offwhite/60">
              {portrait.description}
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-sm text-offwhite/40 line-through">
                ${portrait.originalPrice}
              </span>
              <span className="font-display text-4xl font-bold text-emerald-400">
                ${portrait.price}
              </span>
            </div>

            {loading === portrait.id && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-charcoal/80">
                <svg className="h-6 w-6 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Features */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-offwhite/60">
        {features.map((feature, i) => (
          <span key={feature} className="flex items-center gap-2">
            {i > 0 && <span className="hidden text-offwhite/30 md:inline">•</span>}
            {feature}
          </span>
        ))}
      </div>

      {/* Secure payment badge */}
      <div className="mt-8 flex items-center gap-2 text-xs text-offwhite/40">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        Secure payment powered by Stripe
      </div>
    </div>
  )
}
