/**
 * Generate AI pet example images for each style.
 * Run with: npx tsx scripts/generate-pet-examples.ts
 * Requires: npm run dev running on http://localhost:3000
 *
 * 1. Downloads 3 seed pet images from Unsplash if public/seed/pets/ is empty
 * 2. For each style, generates 3 AI images via the API
 * 3. Saves to public/examples/pets-{styleId}-1.png, etc.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ALL_STYLE_IDS } from '../lib/styles'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SEED_DIR = path.join(ROOT, 'public', 'seed', 'pets')
const EXAMPLES_DIR = path.join(ROOT, 'public', 'examples')
const API_URL = 'http://localhost:3000/api/generate-portrait'

/** Unsplash pet photo URLs (royalty-free): dog, cat, dog */
const SEED_URLS = [
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1024',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1024',
  'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1024',
]

async function ensureSeedImages(): Promise<string[]> {
  fs.mkdirSync(SEED_DIR, { recursive: true })
  const paths: string[] = []
  for (let i = 1; i <= 3; i++) {
    const p = path.join(SEED_DIR, `pet${i}.jpg`)
    if (!fs.existsSync(p)) {
      console.log(`Downloading seed image ${i}...`)
      const res = await fetch(SEED_URLS[i - 1])
      if (!res.ok) {
        if (i > 1) {
          console.log(`  Failed (${res.status}), using pet1.jpg as fallback`)
          fs.copyFileSync(paths[0], p)
        } else {
          throw new Error(`Failed to download seed ${i}: ${res.status}`)
        }
      } else {
        const buf = Buffer.from(await res.arrayBuffer())
        fs.writeFileSync(p, buf)
        console.log(`  Saved to ${p}`)
      }
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
  const blob = new Blob([fs.readFileSync(imagePath)], { type: 'image/jpeg' })
  formData.append('image', blob, 'pet.jpg')
  formData.append('category', 'pets')
  formData.append('style', styleId)
  formData.append('petPose', 'standing')

  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  })

  const data = (await res.json()) as { b64?: string; url?: string; error?: string }
  if (!res.ok) throw new Error(data.error || `API ${res.status}`)
  if (data.b64) return Buffer.from(data.b64, 'base64')
  if (data.url) {
    const imgRes = await fetch(data.url)
    return Buffer.from(await imgRes.arrayBuffer())
  }
  throw new Error('No image in response')
}

async function main() {
  // Usage: npm run generate-pet-examples [limit]
  // limit = number of styles to process (e.g. 5 for quick test)
  const limit = process.argv[2] ? parseInt(process.argv[2], 10) : undefined
  const styleIds = limit ? ALL_STYLE_IDS.slice(0, limit) : ALL_STYLE_IDS

  console.log('Generating pet examples for', styleIds.length, 'styles')
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
      if (fs.existsSync(outPath)) {
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
