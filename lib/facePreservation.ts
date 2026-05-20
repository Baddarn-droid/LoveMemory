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

  // Wide group shots → up to 3 face ellipses
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
      rx: Math.max(36, subject.width * 0.38),
      ry,
    },
  ]
}

function buildSoftFaceMaskSvg(size: number, ellipses: FaceEllipse[]): Buffer {
  const ellipseEls = ellipses
    .map(
      (e) =>
        `<ellipse cx="${e.cx.toFixed(1)}" cy="${e.cy.toFixed(1)}" rx="${e.rx.toFixed(1)}" ry="${e.ry.toFixed(1)}" fill="white"/>`
    )
    .join('\n')
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="soften" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${Math.max(4, Math.round(size / 128))}"/>
    </filter>
  </defs>
  <g filter="url(#soften)">
    ${ellipseEls}
  </g>
</svg>`
  return Buffer.from(svg)
}

/**
 * Paste original face pixels from the source photo onto the AI output.
 * This guarantees zero face filtering — the face is literally the upload.
 */
export async function compositeOriginalFaces(options: {
  generatedB64: string
  sourcePrepared: PreparedPortraitImage
  category: CategoryId | null
  outputSize: number
}): Promise<string> {
  const { generatedB64, sourcePrepared, category, outputSize } = options
  const generated = Buffer.from(generatedB64, 'base64')

  const scale = outputSize / sourcePrepared.size
  const subject: SubjectRect = {
    left: Math.round(sourcePrepared.subjectRect.left * scale),
    top: Math.round(sourcePrepared.subjectRect.top * scale),
    width: Math.round(sourcePrepared.subjectRect.width * scale),
    height: Math.round(sourcePrepared.subjectRect.height * scale),
  }

  const ellipses = getFaceEllipses(subject, category, outputSize)
  const maskSvg = buildSoftFaceMaskSvg(outputSize, ellipses)

  const sourceAtOutput = await sharp(sourcePrepared.buffer)
    .resize(outputSize, outputSize, { fit: 'fill' })
    .ensureAlpha()
    .png()
    .toBuffer()

  const mask = await sharp(maskSvg).resize(outputSize, outputSize).ensureAlpha().png().toBuffer()

  const faceLayer = await sharp(sourceAtOutput)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()

  const result = await sharp(generated)
    .resize(outputSize, outputSize, { fit: 'fill' })
    .composite([{ input: faceLayer, blend: 'over' }])
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
  const protectSvg = buildSoftFaceMaskSvg(size, ellipses)

  // White soft ellipses on transparent background → opaque face = preserved, rest = editable
  return sharp(protectSvg).resize(size, size).ensureAlpha().png().toBuffer()
}
