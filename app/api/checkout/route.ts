import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

const PRICE_GBP = 2990 // £29.90 in pence

const PRODUCTS = {
  pet: {
    name: 'Pet Portrait',
    description: 'AI-generated pet portrait - single image upload',
    price: 2900,
  },
  family: {
    name: 'Family Portrait',
    description: 'AI-generated family portrait - humans & multi-image uploads',
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
    name: 'Printed & Framed',
    description: 'Professional print, framed and delivered to your door',
  },
} as const

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured.' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { productId, orderId, option, returnUrl } = body
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Portrait checkout (from CreateFlow result step)
    if (orderId && option && PORTRAIT_OPTIONS[option as keyof typeof PORTRAIT_OPTIONS]) {
      const opt = PORTRAIT_OPTIONS[option as keyof typeof PORTRAIT_OPTIONS]
      const cancelUrl = typeof returnUrl === 'string' && returnUrl.startsWith(origin)
        ? returnUrl
        : origin + '/'
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: opt.name,
                description: opt.description,
              },
              unit_amount: PRICE_GBP,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&option=${option}`,
        cancel_url: cancelUrl,
        metadata: { orderId, option },
      }

      if (option === 'framed') {
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
      cancel_url: `${origin}/pricing`,
      metadata: { productId },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    const message = err instanceof Error ? err.message : 'Checkout failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
