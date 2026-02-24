import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params

  if (!orderId || !/^[a-f0-9-]{36}$/i.test(orderId)) {
    return NextResponse.json({ error: 'Invalid order ID.' }, { status: 400 })
  }

  const filePath = path.join('/tmp', `order-${orderId}.png`)

  try {
    const buffer = fs.readFileSync(filePath)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="portrait-${orderId}.png"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Image not found or expired.' }, { status: 404 })
  }
}
