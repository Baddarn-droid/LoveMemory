import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import type { CategoryId } from '@/lib/styles'
import { ORDER_TMP_DIR, orderPaths, writeOrderManifest, type OrderManifest } from '@/lib/orderStorage'
import { randomUUID } from 'crypto'

const OPTIONS = ['download', 'print', 'framed'] as const
type Option = (typeof OPTIONS)[number]

const VALID_CATEGORIES: CategoryId[] = ['pets', 'family']

function decodeBase64Image(imageB64: string): Buffer {
  const base64 = imageB64.replace(/^data:image\/\w+;base64,/, '')
  return Buffer.from(base64, 'base64')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      imageB64,
      sourceImageB64,
      prompt,
      category,
      style,
      subStyleId,
      petPose,
      option,
    } = body

    if (!imageB64 || typeof imageB64 !== 'string') {
      return NextResponse.json({ error: 'Preview image is required.' }, { status: 400 })
    }
    if (!sourceImageB64 || typeof sourceImageB64 !== 'string') {
      return NextResponse.json({ error: 'Original photo is required for full-quality delivery.' }, { status: 400 })
    }
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Portrait prompt is required.' }, { status: 400 })
    }
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category.' }, { status: 400 })
    }
    if (!style || typeof style !== 'string') {
      return NextResponse.json({ error: 'Style is required.' }, { status: 400 })
    }
    if (!option || !OPTIONS.includes(option as Option)) {
      return NextResponse.json({ error: 'Invalid option. Use download, print, or framed.' }, { status: 400 })
    }

    const previewBuffer = decodeBase64Image(imageB64)
    const sourceBuffer = decodeBase64Image(sourceImageB64)

    const orderId = randomUUID()
    const paths = orderPaths(orderId)

    fs.mkdirSync(ORDER_TMP_DIR, { recursive: true })
    fs.writeFileSync(paths.preview, previewBuffer)
    fs.writeFileSync(paths.source, sourceBuffer)

    const manifest: OrderManifest = {
      prompt: prompt.trim(),
      category,
      style,
      subStyleId: typeof subStyleId === 'string' ? subStyleId : undefined,
      petPose: petPose === 'standing' || petPose === 'laying' ? petPose : undefined,
      option,
      fulfilled: false,
      createdAt: new Date().toISOString(),
    }
    writeOrderManifest(orderId, manifest)

    return NextResponse.json({ orderId })
  } catch (err) {
    console.error('prepare-checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to prepare checkout.' },
      { status: 500 }
    )
  }
}
