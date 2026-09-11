import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  applyMarkupPence,
  DEFAULT_FRAME_SIZE,
  FRAME_COLOURS,
  getFrameSize,
  isFrameColour,
  isFrameSize,
} from '@/lib/frameCatalog'
import { isProdigiConfigured, quoteFramedPrintGbpPence } from '@/lib/prodigi'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  return new Stripe(key, { apiVersion: '2026-01-28.clover' })
}

const DOWNLOAD_PRICE_GBP = 990

const PRODUCTS = {
  pet: {
    name: 'Pet Portrait',
    description: 'AI-generated pet portrait - single image upload',
    price: 2900,
  },
  family: {
    name: 'Family / Couple / Self-Portrait',
    description: 'AI-generated family, couple, or self-portrait — humans & multi-image uploads',
    price: 2900,
  },
}

const PORTRAIT_OPTIONS = {
  download: {
    name: 'Digital Download',
    description: 'High-resolution digital download of your portrait',
  },
  print: {
    name: 'Print',
    description: 'Professional print of your portrait',
  },
  framed: {
    name: 'Printed & framed classic',
    description: 'Fine art print in a classic frame, delivered ready to hang',
  },
} as const

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured.' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { productId, orderId, option, returnUrl, frameColor, frameSize } = body
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    const colour = isFrameColour(frameColor) ? frameColor : 'gold'
    const size = getFrameSize(isFrameSize(frameSize) ? frameSize : DEFAULT_FRAME_SIZE)
    const colourLabel = FRAME_COLOURS.find((c) => c.id === colour)?.label ?? 'Gold'
    const resolvedOption = isFrameSize(frameSize) ? size.option : option

    // Portrait checkout (from CreateFlow result step)
    if (orderId && option && PORTRAIT_OPTIONS[option as keyof typeof PORTRAIT_OPTIONS]) {
      const opt = PORTRAIT_OPTIONS[resolvedOption as keyof typeof PORTRAIT_OPTIONS] ?? PORTRAIT_OPTIONS[option as keyof typeof PORTRAIT_OPTIONS]
      const cancelUrl = typeof returnUrl === 'string' && returnUrl.startsWith(origin)
        ? returnUrl
        : origin + '/'

      let unitAmount = DOWNLOAD_PRICE_GBP
      let productName = opt.name
      let productDescription = opt.description

      if (resolvedOption === 'framed' || resolvedOption === 'print') {
        if (!isProdigiConfigured()) {
          return NextResponse.json({ error: 'Prints are not available yet.' }, { status: 503 })
        }
        const quote = await quoteFramedPrintGbpPence({
          countryCode: 'GB',
          color: colour,
          sizeId: size.id,
        })
        unitAmount = applyMarkupPence(quote.costPence, size.capPence)
        if (resolvedOption === 'framed') {
          productName = `Printed & framed ${size.label} · ${colourLabel}`
          productDescription = `Classic ${size.label}, ${colourLabel.toLowerCase()} frame, UK shipping included`
        } else {
          productName = `Fine art print ${size.label}`
          productDescription = `${size.label} on paper, unframed, UK shipping included`
        }
      }

      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: productName,
                description: productDescription,
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&option=${resolvedOption}`,
        cancel_url: cancelUrl,
        metadata: { orderId, option: resolvedOption, frameColor: colour, frameSize: size.id },
      }

      if (resolvedOption === 'framed' || resolvedOption === 'print') {
        sessionConfig.shipping_address_collection = {
          allowed_countries: ['GB', 'IE', 'US', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'PT'],
        }
      }

      const session = await stripe.checkout.sessions.create(sessionConfig)
      return NextResponse.json({ url: session.url })
    }

    // Legacy: product checkout (from pricing page)
    if (!productId || !PRODUCTS[productId as keyof typeof PRODUCTS]) {
      return NextResponse.json(
        { error: 'Invalid product or missing orderId/option.' },
        { status: 400 }
      )
    }

    const product = PRODUCTS[productId as keyof typeof PRODUCTS]
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/contact`,
      metadata: { productId },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    const message = err instanceof Error ? err.message : 'Checkout failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
