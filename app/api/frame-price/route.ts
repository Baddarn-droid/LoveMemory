import { NextResponse } from 'next/server'
import {
  applyMarkupPence,
  FRAME_COLOURS,
  FRAME_SIZES,
  formatGbpFromPence,
} from '@/lib/frameCatalog'
import { isProdigiConfigured, quoteFramedPrintGbpPence } from '@/lib/prodigi'

export async function GET() {
  if (!isProdigiConfigured()) {
    return NextResponse.json({ error: 'Prodigi is not configured.' }, { status: 503 })
  }
  try {
    const sizes = await Promise.all(
      FRAME_SIZES.map(async (size) => {
        const quote = await quoteFramedPrintGbpPence({
          countryCode: 'GB',
          color: 'gold',
          sizeId: size.id,
        })
        const retailPence = applyMarkupPence(quote.costPence, size.capPence)
        return {
          id: size.id,
          sku: size.sku,
          label: size.label,
          hint: size.hint,
          framed: size.framed,
          retailPence,
          display: formatGbpFromPence(retailPence),
        }
      })
    )
    return NextResponse.json({ sizes, colours: FRAME_COLOURS })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Price unavailable.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
