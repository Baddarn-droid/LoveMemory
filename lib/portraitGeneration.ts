import OpenAI, { toFile } from 'openai'
import sharp from 'sharp'
import type { CategoryId } from './styles'

/**
 * Single generation profile for preview and purchased portraits.
 * quality=low + smaller canvas keeps more likeness to the original photo.
 */
export const PORTRAIT_GENERATION_CONFIG = {
  quality: 'low' as const,
  canvasSize: 768,
  outputSize: '1024x1024' as const,
}

/** Resize / pad the uploaded photo before sending to OpenAI */
export async function prepareSourceImage(
  buffer: Buffer,
  category: CategoryId | null,
  canvasSize: number = PORTRAIT_GENERATION_CONFIG.canvasSize
): Promise<Buffer> {
  const needsTopPadding = category === 'pets' || category === 'family'
  const topPadding = Math.round(420 * (canvasSize / 1024))
  const contentHeight = canvasSize - topPadding

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
    return sharp(resized)
      .extend({
        top: topPadding,
        bottom: Math.max(0, bottom),
        left,
        right: canvasSize - w - left,
        background: { r: 45, g: 42, b: 38 },
      })
      .png()
      .toBuffer()
  }

  return sharp(buffer)
    .resize(canvasSize, canvasSize, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer()
}

export async function generatePortraitImage(options: {
  apiKey: string
  sourceBuffer: Buffer
  prompt: string
  category: CategoryId | null
}): Promise<string> {
  const { apiKey, sourceBuffer, prompt, category } = options
  const config = PORTRAIT_GENERATION_CONFIG

  const pngBuffer = await prepareSourceImage(sourceBuffer, category, config.canvasSize)
  const imageFile = await toFile(pngBuffer, 'image.png', { type: 'image/png' })

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
