import OpenAI, { toFile } from 'openai'
import sharp from 'sharp'
import type { CategoryId } from './styles'

export type PortraitTier = 'preview' | 'standard'

/**
 * Fast preview profile — pets AND family/couple, all 40 styles.
 * quality=low + 384px canvas + JPEG input = fastest generation, minimal face filtering.
 */
export const PORTRAIT_PREVIEW_CONFIG = {
  quality: 'low' as const,
  canvasSize: 384,
  outputSize: '1024x1024' as const,
  inputJpegQuality: 80,
}

/** Purchased portraits use the same profile (WYSIWYG). */
export const PORTRAIT_STANDARD_CONFIG = PORTRAIT_PREVIEW_CONFIG

const TIER_CONFIG: Record<PortraitTier, typeof PORTRAIT_PREVIEW_CONFIG> = {
  preview: PORTRAIT_PREVIEW_CONFIG,
  standard: PORTRAIT_STANDARD_CONFIG,
}

/** Resize / pad the uploaded photo before sending to OpenAI */
export async function prepareSourceImage(
  buffer: Buffer,
  category: CategoryId | null,
  canvasSize: number = PORTRAIT_PREVIEW_CONFIG.canvasSize,
  jpegQuality: number = PORTRAIT_PREVIEW_CONFIG.inputJpegQuality
): Promise<{ buffer: Buffer; mimeType: 'image/jpeg'; filename: string }> {
  const needsTopPadding = category === 'pets' || category === 'family'
  const topPadding = Math.round(420 * (canvasSize / 1024))
  const contentHeight = canvasSize - topPadding

  let processed: Buffer

  if (needsTopPadding) {
    const resized = await sharp(buffer)
      .resize(canvasSize, contentHeight, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer()
    const meta = await sharp(resized).metadata()
    const w = meta.width ?? canvasSize
    const h = meta.height ?? contentHeight
    const left = Math.round((canvasSize - w) / 2)
    const bottom = canvasSize - topPadding - h
    processed = await sharp(resized)
      .extend({
        top: topPadding,
        bottom: Math.max(0, bottom),
        left,
        right: canvasSize - w - left,
        background: { r: 45, g: 42, b: 38 },
      })
      .jpeg({ quality: jpegQuality, mozjpeg: true })
      .toBuffer()
  } else {
    processed = await sharp(buffer)
      .resize(canvasSize, canvasSize, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: jpegQuality, mozjpeg: true })
      .toBuffer()
  }

  return { buffer: processed, mimeType: 'image/jpeg', filename: 'image.jpg' }
}

export async function generatePortraitImage(options: {
  apiKey: string
  sourceBuffer: Buffer
  prompt: string
  category: CategoryId | null
  tier?: PortraitTier
}): Promise<string> {
  const { apiKey, sourceBuffer, prompt, category, tier = 'preview' } = options
  const config = TIER_CONFIG[tier]

  const prepared = await prepareSourceImage(
    sourceBuffer,
    category,
    config.canvasSize,
    config.inputJpegQuality
  )
  const imageFile = await toFile(prepared.buffer, prepared.filename, { type: prepared.mimeType })

  const openai = new OpenAI({ apiKey })
  const result = await openai.images.edit({
    model: 'gpt-image-1.5',
    image: [imageFile],
    prompt,
    size: config.outputSize,
    quality: config.quality,
  })

  const first = result.data?.[0]
  if (!first) {
    throw new Error('No image was generated.')
  }

  if ('b64_json' in first && first.b64_json) {
    return first.b64_json
  }

  if ('url' in first && first.url) {
    const res = await fetch(first.url)
    if (!res.ok) throw new Error('Failed to fetch generated image.')
    return Buffer.from(await res.arrayBuffer()).toString('base64')
  }

  throw new Error('Unexpected response from OpenAI.')
}
