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
  _canvasSize: number
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

/**
 * Light finish on the AI output only — no overlay of the source photo.
 * Overlays caused a visible picture-in-picture bug when the themed pose differed from the upload.
 */
export async function finishUnfilteredThemedPortrait(options: {
  generatedB64: string
  sourcePrepared: PreparedPortraitImage
  category: CategoryId | null
  outputSize: number
}): Promise<string> {
  const { generatedB64, outputSize } = options

  const result = await sharp(Buffer.from(generatedB64, 'base64'))
    .resize(outputSize, outputSize, { fit: 'fill' })
    .sharpen({ sigma: 0.6, m1: 0.4, m2: 0.15 })
    .png()
    .toBuffer()

  return result.toString('base64')
}
