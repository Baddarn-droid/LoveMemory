import OpenAI, { toFile } from 'openai'
import sharp from 'sharp'
import type { CategoryId } from './styles'
import {
  buildFaceProtectMask,
  restoreFacesFromSource,
  type PreparedSource,
} from './facePreservation'

export const UNFILTERED_PIPELINE_APPLIES_TO: readonly CategoryId[] = ['pets', 'family'] as const

export type PortraitTier = 'preview' | 'standard'

/** Face-first: high input fidelity + face mask + quality low (less beautification) */
export const PORTRAIT_PREVIEW_CONFIG = {
  quality: 'low' as const,
  inputFidelity: 'high' as const,
  canvasSize: 1024,
  outputSize: '1024x1024' as const,
}

export const PORTRAIT_STANDARD_CONFIG = PORTRAIT_PREVIEW_CONFIG

const TIER_CONFIG: Record<PortraitTier, typeof PORTRAIT_PREVIEW_CONFIG> = {
  preview: PORTRAIT_PREVIEW_CONFIG,
  standard: PORTRAIT_STANDARD_CONFIG,
}

/** Symmetric letterbox — keeps face position stable for mask + restore */
export async function prepareSourceImage(
  buffer: Buffer,
  _category: CategoryId | null,
  canvasSize: number = PORTRAIT_PREVIEW_CONFIG.canvasSize
): Promise<PreparedSource> {
  const resized = await sharp(buffer)
    .resize(canvasSize, canvasSize, { fit: 'inside', withoutEnlargement: false })
    .toBuffer()

  const meta = await sharp(resized).metadata()
  const w = meta.width ?? canvasSize
  const h = meta.height ?? canvasSize
  const left = Math.round((canvasSize - w) / 2)
  const top = Math.round((canvasSize - h) / 2)

  const processed = await sharp(resized)
    .extend({
      top,
      bottom: canvasSize - h - top,
      left,
      right: canvasSize - w - left,
      background: { r: 32, g: 30, b: 28 },
    })
    .png({ compressionLevel: 6 })
    .toBuffer()

  return {
    buffer: processed,
    size: canvasSize,
    subjectRect: { left, top, width: w, height: h },
  }
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
  const { apiKey, sourceBuffer, prompt, category, tier = 'preview' } = options
  const config = TIER_CONFIG[tier]

  const prepared = await prepareSourceImage(sourceBuffer, category, config.canvasSize)
  const imageFile = await toFile(prepared.buffer, 'image.png', { type: 'image/png' })
  const maskBuffer = await buildFaceProtectMask(prepared.size, prepared.subjectRect, category)
  const maskFile = await toFile(maskBuffer, 'mask.png', { type: 'image/png' })

  const openai = new OpenAI({ apiKey })
  const result = await openai.images.edit({
    model: 'gpt-image-1.5',
    image: [imageFile],
    mask: maskFile,
    prompt,
    size: config.outputSize,
    quality: config.quality,
    input_fidelity: config.inputFidelity,
  } as ImageEditWithFidelity)

  const first = result.data?.[0]
  if (!first) throw new Error('No image was generated.')

  let generatedB64: string
  if ('b64_json' in first && first.b64_json) {
    generatedB64 = first.b64_json
  } else if ('url' in first && first.url) {
    const res = await fetch(first.url)
    if (!res.ok) throw new Error('Failed to fetch generated image.')
    generatedB64 = Buffer.from(await res.arrayBuffer()).toString('base64')
  } else {
    throw new Error('Unexpected response from OpenAI.')
  }

  return restoreFacesFromSource(generatedB64, prepared, category, 1024)
}
