import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const OPTIONS = ['download', 'print', 'framed'] as const
type Option = (typeof OPTIONS)[number]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageB64, option } = body

    if (!imageB64 || typeof imageB64 !== 'string') {
      return NextResponse.json({ error: 'Image is required.' }, { status: 400 })
    }
    if (!option || !OPTIONS.includes(option as Option)) {
      return NextResponse.json({ error: 'Invalid option. Use download, print, or framed.' }, { status: 400 })
    }

    const base64 = imageB64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64, 'base64')

    const orderId = randomUUID()
    const tmpDir = '/tmp'
    const filePath = path.join(tmpDir, `order-${orderId}.png`)

    fs.mkdirSync(tmpDir, { recursive: true })
    fs.writeFileSync(filePath, buffer)

    return NextResponse.json({ orderId })
  } catch (err) {
    console.error('prepare-checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to prepare checkout.' },
      { status: 500 }
    )
  }
}
