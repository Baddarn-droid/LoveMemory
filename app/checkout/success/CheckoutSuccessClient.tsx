'use client'

import { use } from 'react'
import Link from 'next/link'
import { getApiBase } from '@/lib/apiBase'

export function CheckoutSuccessClient({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string; option?: string }>
}) {
  const params = use(searchParams)
  const { order_id, option } = params

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
        <svg
          className="h-10 w-10 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-offwhite md:text-4xl">
        Payment Successful!
      </h1>

      <p className="mt-4 max-w-md text-center text-offwhite/70">
        Thank you for your purchase.
      </p>

      {order_id && option && <FulfillmentSection orderId={order_id} option={option} />}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-emerald-500 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          Back to Home
        </Link>
        <Link
          href="/pets"
          className="rounded-full border border-white/10 bg-white/[0.03] px-8 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-white/[0.06]"
        >
          Create Another Portrait
        </Link>
      </div>
    </div>
  )
}

function FulfillmentSection({ orderId, option }: { orderId: string; option: string }) {
  const apiBase = getApiBase()
  const orderImageUrl = `${apiBase || ''}/api/order/${orderId}/image`
  if (option === 'download') {
    return (
      <div className="mt-6 text-center">
        <p className="mb-4 text-offwhite/70">Your portrait is ready to download.</p>
        <a
          href={orderImageUrl}
          download={`portrait-${orderId}.png`}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download Portrait
        </a>
      </div>
    )
  }

  if (option === 'print') {
    return (
      <div className="mt-6 max-w-md text-center">
        <p className="text-offwhite/70">
          Your print order has been received. You can also download your portrait to print at home.
        </p>
        <a
          href={orderImageUrl}
          download={`portrait-${orderId}.png`}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-white/10"
        >
          Download for Home Printing
        </a>
      </div>
    )
  }

  if (option === 'framed') {
    return (
      <p className="mt-6 max-w-md text-center text-offwhite/70">
        Your framed portrait will be printed, framed, and shipped to your address. You&apos;ll receive a confirmation
        email with tracking details.
      </p>
    )
  }

  return null
}
