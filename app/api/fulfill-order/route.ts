import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import Stripe from 'stripe'
import { orderPaths, readOrderManifest, writeOrderManifest } from '@/lib/orderStorage'
import {
  createProdigiOrder,
  isProdigiConfigured,
  type ProdigiRecipient,
} from '@/lib/prodigi'
import { getFrameSize } from '@/lib/frameCatalog'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  return new Stripe(key, { apiVersion: '2026-01-28.clover' })
}

const UUID_RE = /^[a-f0-9-]{36}$/i

function shippingFromSession(session: Stripe.Checkout.Session): ProdigiRecipient | null {
  const collected = session.collected_information?.shipping_details
  const legacy = session.shipping_details
  const details = collected ?? legacy
  const address = details?.address
  if (!details?.name || !address?.line1 || !address.city || !address.postal_code || !address.country) {
    return null
  }
  return {
    name: details.name,
    email: session.customer_details?.email ?? undefined,
    address: {
      line1: address.line1,
      line2: address.line2 ?? undefined,
      postalOrZipCode: address.postal_code,
      countryCode: address.country,
      townOrCity: address.city,
      stateOrCounty: address.state ?? undefined,
    },
  }
}

function publicImageUrl(request: NextRequest, orderId: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  const origin = configured || request.nextUrl.origin
  return `${origin}/api/order/${orderId}/image`
}

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
    return NextResponse.json({ status: 'ready', orderId, prodigiOrderId: manifest.prodigiOrderId })
  }

  const paths = orderPaths(orderId)
  if (!fs.existsSync(paths.preview)) {
    return NextResponse.json({ error: 'Portrait file not found.' }, { status: 404 })
  }

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
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

  const needsPhysical = manifest.option === 'framed' || manifest.option === 'print'
  if (needsPhysical) {
    if (!isProdigiConfigured()) {
      return NextResponse.json(
        { error: 'Add PRODIGI_API_KEY to frontend/.env.local, save, then restart npm run dev.' },
        { status: 503 }
      )
    }

    const recipient = shippingFromSession(session)
    if (!recipient) {
      return NextResponse.json({ error: 'No shipping address on this payment.' }, { status: 400 })
    }

    try {
      const imageUrl = publicImageUrl(request, orderId)
      const size = getFrameSize(manifest.frameSize ?? manifest.option)
      const order = await createProdigiOrder({
        sku: size.sku,
        imageUrl,
        recipient,
        merchantReference: orderId,
        color: manifest.frameColor ?? 'gold',
        shippingMethod: size.shippingMethod,
      })
      writeOrderManifest(orderId, { ...manifest, fulfilled: true, prodigiOrderId: order.id })
      return NextResponse.json({ status: 'ready', orderId, prodigiOrderId: order.id })
    } catch (err) {
      console.error('fulfill-order prodigi error:', err)
      const message = err instanceof Error ? err.message : 'Could not send the frame order to Prodigi.'
      return NextResponse.json({ error: message }, { status: 502 })
    }
  }

  writeOrderManifest(orderId, { ...manifest, fulfilled: true })
  return NextResponse.json({ status: 'ready', orderId })
}

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
    prodigiOrderId: manifest.prodigiOrderId,
  })
}
