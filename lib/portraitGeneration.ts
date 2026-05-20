import OpenAI, { toFile } from 'openai'
import sharp from 'sharp'
import type { CategoryId } from './styles'
import {
  buildEditMask,
  compositeOriginalFaces,
  type PreparedPortraitImage,
  type SubjectRect,
} from './facePreservation'

export type PortraitTier = 'preview' | 'standard'

/**
 * Face preservation: input_fidelity=high + edit mask + post-composite original face pixels.
 * The composite step guarantees zero filters — face is copied verbatim from the upload.
 */
export const PORTRAIT_PREVIEW_CONFIG = {
  quality: 'medium' as const,
  inputFidelity: 'high' as const,
  canvasSize: 1024,
  outputSize: '1024x1024' as const,
}

/** Purchased portraits use the same profile (WYSIWYG). */
export const PORTRAIT_STANDARD_CONFIG = PORTRAIT_PREVIEW_CONFIG

const TIER_CONFIG: Record<PortraitTier, typeof PORTRAIT_PREVIEW_CONFIG> = {
  preview: PORTRAIT_PREVIEW_CONFIG,
  standard: PORTRAIT_STANDARD_CONFIG,
}

/** Resize / pad the uploaded photo — returns subject bounds for face masking */
export async function prepareSourceImage(
  buffer: Buffer,
  category: CategoryId | null,
  canvasSize: number = PORTRAIT_PREVIEW_CONFIG.canvasSize
): Promise<PreparedPortraitImage> {
  const needsTopPadding = category === 'pets' || category === 'family'
  const topPadding = Math.round(420 * (canvasSize / 1024))
  const contentHeight = Math.max(64, canvasSize - topPadding)

  let processed: Buffer
  let subjectRect: SubjectRect

  if (needsTopPadding) {
    const resized = await sharp(buffer)
      .resize(canvasSize, contentHeight, { fit: 'inside', withoutEnlargement: true })
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
      .png({ compressionLevel: 6 })
      .toBuffer()
    subjectRect = { left, top: topPadding, width: w, height: h }
  } else {
    const resized = await sharp(buffer)
      .resize(canvasSize, canvasSize, { fit: 'inside', withoutEnlargement: true })
      .toBuffer()
    const meta = await sharp(resized).metadata()
    const w = meta.width ?? canvasSize
    const h = meta.height ?? canvasSize
    const left = Math.round((canvasSize - w) / 2)
    const top = Math.round((canvasSize - h) / 2)
    processed = await sharp(resized)
      .extend({
        top,
        bottom: canvasSize - h - top,
        left,
        right: canvasSize - w - left,
        background: { r: 45, g: 42, b: 38 },
      })
      .png({ compressionLevel: 6 })
      .toBuffer()
    subjectRect = { left, top, width: w, height: h }
  }

  return { buffer: processed, size: canvasSize, subjectRect }
}

/** OpenAI SDK types may lag behind API — input_fidelity is supported on gpt-image-1.5 edits */
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

  const maskBuffer = await buildEditMask(prepared.size, prepared.subjectRect, category)
  const maskFile = await toFile(maskBuffer, 'mask.png', { type: 'image/png' })

  const openai = new OpenAI({ apiKey })
  const editParams: ImageEditWithFidelity = {
    model: 'gpt-image-1.5',
    image: [imageFile],
    mask: maskFile,
    prompt,
    size: config.outputSize,
    quality: config.quality,
    input_fidelity: config.inputFidelity,
  }

  const result = await openai.images.edit(editParams)

  const first = result.data?.[0]
  if (!first) {
    throw new Error('No image was generated.')
  }

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

  // Hard guarantee: paste original face pixels over the AI output (all categories)
  return compositeOriginalFaces({
    generatedB64,
    sourcePrepared: prepared,
    category,
    outputSize: 1024,
  })
}
