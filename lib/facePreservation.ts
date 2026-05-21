import sharp from 'sharp'
import type { CategoryId } from './styles'

export interface SubjectRect {
  left: number
  top: number
  width: number
  height: number
}

export interface PreparedSource {
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

/** Tight ellipses — face only (not full body), avoids picture-in-picture */
export function getFaceEllipses(
  subject: SubjectRect,
  category: CategoryId | null
): FaceEllipse[] {
  const aspect = subject.width / Math.max(subject.height, 1)
  const cy = category === 'pets' ? subject.top + subject.height * 0.36 : subject.top + subject.height * 0.3
  const ry = Math.max(22, subject.height * (category === 'pets' ? 0.2 : 0.18))
  const rxSingle = Math.max(28, subject.width * 0.28)

  if (category === 'family' && aspect > 1.5) {
    return [0.25, 0.5, 0.75].map((t) => ({
      cx: subject.left + subject.width * t,
      cy,
      rx: Math.max(24, subject.width * 0.12),
      ry,
    }))
  }
  if (category === 'family' && aspect > 1.05) {
    return [0.35, 0.65].map((t) => ({
      cx: subject.left + subject.width * t,
      cy,
      rx: Math.max(26, subject.width * 0.15),
      ry,
    }))
  }

  return [{ cx: subject.left + subject.width * 0.5, cy, rx: rxSingle, ry }]
}

function faceMaskSvg(size: number, ellipses: FaceEllipse[], blur: number): Buffer {
  const els = ellipses
    .map(
      (e) =>
        `<ellipse cx="${e.cx.toFixed(1)}" cy="${e.cy.toFixed(1)}" rx="${e.rx.toFixed(1)}" ry="${e.ry.toFixed(1)}" fill="white"/>`
    )
    .join('')
  return Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="b"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>
  <g filter="url(#b)">${els}</g></svg>`)
}

/** Opaque face regions = preserved during OpenAI edit (transparent elsewhere = editable) */
export async function buildFaceProtectMask(
  size: number,
  subject: SubjectRect,
  category: CategoryId | null
): Promise<Buffer> {
  const svg = faceMaskSvg(size, getFaceEllipses(subject, category), Math.max(6, Math.round(size / 140)))
  return sharp(svg).resize(size, size).ensureAlpha().png().toBuffer()
}

/**
 * Paste original face pixels onto the AI output (face oval only, heavily feathered).
 * Same symmetric letterbox on both images so coordinates align.
 */
export async function restoreFacesFromSource(
  generatedB64: string,
  source: PreparedSource,
  category: CategoryId | null,
  outputSize: number
): Promise<string> {
  const sourceAtSize = await sharp(source.buffer)
    .resize(outputSize, outputSize, { fit: 'fill' })
    .ensureAlpha()
    .png()
    .toBuffer()

  const scale = outputSize / source.size
  const subject: SubjectRect = {
    left: Math.round(source.subjectRect.left * scale),
    top: Math.round(source.subjectRect.top * scale),
    width: Math.round(source.subjectRect.width * scale),
    height: Math.round(source.subjectRect.height * scale),
  }

  const svg = faceMaskSvg(outputSize, getFaceEllipses(subject, category), Math.max(10, Math.round(outputSize / 90)))
  const mask = await sharp(svg).resize(outputSize, outputSize).ensureAlpha().png().toBuffer()

  const faceLayer = await sharp(sourceAtSize)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()

  const result = await sharp(Buffer.from(generatedB64, 'base64'))
    .resize(outputSize, outputSize, { fit: 'fill' })
    .composite([{ input: faceLayer, blend: 'over' }])
    .png()
    .toBuffer()

  return result.toString('base64')
}
