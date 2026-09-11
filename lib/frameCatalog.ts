/** Prodigi classic frames (GLOBAL-CFP). Retail = cost × 1.4, capped. */

export const DEFAULT_FRAME_COLOUR = 'gold'
export const DEFAULT_FRAME_SIZE = 'small'
export const PRICE_MARKUP = 1.4
export const SMALL_PRICE_CAP_PENCE = 3000
export const LARGE_PRICE_CAP_PENCE = 5900

export const FRAME_SIZES = [
  {
    id: 'small',
    option: 'framed' as const,
    sku: 'GLOBAL-CFP-5X7',
    label: '5×7″ framed',
    hint: 'Classic wood frame · desk or shelf',
    shippingMethod: 'Budget' as const,
    framed: true,
    capPence: SMALL_PRICE_CAP_PENCE,
    /** Glaze 5×7 — same 20mm moulding as Prodigi */
    aspect: '5 / 7',
  },
  {
    id: 'large',
    option: 'framed' as const,
    sku: 'GLOBAL-CFP-A4',
    label: 'A4 framed',
    hint: 'Classic wood frame · 21×29.7cm wall print',
    shippingMethod: 'Budget' as const,
    framed: true,
    capPence: LARGE_PRICE_CAP_PENCE,
    aspect: '210 / 297',
  },
] as const

export type FrameSizeId = (typeof FRAME_SIZES)[number]['id']

export function getFrameSize(id: unknown) {
  return FRAME_SIZES.find((s) => s.id === id) ?? FRAME_SIZES[0]
}

export function isFrameSize(value: unknown): value is FrameSizeId {
  return FRAME_SIZES.some((s) => s.id === value)
}

export const FRAME_COLOURS = [
  { id: 'gold', label: 'Antique gold' },
  { id: 'black', label: 'Black' },
  { id: 'white', label: 'White' },
  { id: 'silver', label: 'Antique silver' },
  { id: 'natural', label: 'Natural' },
  { id: 'brown', label: 'Brown' },
  { id: 'dark grey', label: 'Dark grey' },
  { id: 'light grey', label: 'Light grey' },
] as const

export type FrameColourId = (typeof FRAME_COLOURS)[number]['id']

export function isFrameColour(value: unknown): value is FrameColourId {
  return FRAME_COLOURS.some((c) => c.id === value)
}

export function frameColourForIndex(index: number): FrameColourId {
  return FRAME_COLOURS[index % FRAME_COLOURS.length].id
}

/**
 * Satin-laminated 20mm classic moulding (Prodigi CFP).
 * No mount — print sits in the rebate, behind perspex.
 */
export const FRAME_FINISH: Record<
  FrameColourId,
  { wood: string; bevel: string; lip: string }
> = {
  gold: {
    wood: 'linear-gradient(145deg, #c9a227 0%, #8a6a14 18%, #e8c547 36%, #9a7518 52%, #d4af37 70%, #6e5410 100%)',
    bevel: 'linear-gradient(180deg, #f0d36a, #7a5b12)',
    lip: '#5c430c',
  },
  black: {
    wood: 'linear-gradient(145deg, #2a2a2a 0%, #0a0a0a 40%, #1c1c1c 70%, #050505 100%)',
    bevel: 'linear-gradient(180deg, #4a4a4a, #111)',
    lip: '#000',
  },
  white: {
    wood: 'linear-gradient(145deg, #f7f7f7 0%, #d8d8d8 38%, #efefef 68%, #bdbdbd 100%)',
    bevel: 'linear-gradient(180deg, #d4d4d4, #8a8a8a)',
    lip: '#5c5c5c',
  },
  silver: {
    wood: 'linear-gradient(145deg, #d8d8de 0%, #8e8e98 28%, #cfcfd6 50%, #6a6a74 78%, #b8b8c0 100%)',
    bevel: 'linear-gradient(180deg, #a8a8b0, #5c5c64)',
    lip: '#3f3f46',
  },
  natural: {
    wood: 'linear-gradient(145deg, #e4c9a0 0%, #c4a06a 30%, #a07840 55%, #d2b48c 80%, #8b6914 100%)',
    bevel: 'linear-gradient(180deg, #edd9b5, #7a5a32)',
    lip: '#6b4f28',
  },
  brown: {
    wood: 'linear-gradient(145deg, #6b3e26 0%, #3d2314 40%, #5c3317 70%, #2a160c 100%)',
    bevel: 'linear-gradient(180deg, #8a5538, #1a0e08)',
    lip: '#1a0e08',
  },
  'dark grey': {
    wood: 'linear-gradient(145deg, #4a4a4a 0%, #222 40%, #383838 70%, #151515 100%)',
    bevel: 'linear-gradient(180deg, #6a6a6a, #1a1a1a)',
    lip: '#101010',
  },
  'light grey': {
    wood: 'linear-gradient(145deg, #cfcfcf 0%, #9a9a9a 40%, #b8b8b8 70%, #888 100%)',
    bevel: 'linear-gradient(180deg, #e8e8e8, #6a6a6a)',
    lip: '#4a4a4a',
  },
}

export function formatGbpFromPence(pence: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)
}

export function applyMarkupPence(costPence: number, capPence?: number): number {
  const marked = Math.round(costPence * PRICE_MARKUP)
  return capPence != null ? Math.min(marked, capPence) : marked
}
