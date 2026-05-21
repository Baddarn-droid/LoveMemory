import OpenAI, { toFile } from 'openai'
import sharp from 'sharp'
import type { CategoryId } from './styles'

export const UNFILTERED_PIPELINE_APPLIES_TO: readonly CategoryId[] = ['pets', 'family'] as const

export type PortraitTier = 'preview' | 'standard'

/** Clean single-pass edit — no face mask or overlay (those caused the oval bubble). */
export const PORTRAIT_PREVIEW_CONFIG = {
  quality: 'low' as const,
  inputFidelity: 'low' as const,
  canvasSize: 1024,
  outputSize: '1024x1024' as const,
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

type ImageEditWithFidelity = OpenAI.Images.ImageEditParams & {
  input_fidelity?: 'high' | 'low'
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
  const imageFile = await toFile(prepared, 'image.png', { type: 'image/png' })

  const openai = new OpenAI({ apiKey })
  const result = await openai.images.edit({
    model: 'gpt-image-1.5',
    image: [imageFile],
    prompt,
    size: config.outputSize,
    quality: config.quality,
    input_fidelity: config.inputFidelity,
  } as ImageEditWithFidelity)

  const first = result.data?.[0]
  if (!first) throw new Error('No image was generated.')

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
