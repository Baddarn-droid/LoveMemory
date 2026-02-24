import { Suspense } from 'react'
import { CheckoutSuccessClient } from './CheckoutSuccessClient'

export const metadata = {
  title: 'Payment Successful — LoveMemory',
  description: 'Your payment was successful.',
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string; option?: string }>
}) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-offwhite/60">Loading...</div>}>
      <CheckoutSuccessClient searchParams={searchParams} />
    </Suspense>
  )
}
