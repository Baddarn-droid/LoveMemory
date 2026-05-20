import fs from 'fs'
import os from 'os'
import path from 'path'
import type { CategoryId } from './styles'

export const ORDER_TMP_DIR = os.tmpdir()

export type OrderManifest = {
  prompt: string
  category: CategoryId
  style: string
  subStyleId?: string
  petPose?: 'standing' | 'laying'
  option: 'download' | 'print' | 'framed'
  fulfilled: boolean
  createdAt: string
}

export function orderPaths(orderId: string) {
  const base = path.join(ORDER_TMP_DIR, `order-${orderId}`)
  return {
    preview: `${base}.png`,
    source: `${base}-source.png`,
    manifest: `${base}.manifest.json`,
  }
}

export function readOrderManifest(orderId: string): OrderManifest | null {
  const { manifest } = orderPaths(orderId)
  try {
    return JSON.parse(fs.readFileSync(manifest, 'utf8')) as OrderManifest
  } catch {
    return null
  }
}

export function writeOrderManifest(orderId: string, manifest: OrderManifest) {
  const { manifest: manifestPath } = orderPaths(orderId)
  fs.mkdirSync(ORDER_TMP_DIR, { recursive: true })
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
}
