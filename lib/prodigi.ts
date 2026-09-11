/**
 * Prodigi Print API — classic frames.
 * Only env needed: PRODIGI_API_KEY
 */

import { getFrameSize, type FrameSizeId } from './frameCatalog'

const LIVE = 'https://api.prodigi.com/v4.0'
const SANDBOX = 'https://api.sandbox.prodigi.com/v4.0'

export type ProdigiRecipient = {
  name: string
  email?: string
  address: {
    line1: string
    line2?: string
    postalOrZipCode: string
    countryCode: string
    townOrCity: string
    stateOrCounty?: string
  }
}

function apiBase(): string {
  const explicit = process.env.PRODIGI_API_BASE?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  const key = process.env.PRODIGI_API_KEY?.trim() ?? ''
  if (key.toLowerCase().includes('sandbox')) return SANDBOX
  return LIVE
}

function apiKey(): string {
  return process.env.PRODIGI_API_KEY?.trim() ?? ''
}

export function isProdigiConfigured(): boolean {
  return apiKey().length > 8
}

async function prodigiFetch(path: string, init?: RequestInit): Promise<Response> {
  const key = apiKey()
  if (!key) throw new Error('Prodigi is not set up yet.')
  return fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': key,
      ...(init?.headers ?? {}),
    },
  })
}

export async function quoteFramedPrintGbpPence(options?: {
  countryCode?: string
  color?: string
  sizeId?: FrameSizeId
}): Promise<{ costPence: number; itemsPence: number; shippingPence: number }> {
  const size = getFrameSize(options?.sizeId)
  const item: Record<string, unknown> = {
    sku: size.sku,
    copies: 1,
    assets: [{ printArea: 'default' }],
  }
    item.attributes = { color: options?.color ?? 'gold' }
  const res = await prodigiFetch('/quotes', {
    method: 'POST',
    body: JSON.stringify({
      shippingMethod: size.shippingMethod,
      destinationCountryCode: options?.countryCode ?? 'GB',
      currencyCode: 'GBP',
      items: [item],
    }),
  })
  const data = (await res.json()) as {
    outcome?: string
    quotes?: Array<{
      costSummary?: {
        totalCost?: { amount?: string }
        items?: { amount?: string }
        shipping?: { amount?: string }
      }
    }>
  }
  const summary = data.quotes?.[0]?.costSummary
  const total = Number.parseFloat(summary?.totalCost?.amount ?? '')
  if (!res.ok || !Number.isFinite(total)) {
    throw new Error('Could not get a frame price from Prodigi.')
  }
  return {
    costPence: Math.round(total * 100),
    itemsPence: Math.round(Number.parseFloat(summary?.items?.amount ?? '0') * 100),
    shippingPence: Math.round(Number.parseFloat(summary?.shipping?.amount ?? '0') * 100),
  }
}

export async function createProdigiOrder(options: {
  sku: string
  imageUrl: string
  recipient: ProdigiRecipient
  merchantReference: string
  color?: string
  shippingMethod?: 'Budget' | 'Standard'
}): Promise<{ id: string }> {
  const item: Record<string, unknown> = {
    sku: options.sku,
    copies: 1,
    sizing: 'fitPrintArea',
    assets: [{ printArea: 'default', url: options.imageUrl }],
  }
  if (options.color) {
    item.attributes = { color: options.color }
  }

  const res = await prodigiFetch('/Orders', {
    method: 'POST',
    body: JSON.stringify({
      merchantReference: options.merchantReference,
      shippingMethod: options.shippingMethod ?? 'Budget',
      idempotencyKey: options.merchantReference,
      recipient: options.recipient,
      items: [item],
    }),
  })

  const data = (await res.json().catch(() => ({}))) as {
    outcome?: string
    order?: { id?: string }
    error?: { message?: string }
    message?: string
  }

  if (!res.ok || data.outcome === 'Failed' || !data.order?.id) {
    const detail = data.error?.message || data.message || `Prodigi error (${res.status})`
    throw new Error(detail)
  }

  return { id: data.order.id }
}
