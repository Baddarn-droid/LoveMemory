import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import Stripe from 'stripe'
import { orderPaths, readOrderManifest, writeOrderManifest } from '@/lib/orderStorage'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  return new Stripe(key, { apiVersion: '2026-01-28.clover' })
}

const UUID_RE = /^[a-f0-9-]{36}$/i

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 })
  }

  let body: { orderId?: string; sessionId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { orderId, sessionId } = body
  if (!orderId || !UUID_RE.test(orderId)) {
    return NextResponse.json({ error: 'Invalid order ID.' }, { status: 400 })
  }
  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'Stripe session ID is required.' }, { status: 400 })
  }

  const manifest = readOrderManifest(orderId)
  if (!manifest) {
    return NextResponse.json({ error: 'Order not found or expired.' }, { status: 404 })
  }

  if (manifest.fulfilled) {
    return NextResponse.json({ status: 'ready', orderId })
  }

  const paths = orderPaths(orderId)
  if (!fs.existsSync(paths.preview)) {
    return NextResponse.json({ error: 'Portrait file not found.' }, { status: 404 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed.' }, { status: 402 })
    }
    if (session.metadata?.orderId !== orderId) {
      return NextResponse.json({ error: 'Order does not match payment session.' }, { status: 403 })
    }
  } catch (err) {
    console.error('fulfill-order stripe error:', err)
    return NextResponse.json({ error: 'Could not verify payment.' }, { status: 400 })
  }

  writeOrderManifest(orderId, { ...manifest, fulfilled: true })
  return NextResponse.json({ status: 'ready', orderId })
}

/** Lightweight status check for success page polling */
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId')
  if (!orderId || !UUID_RE.test(orderId)) {
    return NextResponse.json({ error: 'Invalid order ID.' }, { status: 400 })
  }

  const manifest = readOrderManifest(orderId)
  if (!manifest) {
    return NextResponse.json({ error: 'Order not found or expired.' }, { status: 404 })
  }

  const paths = orderPaths(orderId)
  const hasImage = fs.existsSync(paths.preview)

  return NextResponse.json({
    orderId,
    fulfilled: manifest.fulfilled,
    ready: hasImage,
  })
}
