import sharp from 'sharp'
import type { CategoryId } from './styles'

export interface SubjectRect {
  left: number
  top: number
  width: number
  height: number
}

export interface PreparedPortraitImage {
  buffer: Buffer
  size: number
  subjectRect: SubjectRect
}

interface FaceEllipse {
  cx: number
  cy: number
  rx: number
  ry: number
}

function scaleSubjectRect(subject: SubjectRect, scale: number): SubjectRect {
  return {
    left: Math.round(subject.left * scale),
    top: Math.round(subject.top * scale),
    width: Math.round(subject.width * scale),
    height: Math.round(subject.height * scale),
  }
}

/** Ellipse regions covering head/face — scaled to canvas pixels */
export function getFaceEllipses(
  subject: SubjectRect,
  category: CategoryId | null,
  canvasSize: number
): FaceEllipse[] {
  const aspect = subject.width / Math.max(subject.height, 1)
  const cyBase =
    category === 'pets'
      ? subject.top + subject.height * 0.35
      : subject.top + subject.height * 0.26
  const ry = Math.max(28, subject.height * (category === 'pets' ? 0.42 : 0.4))

  if (category === 'family' && aspect > 1.55) {
    return [0.22, 0.5, 0.78].map((t) => ({
      cx: subject.left + subject.width * t,
      cy: cyBase,
      rx: Math.max(28, subject.width * 0.14),
      ry,
    }))
  }
  if (category === 'family' && aspect > 1.05) {
    return [0.33, 0.67].map((t) => ({
      cx: subject.left + subject.width * t,
      cy: cyBase,
      rx: Math.max(32, subject.width * 0.17),
      ry,
    }))
  }

  return [
    {
      cx: subject.left + subject.width * 0.5,
      cy: cyBase,
      rx: Math.max(36, subject.width * 0.42),
      ry,
    },
  ]
}

function buildSoftEllipseMaskSvg(size: number, ellipses: FaceEllipse[], blur: number): Buffer {
  const ellipseEls = ellipses
    .map(
      (e) =>
        `<ellipse cx="${e.cx.toFixed(1)}" cy="${e.cy.toFixed(1)}" rx="${e.rx.toFixed(1)}" ry="${e.ry.toFixed(1)}" fill="white"/>`
    )
    .join('\n')
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="soften" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="${blur}"/>
    </filter>
  </defs>
  <g filter="url(#soften)">${ellipseEls}</g>
</svg>`
  return Buffer.from(svg)
}

function buildSubjectMaskSvg(size: number, subject: SubjectRect, blur: number): Buffer {
  const r = Math.min(48, subject.width * 0.1)
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="soften" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur stdDeviation="${blur}"/>
    </filter>
  </defs>
  <rect x="${subject.left}" y="${subject.top}" width="${subject.width}" height="${subject.height}"
    rx="${r}" ry="${r}" fill="white" filter="url(#soften)"/>
</svg>`
  return Buffer.from(svg)
}

async function maskSourceWithSvg(
  sourceAtOutput: Buffer,
  maskSvg: Buffer,
  outputSize: number
): Promise<Buffer> {
  const mask = await sharp(maskSvg).resize(outputSize, outputSize).ensureAlpha().png().toBuffer()
  return sharp(sourceAtOutput).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
}

/** Scale alpha channel for semi-transparent compositing */
async function withOpacity(buffer: Buffer, opacity: number): Promise<Buffer> {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const scaled = Buffer.from(data)
  for (let i = 3; i < scaled.length; i += 4) {
    scaled[i] = Math.round(scaled[i] * opacity)
  }
  return sharp(scaled, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()
}

/** Paste original face pixels — hard lock, zero filtering */
async function pasteOriginalFaces(
  generated: Buffer,
  sourceAtOutput: Buffer,
  subject: SubjectRect,
  category: CategoryId | null,
  outputSize: number
): Promise<Buffer> {
  const ellipses = getFaceEllipses(subject, category, outputSize)
  const maskSvg = buildSoftEllipseMaskSvg(outputSize, ellipses, Math.max(4, Math.round(outputSize / 128)))
  const faceLayer = await maskSourceWithSvg(sourceAtOutput, maskSvg, outputSize)
  return sharp(generated).composite([{ input: faceLayer, blend: 'over' }]).png().toBuffer()
}

/**
 * Full pipeline: theme from AI, zero filters on the whole image.
 * 1. Hard-composite original face
 * 2. Soft-blend original subject to kill body filters while keeping themed clothing visible
 * 3. Light full-frame overlay to restore photo texture everywhere
 * 4. Sharpen — crisp unfiltered photograph look
 */
export async function finishUnfilteredThemedPortrait(options: {
  generatedB64: string
  sourcePrepared: PreparedPortraitImage
  category: CategoryId | null
  outputSize: number
}): Promise<string> {
  const { generatedB64, sourcePrepared, category, outputSize } = options
  const scale = outputSize / sourcePrepared.size
  const subject = scaleSubjectRect(sourcePrepared.subjectRect, scale)

  const sourceAtOutput = await sharp(sourcePrepared.buffer)
    .resize(outputSize, outputSize, { fit: 'fill' })
    .ensureAlpha()
    .png()
    .toBuffer()

  let result = await sharp(Buffer.from(generatedB64, 'base64'))
    .resize(outputSize, outputSize, { fit: 'fill' })
    .png()
    .toBuffer()

  // 1 — face: 100% original pixels
  result = await pasteOriginalFaces(result, sourceAtOutput, subject, category, outputSize)

  // 2 — subject: blend original photo over AI body to remove soft/filter look (keeps theme at edges)
  const subjectMaskSvg = buildSubjectMaskSvg(
    outputSize,
    subject,
    Math.max(8, Math.round(outputSize / 96))
  )
  const subjectLayer = await maskSourceWithSvg(sourceAtOutput, subjectMaskSvg, outputSize)
  const subjectBlend = await withOpacity(subjectLayer, 0.38)
  result = await sharp(result).composite([{ input: subjectBlend, blend: 'over' }]).png().toBuffer()

  // 3 — whole frame: restore natural photo grain/texture (background + subject)
  const frameBlend = await withOpacity(sourceAtOutput, 0.14)
  result = await sharp(result)
    .composite([{ input: frameBlend, blend: 'overlay' }])
    .png()
    .toBuffer()

  // 4 — crisp unfiltered photograph finish
  result = await sharp(result)
    .sharpen({ sigma: 1.1, m1: 0.9, m2: 0.35, x1: 2, y2: 8 })
    .png()
    .toBuffer()

  return result.toString('base64')
}

/** Mask for OpenAI edit API — transparent = edit zone, opaque = preserve face */
export async function buildEditMask(
  size: number,
  subject: SubjectRect,
  category: CategoryId | null
): Promise<Buffer> {
  const ellipses = getFaceEllipses(subject, category, size)
  const protectSvg = buildSoftEllipseMaskSvg(size, ellipses, Math.max(4, Math.round(size / 128)))
  return sharp(protectSvg).resize(size, size).ensureAlpha().png().toBuffer()
}
