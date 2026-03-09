/**
 * Generate AI pet example images for each style.
 * Run with: npx tsx scripts/generate-pet-examples.ts
 * Requires: npm run dev running on http://localhost:3000
 *
 * 1. Uses 3 seed images from public/seed/pets/: pet1, pet2, pet3 (jpg or png).
 *    Recommended: cat (1), horse (2), dachshund (3) — centered, not too zoomed.
 *    If missing, downloads fallback images from Unsplash.
 * 2. For each style (Renaissance, Baroque, Rococo, etc.), generates 3 images.
 * 3. Saves to public/examples/pets-{styleId}-1.png, pets-{styleId}-2.png, pets-{styleId}-3.png.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ALL_STYLE_IDS } from '../lib/styles'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SEED_DIR = path.join(ROOT, 'public', 'seed', 'pets')
const EXAMPLES_DIR = path.join(ROOT, 'public', 'examples')
const PORT = process.env.PORT || 3000
const API_URL = `http://localhost:${PORT}/api/generate-portrait`

/** Unsplash fallback URLs if seed images are missing (dog, cat, dog) */
const SEED_URLS = [
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1024',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1024',
  'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1024',
]

function findSeedPath(index: number): string | null {
  const base = path.join(SEED_DIR, `pet${index}`)
  for (const ext of ['.jpg', '.jpeg', '.png', '.avif']) {
    const p = base + ext
    if (fs.existsSync(p)) return p
  }
  return null
}

async function ensureSeedImages(): Promise<string[]> {
  fs.mkdirSync(SEED_DIR, { recursive: true })
  const paths: string[] = []
  for (let i = 1; i <= 3; i++) {
    let p = findSeedPath(i)
    if (!p) {
      console.log(`No pet${i} image found, downloading fallback...`)
      p = path.join(SEED_DIR, `pet${i}.jpg`)
      const res = await fetch(SEED_URLS[i - 1])
      if (!res.ok) {
        if (i > 1) {
          console.log(`  Failed (${res.status}), using pet1 as fallback`)
          fs.copyFileSync(paths[0], p)
        } else {
          throw new Error(`Failed to download seed ${i}: ${res.status}`)
        }
      } else {
        const buf = Buffer.from(await res.arrayBuffer())
        fs.writeFileSync(p, buf)
        console.log(`  Saved to ${p}`)
      }
    } else {
      console.log(`Using seed: ${path.basename(p)}`)
    }
    paths.push(p)
  }
  return paths
}

async function generateOne(
  imagePath: string,
  styleId: string,
  index: number
): Promise<Buffer> {
  const formData = new FormData()
  const ext = path.extname(imagePath).toLowerCase()
  const mime = ext === '.png' ? 'image/png' : ext === '.avif' ? 'image/avif' : 'image/jpeg'
  const blob = new Blob([fs.readFileSync(imagePath)], { type: mime })
  formData.append('image', blob, path.basename(imagePath))
  formData.append('category', 'pets')
  formData.append('style', styleId)
  formData.append('petPose', 'standing')

  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  })

  const text = await res.text()
  let data: { b64?: string; url?: string; error?: string }
  try {
    data = JSON.parse(text) as { b64?: string; url?: string; error?: string }
  } catch {
    throw new Error(!res.ok ? `API ${res.status}: ${text.slice(0, 200)}` : 'Response was not JSON')
  }
  if (!res.ok) throw new Error(data.error || `API ${res.status}`)
  if (data.b64) return Buffer.from(data.b64, 'base64')
  if (data.url) {
    const imgRes = await fetch(data.url)
    return Buffer.from(await imgRes.arrayBuffer())
  }
  throw new Error('No image in response')
}

async function main() {
  // Usage: npx tsx scripts/generate-pet-examples [--force] [limit]
  // --force = regenerate even if file exists (for fixing framing/headroom)
  // limit = number of styles to process (e.g. 5 for quick test)
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const limitArg = args.find((a) => a !== '--force')
  const limit = limitArg ? parseInt(limitArg, 10) : undefined
  const styleIds = limit ? ALL_STYLE_IDS.slice(0, limit) : ALL_STYLE_IDS

  console.log('Generating pet examples for', styleIds.length, 'styles')
  if (force) console.log('(--force: regenerating existing files)')
  if (limit) console.log('(limited to first', limit, 'styles - remove arg for all)')
  console.log('Seed images:', SEED_DIR)
  console.log('Output:', EXAMPLES_DIR)
  console.log('')

  const seedPaths = await ensureSeedImages()
  fs.mkdirSync(EXAMPLES_DIR, { recursive: true })

  let done = 0
  const total = styleIds.length * 3

  for (const styleId of styleIds) {
    for (let i = 0; i < 3; i++) {
      const outPath = path.join(EXAMPLES_DIR, `pets-${styleId}-${i + 1}.png`)
      if (!force && fs.existsSync(outPath)) {
        console.log(`Skip (exists): pets-${styleId}-${i + 1}.png`)
        done++
        continue
      }
      try {
        console.log(`Generating: pets-${styleId}-${i + 1}.png`)
        const buf = await generateOne(seedPaths[i], styleId, i + 1)
        fs.writeFileSync(outPath, buf)
        done++
        console.log(`  Done (${done}/${total})`)
      } catch (err) {
        console.error(`  Error:`, err)
      }
    }
  }

  console.log('')
  console.log('Finished.', done, 'images generated.')
}

main().catch(console.error)
