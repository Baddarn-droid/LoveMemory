import sharp from 'sharp'
import type { CategoryId } from './styles'

export const UNFILTERED_PIPELINE_APPLIES_TO: readonly CategoryId[] = ['pets', 'family'] as const

export type PortraitTier = 'preview' | 'standard'

const XAI_IMAGES_EDITS_URL = 'https://api.x.ai/v1/images/edits'
const XAI_IMAGE_MODEL = 'grok-imagine-image-2.0'

export const PORTRAIT_PREVIEW_CONFIG = {
  canvasSize: 1024,
  aspectRatio: '1:1' as const,
}

export const PORTRAIT_STANDARD_CONFIG = PORTRAIT_PREVIEW_CONFIG

const TIER_CONFIG: Record<PortraitTier, typeof PORTRAIT_PREVIEW_CONFIG> = {
  preview: PORTRAIT_PREVIEW_CONFIG,
  standard: PORTRAIT_STANDARD_CONFIG,
}

/** Symmetric letterbox on a square canvas */
export async function prepareSourceImage(
  buffer: Buffer,
  canvasSize: number = PORTRAIT_PREVIEW_CONFIG.canvasSize
): Promise<Buffer> {
  const resized = await sharp(buffer)
    .resize(canvasSize, canvasSize, { fit: 'inside', withoutEnlargement: false })
    .toBuffer()

  const meta = await sharp(resized).metadata()
  const w = meta.width ?? canvasSize
  const h = meta.height ?? canvasSize
  const left = Math.round((canvasSize - w) / 2)
  const top = Math.round((canvasSize - h) / 2)

  return sharp(resized)
    .extend({
      top,
      bottom: canvasSize - h - top,
      left,
      right: canvasSize - w - left,
      background: { r: 32, g: 30, b: 28 },
    })
    .png({ compressionLevel: 6 })
    .toBuffer()
}

type XaiImagePayload = {
  data?: Array<{ b64_json?: string; url?: string }>
  b64_json?: string
  url?: string
  error?: { message?: string } | string
}

function redactSecrets(text: string): string {
  return text.replace(/xai-[A-Za-z0-9]+/g, 'xai-***').replace(/sk-[^\s]+/g, 'sk-***')
}

async function b64FromXaiPayload(payload: XaiImagePayload): Promise<string> {
  const first = payload.data?.[0]
  const b64 = first?.b64_json || payload.b64_json
  if (b64) return b64

  const url = first?.url || payload.url
  if (url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch generated image from xAI.')
    return Buffer.from(await res.arrayBuffer()).toString('base64')
  }

  throw new Error('Unexpected response from xAI image API.')
}

export async function generatePortraitImage(options: {
  apiKey: string
  sourceBuffer: Buffer
  prompt: string
  category: CategoryId | null
  tier?: PortraitTier
}): Promise<string> {
  const { apiKey, sourceBuffer, prompt, tier = 'preview' } = options
  const config = TIER_CONFIG[tier]

  const prepared = await prepareSourceImage(sourceBuffer, config.canvasSize)
  const dataUri = `data:image/png;base64,${prepared.toString('base64')}`

  const res = await fetch(XAI_IMAGES_EDITS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: XAI_IMAGE_MODEL,
      prompt,
      image: { url: dataUri, type: 'image_url' },
      aspect_ratio: config.aspectRatio,
      response_format: 'b64_json',
    }),
  })

  const text = await res.text()
  let payload: XaiImagePayload
  try {
    payload = JSON.parse(text) as XaiImagePayload
  } catch {
    throw new Error(
      redactSecrets(!res.ok ? `xAI ${res.status}: ${text.slice(0, 240)}` : 'xAI response was not JSON')
    )
  }

  if (!res.ok) {
    const errMsg =
      typeof payload.error === 'string'
        ? payload.error
        : payload.error?.message || text.slice(0, 240)
    throw new Error(redactSecrets(`xAI ${res.status}: ${errMsg}`))
  }

  return b64FromXaiPayload(payload)
}
